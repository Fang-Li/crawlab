package handler

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/crawlab-team/crawlab/core/models/models"

	"github.com/apex/log"
	"github.com/crawlab-team/crawlab/core/constants"
	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/crawlab-team/crawlab/core/fs"
	client2 "github.com/crawlab-team/crawlab/core/grpc/client"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/models/client"
	"github.com/crawlab-team/crawlab/core/models/service"
	"github.com/crawlab-team/crawlab/core/sys_exec"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/crawlab-team/crawlab/grpc"
	"github.com/crawlab-team/crawlab/trace"
	"github.com/shirou/gopsutil/process"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Runner struct {
	// dependencies
	svc   *Service             // task handler service
	fsSvc interfaces.FsService // task fs service

	// settings
	subscribeTimeout time.Duration
	bufferSize       int

	// internals
	cmd  *exec.Cmd                      // process command instance
	pid  int                            // process id
	tid  primitive.ObjectID             // task id
	t    *models.Task                   // task model.Task
	s    *models.Spider                 // spider model.Spider
	ch   chan constants.TaskSignal      // channel to communicate between Service and Runner
	err  error                          // standard process error
	cwd  string                         // working directory
	c    *client2.GrpcClient            // grpc client
	conn grpc.TaskService_ConnectClient // grpc task service stream client

	// log internals
	scannerStdout *bufio.Reader
	scannerStderr *bufio.Reader
	logBatchSize  int
}

func (r *Runner) Init() (err error) {
	// update task
	if err := r.updateTask("", nil); err != nil {
		return err
	}

	// start grpc client
	if !r.c.IsStarted() {
		err := r.c.Start()
		if err != nil {
			return err
		}
	}

	// grpc task service stream client
	if err := r.initConnection(); err != nil {
		return err
	}

	return nil
}

func (r *Runner) Run() (err error) {
	// log task started
	log.Infof("task[%s] started", r.tid.Hex())

	// configure working directory
	r.configureCwd()

	// sync files worker nodes
	if !utils.IsMaster() {
		if err := r.syncFiles(); err != nil {
			return r.updateTask(constants.TaskStatusError, err)
		}
	}

	// configure cmd
	err = r.configureCmd()
	if err != nil {
		return r.updateTask(constants.TaskStatusError, err)
	}

	// configure environment variables
	r.configureEnv()

	// configure logging
	r.configureLogging()

	// start process
	if err := r.cmd.Start(); err != nil {
		return r.updateTask(constants.TaskStatusError, err)
	}

	// start logging
	go r.startLogging()

	// process id
	if r.cmd.Process == nil {
		return r.updateTask(constants.TaskStatusError, constants.ErrNotExists)
	}
	r.pid = r.cmd.Process.Pid
	r.t.Pid = r.pid

	// update task status (processing)
	if err := r.updateTask(constants.TaskStatusRunning, nil); err != nil {
		return err
	}

	// wait for process to finish
	go r.wait()

	// start health check
	go r.startHealthCheck()

	// declare task status
	status := ""

	// wait for signal
	signal := <-r.ch
	switch signal {
	case constants.TaskSignalFinish:
		err = nil
		status = constants.TaskStatusFinished
	case constants.TaskSignalCancel:
		err = constants.ErrTaskCancelled
		status = constants.TaskStatusCancelled
	case constants.TaskSignalError:
		err = r.err
		status = constants.TaskStatusError
	case constants.TaskSignalLost:
		err = constants.ErrTaskLost
		status = constants.TaskStatusError
	default:
		err = constants.ErrInvalidSignal
		status = constants.TaskStatusError
	}

	// update task status
	if err := r.updateTask(status, err); err != nil {
		return err
	}

	return err
}

