package handler

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/crawlab-team/crawlab/core/dependency"
	"github.com/crawlab-team/crawlab/core/fs"
	"github.com/hashicorp/go-multierror"
	"github.com/shirou/gopsutil/process"

	"github.com/crawlab-team/crawlab/core/models/models"

	"github.com/crawlab-team/crawlab/core/constants"
	"github.com/crawlab-team/crawlab/core/entity"
	client2 "github.com/crawlab-team/crawlab/core/grpc/client"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/models/client"
	"github.com/crawlab-team/crawlab/core/models/service"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/crawlab-team/crawlab/grpc"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// newTaskRunner creates a new task runner instance with the specified task ID
// It initializes all necessary components and establishes required connections
func newTaskRunner(id primitive.ObjectID, svc *Service) (r *Runner, err error) {
	// validate options
	if id.IsZero() {
		err = fmt.Errorf("invalid task id: %s", id.Hex())
		return nil, err
	}

	// runner
	r = &Runner{
		subscribeTimeout: 30 * time.Second,
		bufferSize:       1024 * 1024,
		svc:              svc,
		tid:              id,
		ch:               make(chan constants.TaskSignal),
		logBatchSize:     20,
		Logger:           utils.NewLogger("TaskRunner"),
		// treat all tasks as potentially long-running
		maxConnRetries:      10,
		connRetryDelay:      10 * time.Second,
		ipcTimeout:          60 * time.Second, // generous timeout for all tasks
		healthCheckInterval: 5 * time.Second,  // check process every 5 seconds
		connHealthInterval:  60 * time.Second, // check connection health every minute
	}

	// multi error
	var errs multierror.Error

	// task
	r.t, err = svc.GetTaskById(id)
	if err != nil {
		errs.Errors = append(errs.Errors, err)
	} else {
		// spider
		r.s, err = svc.GetSpiderById(r.t.SpiderId)
		if err != nil {
			errs.Errors = append(errs.Errors, err)
		} else {
			// task fs service
			r.fsSvc = fs.NewFsService(filepath.Join(utils.GetWorkspace(), r.s.Id.Hex()))
		}
	}

	// Initialize context and done channel
	r.ctx, r.cancel = context.WithCancel(context.Background())
	r.done = make(chan struct{})

	// initialize task runner
	if err := r.Init(); err != nil {
		r.Errorf("error initializing task runner: %v", err)
		errs.Errors = append(errs.Errors, err)
	}

	return r, errs.ErrorOrNil()
}

// Runner represents a task execution handler that manages the lifecycle of a running task
type Runner struct {
	// dependencies
	svc   *Service    // task handler service
	fsSvc *fs.Service // task fs service

	// settings
	subscribeTimeout time.Duration // maximum time to wait for task subscription
	bufferSize       int           // buffer size for reading process output

	// internals
	cmd  *exec.Cmd                      // process command instance
	pid  int                            // process id
	tid  primitive.ObjectID             // task id
	t    *models.Task                   // task model instance
	s    *models.Spider                 // spider model instance
	ch   chan constants.TaskSignal      // channel for task status communication
	err  error                          // captures any process execution errors
	cwd  string                         // current working directory for task
	conn grpc.TaskService_ConnectClient // gRPC stream connection for task service
	interfaces.Logger

	// log handling
	readerStdout *bufio.Reader // reader for process stdout
	readerStderr *bufio.Reader // reader for process stderr
	logBatchSize int           // number of log lines to batch before sending

	// IPC (Inter-Process Communication)
	stdinPipe  io.WriteCloser          // pipe for writing to child process
	stdoutPipe io.ReadCloser           // pipe for reading from child process
	ipcChan    chan entity.IPCMessage  // channel for sending IPC messages
	ipcHandler func(entity.IPCMessage) // callback for handling received IPC messages

	// goroutine management
	ctx    context.Context    // context for controlling goroutine lifecycle
	cancel context.CancelFunc // function to cancel the context
	done   chan struct{}      // channel to signal completion
	wg     sync.WaitGroup     // wait group for goroutine synchronization
	// connection management for robust task execution
	connMutex         sync.RWMutex  // mutex for connection access
	connHealthTicker  *time.Ticker  // ticker for connection health checks
	lastConnCheck     time.Time     // last successful connection check
	connRetryAttempts int           // current retry attempts
	maxConnRetries    int           // maximum connection retry attempts
	connRetryDelay    time.Duration // delay between connection retries
	resourceCleanup   *time.Ticker  // periodic resource cleanup

	// configurable timeouts for robust task execution
	ipcTimeout          time.Duration // timeout for IPC operations
	healthCheckInterval time.Duration // interval for health checks
	connHealthInterval  time.Duration // interval for connection health checks
}

// Init initializes the task runner by updating the task status and establishing gRPC connections
func (r *Runner) Init() (err error) {
	// wait for grpc client ready
	client2.GetGrpcClient().WaitForReady()

	// update task
	if err := r.updateTask("", nil); err != nil {
		return err
	}

	// grpc task service stream client
	if err := r.initConnection(); err != nil {
		return err
	}

	return nil
}