func (r *Runner) Cancel(force bool) (err error) {
	// kill process
	opts := &sys_exec.KillProcessOptions{
		Timeout: r.svc.GetCancelTimeout(),
		Force:   force,
	}
	if err := sys_exec.KillProcess(r.cmd, opts); err != nil {
		return err
	}

	// make sure the process does not exist
	ticker := time.NewTicker(1 * time.Second)
	timeout := time.After(r.svc.GetCancelTimeout())
	for {
		select {
		case <-timeout:
			return errors.New(fmt.Sprintf("task process %d still exists", r.pid))
		case <-ticker.C:
			if exists, _ := process.PidExists(int32(r.pid)); exists {
				return errors.New(fmt.Sprintf("task process %d still exists", r.pid))
			}
			return nil
		}
	}
}

func (r *Runner) SetSubscribeTimeout(timeout time.Duration) {
	r.subscribeTimeout = timeout
}

func (r *Runner) GetTaskId() (id primitive.ObjectID) {
	return r.tid
}

func (r *Runner) configureCmd() (err error) {
	var cmdStr string

	// customized spider
	if r.t.Cmd == "" {
		cmdStr = r.s.Cmd
	} else {
		cmdStr = r.t.Cmd
	}

	// parameters
	if r.t.Param != "" {
		cmdStr += " " + r.t.Param
	} else if r.s.Param != "" {
		cmdStr += " " + r.s.Param
	}

	// get cmd instance
	r.cmd, err = sys_exec.BuildCmd(cmdStr)
	if err != nil {
		log.Errorf("error building command: %v", err)
		trace.PrintError(err)
		return err
	}

	// set working directory
	r.cmd.Dir = r.cwd

	return nil
}

func (r *Runner) configureLogging() {
	// set stdout reader
	stdout, _ := r.cmd.StdoutPipe()
	r.scannerStdout = bufio.NewReaderSize(stdout, r.bufferSize)

	// set stderr reader
	stderr, _ := r.cmd.StderrPipe()
	r.scannerStderr = bufio.NewReaderSize(stderr, r.bufferSize)
}

func (r *Runner) startLogging() {
	// start reading stdout
	go r.startLoggingReaderStdout()

	// start reading stderr
	go r.startLoggingReaderStderr()
}

func (r *Runner) startLoggingReaderStdout() {
	for {
		line, err := r.scannerStdout.ReadString(byte('\n'))
		if err != nil {
			break
		}
		line = strings.TrimSuffix(line, "\n")
		r.writeLogLines([]string{line})
	}
}

func (r *Runner) startLoggingReaderStderr() {
	for {
		line, err := r.scannerStderr.ReadString(byte('\n'))
		if err != nil {
			break
		}
		line = strings.TrimSuffix(line, "\n")
		r.writeLogLines([]string{line})
	}
}

func (r *Runner) startHealthCheck() {
	if r.cmd.ProcessState == nil || r.cmd.ProcessState.Exited() {
		return
	}
	for {
		exists, _ := process.PidExists(int32(r.pid))
		if !exists {
			// process lost
			r.ch <- constants.TaskSignalLost
			return
		}
		time.Sleep(1 * time.Second)
	}
}

func (r *Runner) configureEnv() {
	// By default, add Node.js's global node_modules to PATH
	envPath := os.Getenv("PATH")
	nodePath := "/usr/lib/node_modules"
	if !strings.Contains(envPath, nodePath) {
		_ = os.Setenv("PATH", nodePath+":"+envPath)
	}
	_ = os.Setenv("NODE_PATH", nodePath)

	// Default envs
	r.cmd.Env = append(os.Environ(), "CRAWLAB_TASK_ID="+r.tid.Hex())
	if utils.GetGrpcAddress() != "" {
		r.cmd.Env = append(r.cmd.Env, "CRAWLAB_GRPC_ADDRESS="+utils.GetGrpcAddress())
	}
	if viper.GetString("grpc.authKey") != "" {
		r.cmd.Env = append(r.cmd.Env, "CRAWLAB_GRPC_AUTH_KEY="+viper.GetString("grpc.authKey"))
	} else {
		r.cmd.Env = append(r.cmd.Env, "CRAWLAB_GRPC_AUTH_KEY="+constants.DefaultGrpcAuthKey)
	}

	// Global environment variables
	envs, err := client.NewModelService[models.Environment]().GetMany(nil, nil)
	if err != nil {
		trace.PrintError(err)
		return
	}
	for _, env := range envs {
		r.cmd.Env = append(r.cmd.Env, env.Key+"="+env.Value)
	}
}