// Run executes the task and manages its lifecycle, including file synchronization, process execution,
// and status monitoring. Returns an error if the task execution fails.
func (r *Runner) Run() (err error) {
	// log task started
	r.Infof("task[%s] started", r.tid.Hex())

	// update task status (processing)
	if err := r.updateTask(constants.TaskStatusRunning, nil); err != nil {
		return err
	}

	// configure working directory
	r.configureCwd()

	// sync files worker nodes
	if !utils.IsMaster() {
		if err := r.syncFiles(); err != nil {
			return r.updateTask(constants.TaskStatusError, err)
		}
	}

	// install dependencies
	if err := r.installDependenciesIfAvailable(); err != nil {
		r.Warnf("error installing dependencies: %v", err)
	}

	// configure cmd
	err = r.configureCmd()
	if err != nil {
		return r.updateTask(constants.TaskStatusError, err)
	}

	// configure environment variables
	r.configureEnv()

	// start process
	if err := r.cmd.Start(); err != nil {
		return r.updateTask(constants.TaskStatusError, err)
	}

	// process id
	if r.cmd.Process == nil {
		return r.updateTask(constants.TaskStatusError, constants.ErrNotExists)
	}
	r.pid = r.cmd.Process.Pid
	r.t.Pid = r.pid

	// start health check
	go r.startHealthCheck()

	// Start IPC reader
	go r.startIPCReader()

	// Start IPC handler
	go r.handleIPC()

	// ZOMBIE PREVENTION: Start zombie process monitor
	go r.startZombieMonitor()

	// Ensure cleanup when Run() exits
	defer func() {
		// 1. Signal all goroutines to stop
		r.cancel()

		// 2. Stop tickers to prevent resource leaks
		if r.connHealthTicker != nil {
			r.connHealthTicker.Stop()
		}
		if r.resourceCleanup != nil {
			r.resourceCleanup.Stop()
		}

		// 3. Wait for all goroutines to finish with timeout
		done := make(chan struct{})
		go func() {
			r.wg.Wait()
			close(done)
		}()

		select {
		case <-done:
			// All goroutines finished normally
		case <-time.After(10 * time.Second): // Increased timeout for long-running tasks
			// Timeout waiting for goroutines, proceed with cleanup
			r.Warnf("timeout waiting for goroutines to finish, proceeding with cleanup")
		}

		// 4. Close gRPC connection after all goroutines have stopped
		r.connMutex.Lock()
		if r.conn != nil {
			_ = r.conn.CloseSend()
			r.conn = nil
		}
		r.connMutex.Unlock()

		// 5. Close channels after everything has stopped
		close(r.done)
		if r.ipcChan != nil {
			close(r.ipcChan)
		}
	}()

	// wait for process to finish
	return r.wait()
}

// Cancel terminates the running task. If force is true, the process will be killed immediately
// without waiting for graceful shutdown.
func (r *Runner) Cancel(force bool) (err error) {
	// Signal goroutines to stop
	r.cancel()

	// Kill process
	r.Debugf("attempt to kill process[%d]", r.pid)
	err = utils.KillProcess(r.cmd, force)
	if err != nil {
		r.Warnf("kill process error: %v", err)
	}

	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), r.svc.GetCancelTimeout())
	defer cancel()

	// Wait for process to be killed with context
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("timeout waiting for task to stop")
		case <-ticker.C:
			if !utils.ProcessIdExists(r.pid) {
				return nil
			}
		}
	}
}

func (r *Runner) SetSubscribeTimeout(timeout time.Duration) {
	r.subscribeTimeout = timeout
}

func (r *Runner) GetTaskId() (id primitive.ObjectID) {
	return r.tid
}

// configureCmd builds and configures the command to be executed, including setting up IPC pipes
// and processing command parameters
func (r *Runner) configureCmd() (err error) {
	var cmdStr string

	// command
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
	r.cmd, err = utils.BuildCmd(cmdStr)
	if err != nil {
		r.Errorf("error building command: %v", err)
		return err
	}

	// set working directory
	r.cmd.Dir = r.cwd

	// ZOMBIE PREVENTION: Set process group to enable proper cleanup of child processes
	if runtime.GOOS != "windows" {
		// Create new process group on Unix systems to ensure child processes can be killed together
		r.cmd.SysProcAttr = &syscall.SysProcAttr{
			Setpgid: true, // Create new process group
			Pgid:    0,    // Use process ID as process group ID
		}
	}

	// Configure pipes for IPC and logs
	r.stdinPipe, err = r.cmd.StdinPipe()
	if err != nil {
		r.Errorf("error creating stdin pipe: %v", err)
		return err
	}

	// Add stdout pipe for IPC and logs
	r.stdoutPipe, err = r.cmd.StdoutPipe()
	if err != nil {
		r.Errorf("error creating stdout pipe: %v", err)
		return err
	}

	// Add stderr pipe for error logs
	stderrPipe, err := r.cmd.StderrPipe()
	if err != nil {
		r.Errorf("error creating stderr pipe: %v", err)
		return err
	}

	// Create buffered readers
	r.readerStdout = bufio.NewReader(r.stdoutPipe)
	r.readerStderr = bufio.NewReader(stderrPipe)

	// Initialize IPC channel
	r.ipcChan = make(chan entity.IPCMessage)

	return nil
}

// startHealthCheck periodically verifies that the process is still running
// If the process disappears unexpectedly, it signals a task lost condition
func (r *Runner) startHealthCheck() {
	r.wg.Add(1)
	defer r.wg.Done()

	if r.cmd.ProcessState == nil || r.cmd.ProcessState.Exited() {
		return
	}

	ticker := time.NewTicker(r.healthCheckInterval)
	defer ticker.Stop()

	for {
		select {
		case <-r.ctx.Done():
			return
		case <-ticker.C:
			if !utils.ProcessIdExists(r.pid) {
				// process lost
				r.ch <- constants.TaskSignalLost
				return
			}
		}
	}
}

// configurePythonPath sets up the Python environment paths, handling both pyenv and default installations
func (r *Runner) configurePythonPath() {
	// Configure global node_modules path
	pyenvRoot := utils.GetPyenvPath()
	pyenvShimsPath := pyenvRoot + "/shims"
	pyenvBinPath := pyenvRoot + "/bin"

	// Configure global pyenv path
	_ = os.Setenv("PYENV_ROOT", pyenvRoot)
	_ = os.Setenv("PATH", pyenvShimsPath+":"+os.Getenv("PATH"))
	_ = os.Setenv("PATH", pyenvBinPath+":"+os.Getenv("PATH"))
}

// configureNodePath sets up the Node.js environment paths, handling both nvm and default installations
func (r *Runner) configureNodePath() {
	// Configure nvm-based Node.js paths
	envPath := os.Getenv("PATH")

	// Configure global node_modules path
	nodePath := utils.GetNodeModulesPath()
	if !strings.Contains(envPath, nodePath) {
		_ = os.Setenv("PATH", nodePath+":"+envPath)
	}
	_ = os.Setenv("NODE_PATH", nodePath)

	// Configure global node_bin path
	nodeBinPath := utils.GetNodeBinPath()
	if !strings.Contains(envPath, nodeBinPath) {
		_ = os.Setenv("PATH", nodeBinPath+":"+envPath)
	}
}

func (r *Runner) configureGoPath() {
	// Configure global go path
	goPath := utils.GetGoPath()
	if goPath != "" {
		_ = os.Setenv("GOPATH", goPath)
	}
}

// configureEnv sets up the environment variables for the task process, including:
// - Node.js paths
// - Crawlab-specific variables
// - Global environment variables from the system
func (r *Runner) configureEnv() {
	// Configure Python path
	r.configurePythonPath()

	// Configure Node.js path
	r.configureNodePath()

	// Configure Go path
	r.configureGoPath()

	// Default envs
	r.cmd.Env = os.Environ()

	// Remove CRAWLAB_ prefixed environment variables
	for i := 0; i < len(r.cmd.Env); i++ {
		if strings.HasPrefix(r.cmd.Env[i], "CRAWLAB_") {
			r.cmd.Env = append(r.cmd.Env[:i], r.cmd.Env[i+1:]...)
			i--
		}
	}

	// Task-specific environment variables
	r.cmd.Env = append(r.cmd.Env, "CRAWLAB_TASK_ID="+r.tid.Hex())

	// Global environment variables
	envs, err := client.NewModelService[models.Environment]().GetMany(nil, nil)
	if err != nil {
		r.Errorf("error getting environment variables: %v", err)
		return
	}
	for _, env := range envs {
		r.cmd.Env = append(r.cmd.Env, env.Key+"="+env.Value)
	}

	// Add environment variable for child processes to identify they're running under Crawlab
	r.cmd.Env = append(r.cmd.Env, "CRAWLAB_PARENT_PID="+fmt.Sprint(os.Getpid()))
}