func (r *Runner) createHttpRequest(method, path string) (*http.Response, error) {
	// Construct master URL
	var id string
	if r.s.GitId.IsZero() {
		id = r.s.Id.Hex()
	} else {
		id = r.s.GitId.Hex()
	}
	url := fmt.Sprintf("%s/sync/%s%s", utils.GetApiEndpoint(), id, path)

	// Create and execute request
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	for k, v := range r.getHttpRequestHeaders() {
		req.Header.Set(k, v)
	}

	return http.DefaultClient.Do(req)
}

func (r *Runner) syncFiles() (err error) {
	workingDir := ""
	if !r.s.GitId.IsZero() {
		workingDir = r.s.GitRootPath
	}

	// get file list from master
	resp, err := r.createHttpRequest("GET", "/scan?path="+workingDir)
	if err != nil {
		log.Errorf("error getting file list from master: %v", err)
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Errorf("error reading response body: %v", err)
		return err
	}
	var masterFiles map[string]entity.FsFileInfo
	err = json.Unmarshal(body, &masterFiles)
	if err != nil {
		log.Errorf("error unmarshaling JSON: %v", err)
		return err
	}

	// create a map for master files
	masterFilesMap := make(map[string]entity.FsFileInfo)
	for _, file := range masterFiles {
		masterFilesMap[file.Path] = file
	}

	// create working directory if not exists
	if _, err := os.Stat(r.cwd); os.IsNotExist(err) {
		if err := os.MkdirAll(r.cwd, os.ModePerm); err != nil {
			log.Errorf("error creating worker directory: %v", err)
			return err
		}
	}

	// get file list from worker
	workerFiles, err := utils.ScanDirectory(r.cwd)
	if err != nil {
		log.Errorf("error scanning worker directory: %v", err)
		return trace.TraceError(err)
	}

	// delete files that are deleted on master node
	for path, workerFile := range workerFiles {
		if _, exists := masterFilesMap[path]; !exists {
			log.Infof("deleting file: %s", path)
			err := os.Remove(workerFile.FullPath)
			if err != nil {
				log.Errorf("error deleting file: %v", err)
			}
		}
	}

	// set up wait group and error channel
	var wg sync.WaitGroup
	pool := make(chan struct{}, 10)

	// download files that are new or modified on master node
	for path, masterFile := range masterFilesMap {
		workerFile, exists := workerFiles[path]
		if !exists || masterFile.Hash != workerFile.Hash {
			wg.Add(1)

			// acquire token
			pool <- struct{}{}

			// start goroutine to synchronize file or directory
			go func(path string, masterFile *entity.FsFileInfo) {
				defer wg.Done()

				if masterFile.IsDir {
					log.Infof("directory needs to be synchronized: %s", path)
					_err := os.MkdirAll(filepath.Join(r.cwd, path), masterFile.Mode)
					if _err != nil {
						log.Errorf("error creating directory: %v", _err)
						err = errors.Join(err, _err)
					}
				} else {
					log.Infof("file needs to be synchronized: %s", path)
					_err := r.downloadFile(path, filepath.Join(r.cwd, path), masterFile)
					if _err != nil {
						log.Errorf("error downloading file: %v", _err)
						err = errors.Join(err, _err)
					}
				}

				// release token
				<-pool

			}(path, &masterFile)
		}
	}

	// wait for all files and directories to be synchronized
	wg.Wait()

	return err
}