func (r *Runner) performHttpRequest(method, path string, params url.Values) (*http.Response, error) {
	// Normalize path
	path = strings.TrimPrefix(path, "/")

	// Construct master URL
	var id string
	if r.s.GitId.IsZero() {
		id = r.s.Id.Hex()
	} else {
		id = r.s.GitId.Hex()
	}
	requestUrl := fmt.Sprintf("%s/sync/%s/%s?%s", utils.GetApiEndpoint(), id, path, params.Encode())

	// Create and execute request
	req, err := http.NewRequest(method, requestUrl, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	for k, v := range r.getHttpRequestHeaders() {
		req.Header.Set(k, v)
	}

	return http.DefaultClient.Do(req)
}

// syncFiles synchronizes files between master and worker nodes:
// 1. Gets file list from master
// 2. Compares with local files
// 3. Downloads new/modified files
// 4. Deletes files that no longer exist on master
func (r *Runner) syncFiles() (err error) {
	r.Infof("starting file synchronization for spider: %s", r.s.Id.Hex())

	workingDir := ""
	if !r.s.GitId.IsZero() {
		workingDir = r.s.GitRootPath
		r.Debugf("using git root path: %s", workingDir)
	}

	// get file list from master
	r.Infof("fetching file list from master node")
	params := url.Values{
		"path": []string{workingDir},
	}
	resp, err := r.performHttpRequest("GET", "/scan", params)
	if err != nil {
		r.Errorf("error getting file list from master: %v", err)
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		r.Errorf("error reading response body: %v", err)
		return err
	}
	var response struct {
		Data entity.FsFileInfoMap `json:"data"`
	}
	err = json.Unmarshal(body, &response)
	if err != nil {
		r.Errorf("error unmarshaling JSON for URL: %s", resp.Request.URL.String())
		r.Errorf("error details: %v", err)
		return err
	}

	// create a map for master files
	masterFilesMap := make(entity.FsFileInfoMap)
	for _, file := range response.Data {
		masterFilesMap[file.Path] = file
	}

	// create working directory if not exists
	if _, err := os.Stat(r.cwd); os.IsNotExist(err) {
		if err := os.MkdirAll(r.cwd, os.ModePerm); err != nil {
			r.Errorf("error creating worker directory: %v", err)
			return err
		}
	}

	// get file list from worker
	workerFiles, err := utils.ScanDirectory(r.cwd)
	if err != nil {
		r.Errorf("error scanning worker directory: %v", err)
		return err
	}

	// delete files that are deleted on master node
	for path, workerFile := range workerFiles {
		if _, exists := masterFilesMap[path]; !exists {
			r.Infof("deleting file: %s", path)
			err := os.Remove(workerFile.FullPath)
			if err != nil {
				r.Errorf("error deleting file: %v", err)
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
					r.Infof("directory needs to be synchronized: %s", path)
					_err := os.MkdirAll(filepath.Join(r.cwd, path), masterFile.Mode)
					if _err != nil {
						r.Errorf("error creating directory: %v", _err)
						err = errors.Join(err, _err)
					}
				} else {
					r.Infof("file needs to be synchronized: %s", path)
					_err := r.downloadFile(path, filepath.Join(r.cwd, path), masterFile)
					if _err != nil {
						r.Errorf("error downloading file: %v", _err)
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

	r.Infof("file synchronization completed successfully")
	return err
}

// downloadFile downloads a file from the master node and saves it to the local file system
func (r *Runner) downloadFile(path string, filePath string, fileInfo *entity.FsFileInfo) error {
	r.Debugf("downloading file: %s -> %s", path, filePath)
	params := url.Values{
		"path": []string{path},
	}
	resp, err := r.performHttpRequest("GET", "/download", params)
	if err != nil {
		r.Errorf("error getting file response: %v", err)
		return err
	}
	if resp.StatusCode != http.StatusOK {
		r.Errorf("error downloading file: %s", resp.Status)
		return errors.New(resp.Status)
	}
	defer resp.Body.Close()

	// create directory if not exists
	dirPath := filepath.Dir(filePath)
	utils.Exists(dirPath)
	err = os.MkdirAll(dirPath, os.ModePerm)
	if err != nil {
		r.Errorf("error creating directory: %v", err)
		return err
	}

	// create local file
	out, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, fileInfo.Mode)
	if err != nil {
		r.Errorf("error creating file: %v", err)
		return err
	}
	defer out.Close()

	// copy file content to local file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		r.Errorf("error copying file: %v", err)
		return err
	}

	r.Debugf("successfully downloaded file: %s (size: %d bytes)", path, fileInfo.FileSize)
	return nil
}

// getHttpRequestHeaders returns the headers for HTTP requests to the master node
func (r *Runner) getHttpRequestHeaders() (headers map[string]string) {
	headers = make(map[string]string)
	headers["Authorization"] = utils.GetAuthKey()
	return headers
}

// wait monitors the process execution and sends appropriate signals based on the exit status:
// - TaskSignalFinish for successful completion
// - TaskSignalCancel for cancellation
// - TaskSignalError for execution errors
func (r *Runner) wait() (err error) {
	// start a goroutine to wait for process to finish
	go func() {
		r.Debugf("waiting for process[%d] to finish", r.pid)
		err = r.cmd.Wait()
		if err != nil {
			var exitError *exec.ExitError
			if !errors.As(err, &exitError) {
				r.ch <- constants.TaskSignalError
				r.Debugf("process[%d] exited with error: %v", r.pid, err)
				return
			}
			exitCode := exitError.ExitCode()
			if exitCode == -1 {
				// cancel error
				r.ch <- constants.TaskSignalCancel
				r.Debugf("process[%d] cancelled", r.pid)
				return
			}

			// standard error
			r.err = err
			r.ch <- constants.TaskSignalError
			r.Debugf("process[%d] exited with error: %v", r.pid, err)
			return
		}

		// success
		r.ch <- constants.TaskSignalFinish
		r.Debugf("process[%d] exited successfully", r.pid)
	}()

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
		// ZOMBIE PREVENTION: Clean up any remaining processes when task is lost
		go r.cleanupOrphanedProcesses()
	default:
		err = constants.ErrInvalidSignal
		status = constants.TaskStatusError
	}

	// update task status
	if err := r.updateTask(status, err); err != nil {
		r.Errorf("error updating task status: %v", err)
		return err
	}

	// log according to status
	switch status {
	case constants.TaskStatusFinished:
		r.Infof("task[%s] finished", r.tid.Hex())
	case constants.TaskStatusCancelled:
		r.Infof("task[%s] cancelled", r.tid.Hex())
	case constants.TaskStatusError:
		r.Errorf("task[%s] error: %v", r.tid.Hex(), err)
	default:
		r.Errorf("invalid task status: %s", status)
	}

	return nil
}

// updateTask updates the task status and related statistics in the database
// If running on a worker node, updates are sent to the master
func (r *Runner) updateTask(status string, e error) (err error) {
	if status != "" {
		r.Debugf("updating task status to: %s", status)
	}

	if r.t != nil && status != "" {
		// update task status
		r.t.Status = status
		if e != nil {
			r.t.Error = e.Error()
		}
		if utils.IsMaster() {
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
	r.Debugf("fetching updated task from database")
	r.t, err = r.svc.GetTaskById(r.tid)
	if err != nil {
		r.Errorf("failed to get updated task: %v", err)
		return err
	}

	return nil
}

// initConnection establishes a gRPC connection to the task service with retry logic
func (r *Runner) initConnection() (err error) {
	r.connMutex.Lock()
	defer r.connMutex.Unlock()

	r.conn, err = client2.GetGrpcClient().TaskClient.Connect(context.Background())
	if err != nil {
		r.Errorf("error connecting to task service: %v", err)
		return err
	}

	r.lastConnCheck = time.Now()
	r.connRetryAttempts = 0
	// Start connection health monitoring for all tasks (potentially long-running)
	go r.monitorConnectionHealth()

	// Start periodic resource cleanup for all tasks
	go r.performPeriodicCleanup()

	return nil
}

// monitorConnectionHealth periodically checks gRPC connection health and reconnects if needed
func (r *Runner) monitorConnectionHealth() {
	r.wg.Add(1)
	defer r.wg.Done()

	r.connHealthTicker = time.NewTicker(r.connHealthInterval)
	defer r.connHealthTicker.Stop()

	for {
		select {
		case <-r.ctx.Done():
			return
		case <-r.connHealthTicker.C:
			if r.isConnectionHealthy() {
				r.lastConnCheck = time.Now()
				r.connRetryAttempts = 0
			} else {
				r.Warnf("gRPC connection unhealthy, attempting reconnection (attempt %d/%d)",
					r.connRetryAttempts+1, r.maxConnRetries)
				if err := r.reconnectWithRetry(); err != nil {
					r.Errorf("failed to reconnect after %d attempts: %v", r.maxConnRetries, err)
				}
			}
		}
	}
}

// isConnectionHealthy checks if the gRPC connection is still healthy
func (r *Runner) isConnectionHealthy() bool {
	r.connMutex.RLock()
	defer r.connMutex.RUnlock()

	if r.conn == nil {
		return false
	}
	// Try to send a ping-like message to test connection
	// Use a simple log message as ping since PING code doesn't exist
	testMsg := &grpc.TaskServiceConnectRequest{
		Code:   grpc.TaskServiceConnectCode_INSERT_LOGS,
		TaskId: r.tid.Hex(),
		Data:   []byte(`["[HEALTH CHECK] connection test"]`),
	}

	if err := r.conn.Send(testMsg); err != nil {
		r.Debugf("connection health check failed: %v", err)
		return false
	}

	return true
}

// reconnectWithRetry attempts to reconnect to the gRPC service with exponential backoff
func (r *Runner) reconnectWithRetry() error {
	r.connMutex.Lock()
	defer r.connMutex.Unlock()

	for attempt := 0; attempt < r.maxConnRetries; attempt++ {
		r.connRetryAttempts = attempt + 1

		// Close existing connection
		if r.conn != nil {
			_ = r.conn.CloseSend()
			r.conn = nil
		}

		// Wait before retry (exponential backoff)
		if attempt > 0 {
			backoffDelay := time.Duration(attempt) * r.connRetryDelay
			r.Debugf("waiting %v before retry attempt %d", backoffDelay, attempt+1)

			select {
			case <-r.ctx.Done():
				return fmt.Errorf("context cancelled during reconnection")
			case <-time.After(backoffDelay):
			}
		}

		// Attempt reconnection
		conn, err := client2.GetGrpcClient().TaskClient.Connect(context.Background())
		if err != nil {
			r.Warnf("reconnection attempt %d failed: %v", attempt+1, err)
			continue
		}

		r.conn = conn
		r.lastConnCheck = time.Now()
		r.connRetryAttempts = 0
		r.Infof("successfully reconnected to task service after %d attempts", attempt+1)
		return nil
	}

	return fmt.Errorf("failed to reconnect after %d attempts", r.maxConnRetries)
}

// performPeriodicCleanup runs periodic cleanup for all tasks
func (r *Runner) performPeriodicCleanup() {
	r.wg.Add(1)
	defer r.wg.Done()

	// Cleanup every 10 minutes for all tasks
	r.resourceCleanup = time.NewTicker(10 * time.Minute)
	defer r.resourceCleanup.Stop()

	for {
		select {
		case <-r.ctx.Done():
			return
		case <-r.resourceCleanup.C:
			r.runPeriodicCleanup()
		}
	}
}

// runPeriodicCleanup performs memory and resource cleanup
func (r *Runner) runPeriodicCleanup() {
	r.Debugf("performing periodic cleanup for task")

	// Force garbage collection for memory management
	runtime.GC()

	// Log current resource usage
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	r.Debugf("memory usage - alloc: %d KB, sys: %d KB, num_gc: %d",
		m.Alloc/1024, m.Sys/1024, m.NumGC)

	// Check if IPC channel is getting full
	if r.ipcChan != nil {
		select {
		case <-r.ipcChan:
			r.Debugf("drained stale IPC message during cleanup")
		default:
			// Channel is not full, good
		}
	}
}

// writeLogLines marshals log lines to JSON and sends them to the task service
// Uses connection-safe approach for robust task execution
func (r *Runner) writeLogLines(lines []string) {
	// Check if context is cancelled or connection is closed
	select {
	case <-r.ctx.Done():
		return
	default:
	}

	// Use connection with mutex for thread safety
	r.connMutex.RLock()
	conn := r.conn
	r.connMutex.RUnlock()

	// Check if connection is available
	if conn == nil {
		r.Debugf("no connection available for sending log lines")
		return
	}

	linesBytes, err := json.Marshal(lines)
	if err != nil {
		r.Errorf("error marshaling log lines: %v", err)
		return
	}

	msg := &grpc.TaskServiceConnectRequest{
		Code:   grpc.TaskServiceConnectCode_INSERT_LOGS,
		TaskId: r.tid.Hex(),
		Data:   linesBytes,
	}

	if err := conn.Send(msg); err != nil {
		// Don't log errors if context is cancelled (expected during shutdown)
		select {
		case <-r.ctx.Done():
			return
		default:
			r.Errorf("error sending log lines: %v", err)
			// Mark connection as unhealthy for reconnection
			r.lastConnCheck = time.Time{}
		}
		return
	}
}

// _updateTaskStat updates task statistics based on the current status:
// - For running tasks: sets start time and wait duration
// - For completed tasks: sets end time and calculates durations
func (r *Runner) _updateTaskStat(status string) {
	if status != "" {
		r.Debugf("updating task statistics for status: %s", status)
	}

	ts, err := client.NewModelService[models.TaskStat]().GetById(r.tid)
	if err != nil {
		r.Errorf("error getting task stat: %v", err)
		return
	}

	r.Debugf("current task statistics - wait_duration: %dms, runtime_duration: %dms", ts.WaitDuration, ts.RuntimeDuration)

	switch status {
	case constants.TaskStatusPending:
		// do nothing
	case constants.TaskStatusRunning:
		ts.StartedAt = time.Now()
		ts.WaitDuration = ts.StartedAt.Sub(ts.CreatedAt).Milliseconds()
	case constants.TaskStatusFinished, constants.TaskStatusError, constants.TaskStatusCancelled:
		if ts.StartedAt.IsZero() {
			ts.StartedAt = time.Now()
			ts.WaitDuration = ts.StartedAt.Sub(ts.CreatedAt).Milliseconds()
		}
		ts.EndedAt = time.Now()
		ts.RuntimeDuration = ts.EndedAt.Sub(ts.StartedAt).Milliseconds()
		ts.TotalDuration = ts.EndedAt.Sub(ts.CreatedAt).Milliseconds()
	}
	if utils.IsMaster() {
		err = service.NewModelService[models.TaskStat]().ReplaceById(ts.Id, *ts)
		if err != nil {
			r.Errorf("error updating task stat: %v", err)
			return
		}
	} else {
		err = client.NewModelService[models.TaskStat]().ReplaceById(ts.Id, *ts)
		if err != nil {
			r.Errorf("error updating task stat: %v", err)
			return
		}
	}
}

// sendNotification sends a notification to the task service
func (r *Runner) sendNotification() {
	req := &grpc.TaskServiceSendNotificationRequest{
		NodeKey: r.svc.GetNodeConfigService().GetNodeKey(),
		TaskId:  r.tid.Hex(),
	}
	_, err := client2.GetGrpcClient().TaskClient.SendNotification(context.Background(), req)
	if err != nil {
		r.Errorf("error sending notification: %v", err)
		return
	}
}

// _updateSpiderStat updates spider statistics based on task completion:
// - Updates last task ID
// - Increments task counts
// - Updates duration metrics
func (r *Runner) _updateSpiderStat(status string) {
	// task stat
	ts, err := client.NewModelService[models.TaskStat]().GetById(r.tid)
	if err != nil {
		r.Errorf("error getting task stat: %v", err)
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
		r.Errorf("Invalid task status: %s", status)
		return
	}

	// perform update
	if utils.IsMaster() {
		err = service.NewModelService[models.SpiderStat]().UpdateById(r.s.Id, update)
		if err != nil {
			r.Errorf("error updating spider stat: %v", err)
			return
		}
	} else {
		err = client.NewModelService[models.SpiderStat]().UpdateById(r.s.Id, update)
		if err != nil {
			r.Errorf("error updating spider stat: %v", err)
			return
		}
	}
}

// configureCwd sets the working directory for the task based on the spider's configuration
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

// handleIPC processes incoming IPC messages from the child process
// Messages are converted to JSON and written to the child process's stdin
func (r *Runner) handleIPC() {
	r.wg.Add(1)
	defer r.wg.Done()

	for msg := range r.ipcChan {
		// Convert message to JSON
		jsonData, err := json.Marshal(msg)
		if err != nil {
			r.Errorf("error marshaling IPC message: %v", err)
			continue
		}

		// Write to child process's stdin
		_, err = fmt.Fprintln(r.stdinPipe, string(jsonData))
		if err != nil {
			r.Errorf("error writing to child process: %v", err)
		}
	}
}

// SetIPCHandler sets the handler for incoming IPC messages
func (r *Runner) SetIPCHandler(handler func(entity.IPCMessage)) {
	r.ipcHandler = handler
}

// startIPCReader continuously reads IPC messages from the child process's stdout
// Messages are parsed and either handled by the IPC handler or written to logs
func (r *Runner) startIPCReader() {
	r.wg.Add(2) // Add 2 to wait group for both stdout and stderr readers

	// Start stdout reader
	go func() {
		defer r.wg.Done()
		r.readOutput(r.readerStdout, true) // true for stdout
	}()

	// Start stderr reader
	go func() {
		defer r.wg.Done()
		r.readOutput(r.readerStderr, false) // false for stderr
	}()
}

func (r *Runner) readOutput(reader *bufio.Reader, isStdout bool) {
	scanner := bufio.NewScanner(reader)
	for {
		select {
		case <-r.ctx.Done():
			// Context cancelled, stop reading
			return
		default:
			// Scan the next line
			if !scanner.Scan() {
				return
			}

			// Get the line
			line := scanner.Text()

			// Trim the line
			line = strings.TrimRight(line, "\n\r")

			// For stdout, try to parse as IPC message first
			if isStdout {
				var ipcMsg entity.IPCMessage
				if err := json.Unmarshal([]byte(line), &ipcMsg); err == nil && ipcMsg.IPC {
					if r.ipcHandler != nil {
						r.ipcHandler(ipcMsg)
					} else {
						// Default handler (insert data)
						if ipcMsg.Type == "" || ipcMsg.Type == constants.IPCMessageData {
							r.handleIPCInsertDataMessage(ipcMsg)
						} else {
							r.Warnf("no IPC handler set for message: %v", ipcMsg)
						}
					}
					continue
				}
			}

			// If not an IPC message or from stderr, treat as log
			r.writeLogLines([]string{line})
		}
	}
}

// handleIPCInsertDataMessage converts the IPC message payload to JSON and sends it to the master node
func (r *Runner) handleIPCInsertDataMessage(ipcMsg entity.IPCMessage) {
	if ipcMsg.Payload == nil {
		r.Errorf("empty payload in IPC message")
		return
	}

	// Convert payload to data to be inserted
	var records []map[string]interface{}

	switch payload := ipcMsg.Payload.(type) {
	case []interface{}: // Handle array of objects
		records = make([]map[string]interface{}, 0, len(payload))
		for i, item := range payload {
			if itemMap, ok := item.(map[string]interface{}); ok {
				records = append(records, itemMap)
			} else {
				r.Errorf("invalid record at index %d: %v", i, item)
				continue
			}
		}
	case []map[string]interface{}: // Handle direct array of maps
		records = payload
	case map[string]interface{}: // Handle single object
		records = []map[string]interface{}{payload}
	case interface{}: // Handle generic interface
		if itemMap, ok := payload.(map[string]interface{}); ok {
			records = []map[string]interface{}{itemMap}
		} else {
			r.Errorf("invalid payload type: %T", payload)
			return
		}
	default:
		r.Errorf("unsupported payload type: %T, value: %v", payload, ipcMsg.Payload)
		return
	}

	// Validate records
	if len(records) == 0 {
		r.Warnf("no valid records to insert")
		return
	}

	// Marshal data with error handling
	data, err := json.Marshal(records)
	if err != nil {
		r.Errorf("error marshaling records: %v", err)
		return
	}

	// Check if context is cancelled or connection is closed
	select {
	case <-r.ctx.Done():
		return
	default:
	}

	// Use connection with mutex for thread safety
	r.connMutex.RLock()
	conn := r.conn
	r.connMutex.RUnlock()

	// Validate connection
	if conn == nil {
		r.Errorf("gRPC connection not initialized")
		return
	}

	// Send IPC message to master with context and timeout
	ctx, cancel := context.WithTimeout(context.Background(), r.ipcTimeout)
	defer cancel()

	// Create gRPC message
	grpcMsg := &grpc.TaskServiceConnectRequest{
		Code:   grpc.TaskServiceConnectCode_INSERT_DATA,
		TaskId: r.tid.Hex(),
		Data:   data,
	}

	// Use context for sending
	select {
	case <-ctx.Done():
		r.Errorf("timeout sending IPC message")
		return
	case <-r.ctx.Done():
		return
	default:
		if err := conn.Send(grpcMsg); err != nil {
			// Don't log errors if context is cancelled (expected during shutdown)
			select {
			case <-r.ctx.Done():
				return
			default:
				r.Errorf("error sending IPC message: %v", err)
				// Mark connection as unhealthy for reconnection
				r.lastConnCheck = time.Time{}
			}
			return
		}
	}
}

func (r *Runner) installDependenciesIfAvailable() (err error) {
	if !utils.IsPro() {
		return nil
	}

	// Get dependency installer service
	depSvc := dependency.GetDependencyInstallerRegistryService()
	if depSvc == nil {
		r.Warnf("dependency installer service not available")
		return nil
	}

	// Check if auto install is enabled
	if !depSvc.IsAutoInstallEnabled() {
		r.Debug("auto dependency installation is disabled")
		return nil
	}

	// Get install command
	cmd, err := depSvc.GetInstallDependencyRequirementsCmdBySpiderId(r.s.Id)
	if err != nil {
		return err
	}
	if cmd == nil {
		return nil
	}

	// Set up pipes for stdout and stderr
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		r.Errorf("error creating stdout pipe for dependency installation: %v", err)
		return err
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		r.Errorf("error creating stderr pipe for dependency installation: %v", err)
		return err
	}

	// Start the command
	r.Infof("installing dependencies for spider: %s", r.s.Id.Hex())
	r.Infof("command for dependencies installation: %s", cmd.String())
	if err := cmd.Start(); err != nil {
		r.Errorf("error starting dependency installation command: %v", err)
		return err
	}

	// Create wait group for log readers
	var wg sync.WaitGroup
	wg.Add(2)

	// Read stdout
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			r.Info(line)
		}
	}()

	// Read stderr
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			line := scanner.Text()
			r.Error(line)
		}
	}()

	// Wait for command to complete
	if err := cmd.Wait(); err != nil {
		r.Errorf("dependency installation failed: %v", err)
		return err
	}

	// Wait for log readers to finish
	wg.Wait()

	return nil
}

// logInternally sends internal runner logs to the same logging system as the task
func (r *Runner) logInternally(level string, message string) {
	// Format the internal log with a prefix
	timestamp := time.Now().Local().Format("2006-01-02 15:04:05")

	// Pad level
	level = fmt.Sprintf("%-5s", level)

	// Format the log message
	internalLog := fmt.Sprintf("%s [%s] [%s] %s", level, timestamp, "Crawlab", message)

	// Send to the same log system as task logs
	// Only send if context is not cancelled and connection is available
	if r.conn != nil {
		select {
		case <-r.ctx.Done():
			// Context cancelled, don't send logs
		default:
			go r.writeLogLines([]string{internalLog})
		}
	}

	// Also log through the standard logger
	switch level {
	case "ERROR":
		r.Logger.Error(message)
	case "WARN":
		r.Logger.Warn(message)
	case "INFO":
		r.Logger.Info(message)
	case "DEBUG":
		r.Logger.Debug(message)
	}
}

func (r *Runner) Error(message string) {
	msg := fmt.Sprintf(message)
	r.logInternally("ERROR", msg)
}

func (r *Runner) Warn(message string) {
	msg := fmt.Sprintf(message)
	r.logInternally("WARN", msg)
}

func (r *Runner) Info(message string) {
	msg := fmt.Sprintf(message)
	r.logInternally("INFO", msg)
}