func (r *Runner) downloadFile(path string, filePath string, fileInfo *entity.FsFileInfo) error {
	resp, err := r.createHttpRequest("GET", "/download?path="+path)
	if err != nil {
		log.Errorf("error getting file response: %v", err)
		return err
	}
	if resp.StatusCode != http.StatusOK {
		log.Errorf("error downloading file: %s", resp.Status)
		return errors.New(resp.Status)
	}
	defer resp.Body.Close()

	// create directory if not exists
	dirPath := filepath.Dir(filePath)
	utils.Exists(dirPath)
	err = os.MkdirAll(dirPath, os.ModePerm)
	if err != nil {
		log.Errorf("error creating directory: %v", err)
		return err
	}

	// create local file
	out, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, fileInfo.Mode)
	if err != nil {
		log.Errorf("error creating file: %v", err)
		return err
	}
	defer out.Close()

	// copy file content to local file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		log.Errorf("error copying file: %v", err)
		return err
	}
	return nil
}

func (r *Runner) getHttpRequestHeaders() (headers map[string]string) {
	headers = make(map[string]string)
	headers["Authorization"] = utils.GetAuthKey()
	return headers
}

// wait for process to finish and send task signal (constants.TaskSignal)
// to task runner's channel (Runner.ch) according to exit code
func (r *Runner) wait() {
	// wait for process to finish
	if err := r.cmd.Wait(); err != nil {
		var exitError *exec.ExitError
		ok := errors.As(err, &exitError)
		if !ok {
			r.ch <- constants.TaskSignalError
			return
		}
		exitCode := exitError.ExitCode()
		if exitCode == -1 {
			// cancel error
			r.ch <- constants.TaskSignalCancel
			return
		}

		// standard error
		r.err = err
		r.ch <- constants.TaskSignalError
		return
	}

	// success
	r.ch <- constants.TaskSignalFinish
}

// updateTask update and get updated info of task (Runner.t)
func (r *Runner) updateTask(status string, e error) (err error) {
	if r.t != nil && status != "" {
		// update task status
		r.t.Status = status
		if e != nil {
			r.t.Error = e.Error()
		}
		if r.svc.GetNodeConfigService().IsMaster() {
			err = service.NewModelService[models.Task]().ReplaceById(r.t.Id, *r.t)
			if err != nil {
				return err
			}
		} else {
			err = client.NewModelService[models.Task]().ReplaceById(r.t.Id, *r.t)
			if err != nil {
				return err
			}
		}

		// update stats
		r._updateTaskStat(status)
		r._updateSpiderStat(status)

		// send notification
		go r.sendNotification()
	}

	// get task
	r.t, err = r.svc.GetTaskById(r.tid)
	if err != nil {
		return err
	}

	return nil
}

func (r *Runner) initConnection() (err error) {
	r.conn, err = r.c.TaskClient.Connect(context.Background())
	if err != nil {
		return trace.TraceError(err)
	}
	return nil
}

func (r *Runner) writeLogLines(lines []string) {
	linesBytes, err := json.Marshal(lines)
	if err != nil {
		log.Errorf("error marshaling log lines: %v", err)
		return
	}
	msg := &grpc.TaskServiceConnectRequest{
		Code:   grpc.TaskServiceConnectCode_INSERT_LOGS,
		TaskId: r.tid.Hex(),
		Data:   linesBytes,
	}
	if err := r.conn.Send(msg); err != nil {
		log.Errorf("error sending log lines: %v", err)
		return
	}
}

func (r *Runner) _updateTaskStat(status string) {
	ts, err := client.NewModelService[models.TaskStat]().GetById(r.tid)
	if err != nil {
		trace.PrintError(err)
		return
	}
	switch status {
	case constants.TaskStatusPending:
		// do nothing
	case constants.TaskStatusRunning:
		ts.StartTs = time.Now()
		ts.WaitDuration = ts.StartTs.Sub(ts.CreatedAt).Milliseconds()
	case constants.TaskStatusFinished, constants.TaskStatusError, constants.TaskStatusCancelled:
		if ts.StartTs.IsZero() {
			ts.StartTs = time.Now()
			ts.WaitDuration = ts.StartTs.Sub(ts.CreatedAt).Milliseconds()
		}
		ts.EndTs = time.Now()
		ts.RuntimeDuration = ts.EndTs.Sub(ts.StartTs).Milliseconds()
		ts.TotalDuration = ts.EndTs.Sub(ts.CreatedAt).Milliseconds()
	}
	if r.svc.GetNodeConfigService().IsMaster() {
		err = service.NewModelService[models.TaskStat]().ReplaceById(ts.Id, *ts)
		if err != nil {
			trace.PrintError(err)
			return
		}
	} else {
		err = client.NewModelService[models.TaskStat]().ReplaceById(ts.Id, *ts)
		if err != nil {
			trace.PrintError(err)
			return
		}
	}
}