func (r *Runner) Debug(message string) {
	msg := fmt.Sprintf(message)
	r.logInternally("DEBUG", msg)
}

func (r *Runner) Errorf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	r.logInternally("ERROR", msg)
}

func (r *Runner) Warnf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	r.logInternally("WARN", msg)
}

func (r *Runner) Infof(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	r.logInternally("INFO", msg)
}

func (r *Runner) Debugf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	r.logInternally("DEBUG", msg)
}

// GetConnectionStats returns connection health statistics for monitoring
func (r *Runner) GetConnectionStats() map[string]interface{} {
	r.connMutex.RLock()
	defer r.connMutex.RUnlock()

	return map[string]interface{}{
		"last_connection_check": r.lastConnCheck,
		"retry_attempts":        r.connRetryAttempts,
		"max_retries":           r.maxConnRetries,
		"connection_healthy":    r.isConnectionHealthy(),
		"connection_exists":     r.conn != nil,
	}
}

// ZOMBIE PROCESS PREVENTION METHODS

// cleanupOrphanedProcesses attempts to clean up any orphaned processes related to this task
func (r *Runner) cleanupOrphanedProcesses() {
	r.Warnf("cleaning up orphaned processes for task %s (PID: %d)", r.tid.Hex(), r.pid)

	if r.pid <= 0 {
		r.Debugf("no PID to clean up")
		return
	}

	// Try to kill the process group if it exists
	if runtime.GOOS != "windows" {
		r.killProcessGroup()
	}

	// Force kill the main process if it still exists
	if utils.ProcessIdExists(r.pid) {
		r.Warnf("forcefully killing remaining process %d", r.pid)
		if r.cmd != nil && r.cmd.Process != nil {
			if err := utils.KillProcess(r.cmd, true); err != nil {
				r.Errorf("failed to force kill process: %v", err)
			}
		}
	}

	// Scan for any remaining child processes and kill them
	r.scanAndKillChildProcesses()
}

// killProcessGroup kills the entire process group on Unix systems
func (r *Runner) killProcessGroup() {
	if r.pid <= 0 {
		return
	}

	r.Debugf("attempting to kill process group for PID %d", r.pid)

	// Kill the process group (negative PID kills the group)
	err := syscall.Kill(-r.pid, syscall.SIGTERM)
	if err != nil {
		r.Debugf("failed to send SIGTERM to process group: %v", err)
		// Try SIGKILL as last resort
		err = syscall.Kill(-r.pid, syscall.SIGKILL)
		if err != nil {
			r.Debugf("failed to send SIGKILL to process group: %v", err)
		}
	} else {
		r.Debugf("successfully sent SIGTERM to process group %d", r.pid)
	}
}

// scanAndKillChildProcesses scans for and kills any remaining child processes
func (r *Runner) scanAndKillChildProcesses() {
	r.Debugf("scanning for orphaned child processes of task %s", r.tid.Hex())

	processes, err := utils.GetProcesses()
	if err != nil {
		r.Errorf("failed to get process list: %v", err)
		return
	}

	taskIdEnv := "CRAWLAB_TASK_ID=" + r.tid.Hex()
	killedCount := 0

	for _, proc := range processes {
		// Check if this process has our task ID in its environment
		if r.isTaskRelatedProcess(proc, taskIdEnv) {
			pid := int(proc.Pid)
			r.Warnf("found orphaned task process PID %d, killing it", pid)

			// Kill the orphaned process
			if err := proc.Kill(); err != nil {
				r.Errorf("failed to kill orphaned process %d: %v", pid, err)
			} else {
				killedCount++
				r.Infof("successfully killed orphaned process %d", pid)
			}
		}
	}

	if killedCount > 0 {
		r.Infof("cleaned up %d orphaned processes for task %s", killedCount, r.tid.Hex())
	} else {
		r.Debugf("no orphaned processes found for task %s", r.tid.Hex())
	}
}