func (r *Runner) sendNotification() {
	req := &grpc.TaskServiceSendNotificationRequest{
		NodeKey: r.svc.GetNodeConfigService().GetNodeKey(),
		TaskId:  r.tid.Hex(),
	}
	_, err := r.c.TaskClient.SendNotification(context.Background(), req)
	if err != nil {
		log.Errorf("error sending notification: %v", err)
		trace.PrintError(err)
		return
	}
}

func (r *Runner) _updateSpiderStat(status string) {
	// task stat
	ts, err := client.NewModelService[models.TaskStat]().GetById(r.tid)
	if err != nil {
		trace.PrintError(err)
		return
	}

	// update
	var update bson.M
	switch status {
	case constants.TaskStatusPending, constants.TaskStatusRunning:
		update = bson.M{
			"$set": bson.M{
				"last_task_id": r.tid, // last task id
			},
			"$inc": bson.M{
				"tasks":         1,               // task count
				"wait_duration": ts.WaitDuration, // wait duration
			},
		}
	case constants.TaskStatusFinished, constants.TaskStatusError, constants.TaskStatusCancelled:
		update = bson.M{
			"$set": bson.M{
				"last_task_id": r.tid, // last task id
			},
			"$inc": bson.M{
				"results":          ts.ResultCount,            // results
				"runtime_duration": ts.RuntimeDuration / 1000, // runtime duration
				"total_duration":   ts.TotalDuration / 1000,   // total duration
			},
		}
	default:
		log.Errorf("Invalid task status: %s", status)
		trace.PrintError(errors.New("invalid task status"))
		return
	}

	// perform update
	if r.svc.GetNodeConfigService().IsMaster() {
		err = service.NewModelService[models.SpiderStat]().UpdateById(r.s.Id, update)
		if err != nil {
			trace.PrintError(err)
			return
		}
	} else {
		err = client.NewModelService[models.SpiderStat]().UpdateById(r.s.Id, update)
		if err != nil {
			trace.PrintError(err)
			return
		}
	}
}

func (r *Runner) configureCwd() {
	workspacePath := utils.GetWorkspace()
	if r.s.GitId.IsZero() {
		// not git
		r.cwd = filepath.Join(workspacePath, r.s.Id.Hex())
	} else {
		// git
		r.cwd = filepath.Join(workspacePath, r.s.GitId.Hex(), r.s.GitRootPath)
	}
}

func newTaskRunner(id primitive.ObjectID, svc *Service) (r2 *Runner, err error) {
	// validate options
	if id.IsZero() {
		return nil, constants.ErrInvalidOptions
	}

	// runner
	r := &Runner{
		subscribeTimeout: 30 * time.Second,
		bufferSize:       1024 * 1024,
		svc:              svc,
		tid:              id,
		ch:               make(chan constants.TaskSignal),
		logBatchSize:     20,
	}

	// task
	r.t, err = svc.GetTaskById(id)
	if err != nil {
		return nil, err
	}

	// spider
	r.s, err = svc.GetSpiderById(r.t.SpiderId)
	if err != nil {
		return nil, err
	}

	// task fs service
	r.fsSvc = fs.NewFsService(filepath.Join(utils.GetWorkspace(), r.s.Id.Hex()))

	// grpc client
	r.c = client2.GetGrpcClient()

	// initialize task runner
	if err := r.Init(); err != nil {
		return r, err
	}

	return r, nil
}