// isTaskRelatedProcess checks if a process is related to this task
func (r *Runner) isTaskRelatedProcess(proc *process.Process, taskIdEnv string) bool {
	// Get process environment variables
	environ, err := proc.Environ()
	if err != nil {
		// If we can't read environment, skip this process
		return false
	}

	// Check if this process has our task ID
	for _, env := range environ {
		if env == taskIdEnv {
			return true
		}
	}

	return false
}

// startZombieMonitor starts a background goroutine to monitor for zombie processes
func (r *Runner) startZombieMonitor() {
	r.wg.Add(1)
	go func() {
		defer r.wg.Done()

		// Check for zombies every 5 minutes
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()

		for {
			select {
			case <-r.ctx.Done():
				return
			case <-ticker.C:
				r.checkForZombieProcesses()
			}
		}
	}()
}

// checkForZombieProcesses periodically checks for and cleans up zombie processes
func (r *Runner) checkForZombieProcesses() {
	r.Debugf("checking for zombie processes related to task %s", r.tid.Hex())

	// Check if our main process still exists and is in the expected state
	if r.pid > 0 && utils.ProcessIdExists(r.pid) {
		// Process exists, check if it's a zombie
		if proc, err := process.NewProcess(int32(r.pid)); err == nil {
			if status, err := proc.Status(); err == nil {
				// Status returns a string, check if it indicates zombie
				statusStr := string(status)
				if statusStr == "Z" || statusStr == "zombie" {
					r.Warnf("detected zombie process %d for task %s", r.pid, r.tid.Hex())
					go r.cleanupOrphanedProcesses()
				}
			}
		}
	}
}
