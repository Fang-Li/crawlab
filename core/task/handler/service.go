package handler

import (
	"context"
	"errors"
	"fmt"
	"io"
	"runtime"
	"sync"
	"time"

	"github.com/crawlab-team/crawlab/core/constants"
	grpcclient "github.com/crawlab-team/crawlab/core/grpc/client"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/models/client"
	"github.com/crawlab-team/crawlab/core/models/models"
	"github.com/crawlab-team/crawlab/core/models/service"
	nodeconfig "github.com/crawlab-team/crawlab/core/node/config"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/crawlab-team/crawlab/grpc"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service struct {
	// dependencies
	cfgSvc interfaces.NodeConfigService
	c      *grpcclient.GrpcClient // grpc client

	// settings
	reportInterval time.Duration
	fetchInterval  time.Duration
	fetchTimeout   time.Duration
	cancelTimeout  time.Duration

	// internals variables
	ctx     context.Context
	cancel  context.CancelFunc
	stopped bool
	mu      sync.RWMutex
	runners sync.Map       // pool of task runners started
	wg      sync.WaitGroup // track background goroutines

	// tickers for cleanup
	fetchTicker  *time.Ticker
	reportTicker *time.Ticker

	interfaces.Logger
}

func (svc *Service) Start() {
	// Initialize context for graceful shutdown
	svc.ctx, svc.cancel = context.WithCancel(context.Background())

	// wait for grpc client ready
	grpcclient.GetGrpcClient().WaitForReady()

	// Initialize tickers
	svc.fetchTicker = time.NewTicker(svc.fetchInterval)
	svc.reportTicker = time.NewTicker(svc.reportInterval)

	// Start goroutine monitoring
	svc.startGoroutineMonitoring()

	// Start background goroutines with WaitGroup tracking
	svc.wg.Add(2)
	go svc.reportStatus()
	go svc.fetchAndRunTasks()

	svc.Infof("Task handler service started")

	// Start the stuck task cleanup routine
	svc.startStuckTaskCleanup()
}

func (svc *Service) Stop() {
	svc.mu.Lock()
	if svc.stopped {
		svc.mu.Unlock()
		return
	}
	svc.stopped = true
	svc.mu.Unlock()

	svc.Infof("Stopping task handler service...")

	// Cancel context to signal all goroutines to stop
	if svc.cancel != nil {
		svc.cancel()
	}

	// Stop tickers to prevent new tasks
	if svc.fetchTicker != nil {
		svc.fetchTicker.Stop()
	}
	if svc.reportTicker != nil {
		svc.reportTicker.Stop()
	}

	// Cancel all running tasks gracefully
	svc.stopAllRunners()

	// Wait for all background goroutines to finish
	done := make(chan struct{})
	go func() {
		svc.wg.Wait()
		close(done)
	}()

	// Give goroutines time to finish gracefully, then force stop
	select {
	case <-done:
		svc.Infof("All goroutines stopped gracefully")
	case <-time.After(30 * time.Second):
		svc.Warnf("Some goroutines did not stop gracefully within timeout")
	}

	svc.Infof("Task handler service stopped")
}

func (svc *Service) startGoroutineMonitoring() {
	go func() {
		defer func() {
			if r := recover(); r != nil {
				svc.Errorf("[TaskHandler] goroutine monitoring panic: %v", r)
			}
		}()

		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()

		initialCount := runtime.NumGoroutine()
		svc.Infof("[TaskHandler] initial goroutine count: %d", initialCount)

		for {
			select {
			case <-svc.ctx.Done():
				svc.Infof("[TaskHandler] goroutine monitoring shutting down")
				return
			case <-ticker.C:
				currentCount := runtime.NumGoroutine()
				if currentCount > initialCount+50 { // Alert if 50+ more goroutines than initial
					svc.Warnf("[TaskHandler] potential goroutine leak detected - current: %d, initial: %d, diff: %d",
						currentCount, initialCount, currentCount-initialCount)
				} else {
					svc.Debugf("[TaskHandler] goroutine count: %d (initial: %d)", currentCount, initialCount)
				}
			}
		}
	}()
}

func (svc *Service) Run(taskId primitive.ObjectID) (err error) {
	return svc.runTask(taskId)
}

func (svc *Service) Cancel(taskId primitive.ObjectID, force bool) (err error) {
	return svc.cancelTask(taskId, force)
}

func (svc *Service) fetchAndRunTasks() {
	defer svc.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			svc.Errorf("fetchAndRunTasks panic recovered: %v", r)
		}
	}()

	for {
		select {
		case <-svc.ctx.Done():
			svc.Infof("fetchAndRunTasks stopped by context")
			return
		case <-svc.fetchTicker.C:
			// Use a separate context with timeout for each operation
			if err := svc.processFetchCycle(); err != nil {
				svc.Debugf("fetch cycle error: %v", err)
			}
		}
	}
}

func (svc *Service) processFetchCycle() error {
	// Check if stopped
	svc.mu.RLock()
	stopped := svc.stopped
	svc.mu.RUnlock()

	if stopped {
		return fmt.Errorf("service stopped")
	}

	// current node
	n, err := svc.GetCurrentNode()
	if err != nil {
		return fmt.Errorf("failed to get current node: %w", err)
	}

	// skip if node is not active or enabled
	if !n.Active || !n.Enabled {
		return fmt.Errorf("node not active or enabled")
	}

	// validate if max runners is reached (max runners = 0 means no limit)
	if n.MaxRunners > 0 && svc.getRunnerCount() >= n.MaxRunners {
		return fmt.Errorf("max runners reached")
	}

	// fetch task id
	tid, err := svc.fetchTask()
	if err != nil {
		return fmt.Errorf("failed to fetch task: %w", err)
	}

	// skip if no task id
	if tid.IsZero() {
		return fmt.Errorf("no task available")
	}

	// run task
	if err := svc.runTask(tid); err != nil {
		// Handle task error
		t, getErr := svc.GetTaskById(tid)
		if getErr == nil && t.Status != constants.TaskStatusCancelled {
			t.Error = err.Error()
			t.Status = constants.TaskStatusError
			t.SetUpdated(t.CreatedBy)
			_ = client.NewModelService[models.Task]().ReplaceById(t.Id, *t)
		}
		return fmt.Errorf("failed to run task: %w", err)
	}

	return nil
}

func (svc *Service) reportStatus() {
	defer svc.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			svc.Errorf("reportStatus panic recovered: %v", r)
		}
	}()

	for {
		select {
		case <-svc.ctx.Done():
			svc.Infof("reportStatus stopped by context")
			return
		case <-svc.reportTicker.C:
			// Update node status with error handling
			if err := svc.updateNodeStatus(); err != nil {
				svc.Errorf("failed to report status: %v", err)
			}
		}
	}
}

func (svc *Service) GetCancelTimeout() (timeout time.Duration) {
	return svc.cancelTimeout
}

func (svc *Service) GetNodeConfigService() (cfgSvc interfaces.NodeConfigService) {
	return svc.cfgSvc
}

func (svc *Service) GetCurrentNode() (n *models.Node, err error) {
	// node key
	nodeKey := svc.cfgSvc.GetNodeKey()

	// current node
	if svc.cfgSvc.IsMaster() {
		n, err = service.NewModelService[models.Node]().GetOne(bson.M{"key": nodeKey}, nil)
	} else {
		n, err = client.NewModelService[models.Node]().GetOne(bson.M{"key": nodeKey}, nil)
	}
	if err != nil {
		return nil, err
	}

	return n, nil
}

func (svc *Service) GetTaskById(id primitive.ObjectID) (t *models.Task, err error) {
	if svc.cfgSvc.IsMaster() {
		t, err = service.NewModelService[models.Task]().GetById(id)
	} else {
		t, err = client.NewModelService[models.Task]().GetById(id)
	}
	if err != nil {
		svc.Errorf("failed to get task by id: %v", err)
		return nil, err
	}

	return t, nil
}

func (svc *Service) UpdateTask(t *models.Task) (err error) {
	t.SetUpdated(t.CreatedBy)
	if svc.cfgSvc.IsMaster() {
		err = service.NewModelService[models.Task]().ReplaceById(t.Id, *t)
	} else {
		err = client.NewModelService[models.Task]().ReplaceById(t.Id, *t)
	}
	if err != nil {
		return err
	}
	return nil
}

func (svc *Service) GetSpiderById(id primitive.ObjectID) (s *models.Spider, err error) {
	if svc.cfgSvc.IsMaster() {
		s, err = service.NewModelService[models.Spider]().GetById(id)
	} else {
		s, err = client.NewModelService[models.Spider]().GetById(id)
	}
	if err != nil {
		svc.Errorf("failed to get spider by id: %v", err)
		return nil, err
	}

	return s, nil
}

func (svc *Service) getRunnerCount() (count int) {
	n, err := svc.GetCurrentNode()
	if err != nil {
		svc.Errorf("failed to get current node: %v", err)
		return
	}
	query := bson.M{
		"node_id": n.Id,
		"status": bson.M{
			"$in": []string{constants.TaskStatusAssigned, constants.TaskStatusRunning},
		},
	}
	if svc.cfgSvc.IsMaster() {
		count, err = service.NewModelService[models.Task]().Count(query)
		if err != nil {
			svc.Errorf("failed to count tasks: %v", err)
			return
		}
	} else {
		count, err = client.NewModelService[models.Task]().Count(query)
		if err != nil {
			svc.Errorf("failed to count tasks: %v", err)
			return
		}
	}
	return count
}

func (svc *Service) getRunner(taskId primitive.ObjectID) (r interfaces.TaskRunner, err error) {
	svc.Debugf("get runner: taskId[%v]", taskId)
	v, ok := svc.runners.Load(taskId)
	if !ok {
		err = fmt.Errorf("task[%s] not exists", taskId.Hex())
		svc.Errorf("get runner error: %v", err)
		return nil, err
	}
	switch v := v.(type) {
	case interfaces.TaskRunner:
		r = v
	default:
		err = fmt.Errorf("invalid type: %T", v)
		svc.Errorf("get runner error: %v", err)
		return nil, err
	}
	return r, nil
}

func (svc *Service) addRunner(taskId primitive.ObjectID, r interfaces.TaskRunner) {
	svc.Debugf("add runner: taskId[%s]", taskId.Hex())
	svc.runners.Store(taskId, r)
}

func (svc *Service) deleteRunner(taskId primitive.ObjectID) {
	svc.Debugf("delete runner: taskId[%v]", taskId)
	svc.runners.Delete(taskId)
}

func (svc *Service) updateNodeStatus() (err error) {
	// current node
	n, err := svc.GetCurrentNode()
	if err != nil {
		return err
	}

	// set available runners
	n.CurrentRunners = svc.getRunnerCount()

	// save node
	n.SetUpdated(n.CreatedBy)
	if svc.cfgSvc.IsMaster() {
		err = service.NewModelService[models.Node]().ReplaceById(n.Id, *n)
	} else {
		err = client.NewModelService[models.Node]().ReplaceById(n.Id, *n)
	}
	if err != nil {
		return err
	}

	return nil
}

func (svc *Service) fetchTask() (tid primitive.ObjectID, err error) {
	ctx, cancel := context.WithTimeout(context.Background(), svc.fetchTimeout)
	defer cancel()
	taskClient, err := svc.c.GetTaskClient()
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("failed to get task client: %v", err)
	}
	res, err := taskClient.FetchTask(ctx, &grpc.TaskServiceFetchTaskRequest{
		NodeKey: svc.cfgSvc.GetNodeKey(),
	})
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("fetchTask task error: %v", err)
	}
	// validate task id
	tid, err = primitive.ObjectIDFromHex(res.GetTaskId())
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("invalid task id: %s", res.GetTaskId())
	}
	return tid, nil
}

func (svc *Service) runTask(taskId primitive.ObjectID) (err error) {
	// attempt to get runner from pool
	_, ok := svc.runners.Load(taskId)
	if ok {
		err = fmt.Errorf("task[%s] already exists", taskId.Hex())
		svc.Errorf("run task error: %v", err)
		return err
	}

	// create a new task runner
	r, err := newTaskRunner(taskId, svc)
	if err != nil {
		err = fmt.Errorf("failed to create task runner: %v", err)
		svc.Errorf("run task error: %v", err)
		return err
	}

	// add runner to pool
	svc.addRunner(taskId, r)

	// create a goroutine to run task with proper cleanup
	go func() {
		defer func() {
			if rec := recover(); rec != nil {
				svc.Errorf("task[%s] panic recovered: %v", taskId.Hex(), rec)
			}
			// Always cleanup runner from pool
			svc.deleteRunner(taskId)
		}()

		// Create task-specific context for better cancellation control
		taskCtx, taskCancel := context.WithCancel(svc.ctx)
		defer taskCancel()

		// get subscription stream with retry logic
		stopCh := make(chan struct{}, 1)
		stream, err := svc.subscribeTaskWithRetry(taskCtx, r.GetTaskId(), 3)
		if err == nil {
			// create a goroutine to handle stream messages
			go svc.handleStreamMessages(r.GetTaskId(), stream, stopCh)
		} else {
			svc.Errorf("failed to subscribe task[%s] after retries: %v", r.GetTaskId().Hex(), err)
			svc.Warnf("task[%s] will not be able to receive stream messages", r.GetTaskId().Hex())
		}

		// run task process (blocking) error or finish after task runner ends
		if err := r.Run(); err != nil {
			switch {
			case errors.Is(err, constants.ErrTaskError):
				svc.Errorf("task[%s] finished with error: %v", r.GetTaskId().Hex(), err)
			case errors.Is(err, constants.ErrTaskCancelled):
				svc.Infof("task[%s] cancelled", r.GetTaskId().Hex())
			default:
				svc.Errorf("task[%s] finished with unknown error: %v", r.GetTaskId().Hex(), err)
			}
		} else {
			svc.Infof("task[%s] finished successfully", r.GetTaskId().Hex())
		}

		// send stopCh signal to stream message handler
		select {
		case stopCh <- struct{}{}:
		default:
			// Channel already closed or full
		}
	}()

	return nil
}

// subscribeTask attempts to subscribe to task stream
func (svc *Service) subscribeTask(taskId primitive.ObjectID) (stream grpc.TaskService_SubscribeClient, err error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	req := &grpc.TaskServiceSubscribeRequest{
		TaskId: taskId.Hex(),
	}
	taskClient, err := svc.c.GetTaskClient()
	if err != nil {
		return nil, fmt.Errorf("failed to get task client: %v", err)
	}
	stream, err = taskClient.Subscribe(ctx, req)
	if err != nil {
		svc.Errorf("failed to subscribe task[%s]: %v", taskId.Hex(), err)
		return nil, err
	}
	return stream, nil
}

// subscribeTaskWithRetry attempts to subscribe to task stream with retry logic
func (svc *Service) subscribeTaskWithRetry(ctx context.Context, taskId primitive.ObjectID, maxRetries int) (stream grpc.TaskService_SubscribeClient, err error) {
	for i := 0; i < maxRetries; i++ {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		stream, err = svc.subscribeTask(taskId)
		if err == nil {
			return stream, nil
		}

		svc.Warnf("failed to subscribe task[%s] (attempt %d/%d): %v", taskId.Hex(), i+1, maxRetries, err)

		if i < maxRetries-1 {
			// Wait before retry with exponential backoff
			backoff := time.Duration(i+1) * time.Second
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(backoff):
			}
		}
	}

	return nil, fmt.Errorf("failed to subscribe after %d retries: %w", maxRetries, err)
}

func (svc *Service) handleStreamMessages(taskId primitive.ObjectID, stream grpc.TaskService_SubscribeClient, stopCh chan struct{}) {
	defer func() {
		if r := recover(); r != nil {
			svc.Errorf("handleStreamMessages[%s] panic recovered: %v", taskId.Hex(), r)
		}
		// Ensure stream is properly closed
		if stream != nil {
			if err := stream.CloseSend(); err != nil {
				svc.Debugf("task[%s] failed to close stream: %v", taskId.Hex(), err)
			}
		}
	}()

	// Create timeout for stream operations
	streamTimeout := 30 * time.Second

	for {
		select {
		case <-stopCh:
			svc.Debugf("task[%s] stream handler received stop signal", taskId.Hex())
			return
		case <-svc.ctx.Done():
			svc.Debugf("task[%s] stream handler stopped by service context", taskId.Hex())
			return
		default:
			// Set deadline for receive operation
			ctx, cancel := context.WithTimeout(context.Background(), streamTimeout)

			// Create a buffered channel to receive the result
			result := make(chan struct {
				msg *grpc.TaskServiceSubscribeResponse
				err error
			}, 1)

			// Use a single goroutine to handle the blocking Recv call
			go func() {
				defer func() {
					if r := recover(); r != nil {
						svc.Errorf("task[%s] stream recv goroutine panic: %v", taskId.Hex(), r)
					}
				}()

				msg, err := stream.Recv()
				select {
				case result <- struct {
					msg *grpc.TaskServiceSubscribeResponse
					err error
				}{msg, err}:
				case <-ctx.Done():
					// Context cancelled, don't send result
				}
			}()

			select {
			case res := <-result:
				cancel()
				if res.err != nil {
					if errors.Is(res.err, io.EOF) {
						svc.Infof("task[%s] received EOF, stream closed", taskId.Hex())
						return
					}
					svc.Errorf("task[%s] stream error: %v", taskId.Hex(), res.err)
					return
				}
				svc.processStreamMessage(taskId, res.msg)
			case <-ctx.Done():
				cancel()
				svc.Warnf("task[%s] stream receive timeout", taskId.Hex())
				// Continue loop to try again
			case <-stopCh:
				cancel()
				return
			case <-svc.ctx.Done():
				cancel()
				return
			}
		}
	}
}

func (svc *Service) processStreamMessage(taskId primitive.ObjectID, msg *grpc.TaskServiceSubscribeResponse) {
	switch msg.Code {
	case grpc.TaskServiceSubscribeCode_CANCEL:
		svc.Infof("task[%s] received cancel signal", taskId.Hex())
		// Handle cancel synchronously to avoid goroutine accumulation
		svc.handleCancel(msg, taskId)
	default:
		svc.Debugf("task[%s] received unknown stream message code: %v", taskId.Hex(), msg.Code)
	}
}

func (svc *Service) handleCancel(msg *grpc.TaskServiceSubscribeResponse, taskId primitive.ObjectID) {
	// validate task id
	if msg.TaskId != taskId.Hex() {
		svc.Errorf("task[%s] received cancel signal for another task[%s]", taskId.Hex(), msg.TaskId)
		return
	}

	// cancel task
	err := svc.cancelTask(taskId, msg.Force)
	if err != nil {
		svc.Errorf("task[%s] failed to cancel: %v", taskId.Hex(), err)
		return
	}
	svc.Infof("task[%s] cancelled", taskId.Hex())

	// set task status as "cancelled"
	t, err := svc.GetTaskById(taskId)
	if err != nil {
		svc.Errorf("task[%s] failed to get task: %v", taskId.Hex(), err)
		return
	}
	t.Status = constants.TaskStatusCancelled
	err = svc.UpdateTask(t)
	if err != nil {
		svc.Errorf("task[%s] failed to update task: %v", taskId.Hex(), err)
	}
}

func (svc *Service) cancelTask(taskId primitive.ObjectID, force bool) (err error) {
	r, err := svc.getRunner(taskId)
	if err != nil {
		// Runner not found, task might already be finished
		svc.Warnf("runner not found for task[%s]: %v", taskId.Hex(), err)
		return nil
	}

	// Attempt cancellation with timeout
	cancelCtx, cancelFunc := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancelFunc()

	cancelDone := make(chan error, 1)
	go func() {
		cancelDone <- r.Cancel(force)
	}()

	select {
	case err = <-cancelDone:
		if err != nil {
			svc.Errorf("failed to cancel task[%s]: %v", taskId.Hex(), err)
			// If cancellation failed and force is not set, try force cancellation
			if !force {
				svc.Warnf("escalating to force cancellation for task[%s]", taskId.Hex())
				return svc.cancelTask(taskId, true)
			}
			return err
		}
		svc.Infof("task[%s] cancelled successfully", taskId.Hex())
	case <-cancelCtx.Done():
		svc.Errorf("timeout cancelling task[%s], removing runner from pool", taskId.Hex())
		// Remove runner from pool to prevent further issues
		svc.runners.Delete(taskId)
		return fmt.Errorf("task cancellation timeout")
	}

	return nil
}

// stopAllRunners gracefully stops all running tasks
func (svc *Service) stopAllRunners() {
	svc.Infof("Stopping all running tasks...")

	var runnerIds []primitive.ObjectID

	// Collect all runner IDs
	svc.runners.Range(func(key, value interface{}) bool {
		if taskId, ok := key.(primitive.ObjectID); ok {
			runnerIds = append(runnerIds, taskId)
		}
		return true
	})

	// Cancel all runners with timeout
	var wg sync.WaitGroup
	for _, taskId := range runnerIds {
		wg.Add(1)
		go func(tid primitive.ObjectID) {
			defer wg.Done()
			if err := svc.cancelTask(tid, false); err != nil {
				svc.Errorf("failed to cancel task[%s]: %v", tid.Hex(), err)
				// Force cancel after timeout
				time.Sleep(5 * time.Second)
				_ = svc.cancelTask(tid, true)
			}
		}(taskId)
	}

	// Wait for all cancellations with timeout
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
		svc.Infof("All tasks stopped gracefully")
	case <-time.After(30 * time.Second):
		svc.Warnf("Some tasks did not stop within timeout")
	}
}

func (svc *Service) startStuckTaskCleanup() {
	go func() {
		ticker := time.NewTicker(5 * time.Minute) // Check every 5 minutes
		defer ticker.Stop()

		for {
			select {
			case <-svc.ctx.Done():
				svc.Debugf("stuck task cleanup routine shutting down")
				return
			case <-ticker.C:
				svc.checkAndCleanupStuckTasks()
			}
		}
	}()
}

// checkAndCleanupStuckTasks checks for tasks that have been trying to cancel for too long
func (svc *Service) checkAndCleanupStuckTasks() {
	defer func() {
		if r := recover(); r != nil {
			svc.Errorf("panic in stuck task cleanup: %v", r)
		}
	}()

	var stuckTasks []primitive.ObjectID

	// Check all running tasks
	svc.runners.Range(func(key, value interface{}) bool {
		taskId, ok := key.(primitive.ObjectID)
		if !ok {
			return true
		}

		// Get task from database to check its state
		t, err := svc.GetTaskById(taskId)
		if err != nil {
			svc.Errorf("failed to get task[%s] during stuck cleanup: %v", taskId.Hex(), err)
			return true
		}

		// Check if task has been in cancelling state too long (15+ minutes)
		if t.Status == constants.TaskStatusCancelled && time.Since(t.UpdatedAt) > 15*time.Minute {
			svc.Warnf("detected stuck cancelled task[%s], will force cleanup", taskId.Hex())
			stuckTasks = append(stuckTasks, taskId)
		}

		return true
	})

	// Force cleanup stuck tasks
	for _, taskId := range stuckTasks {
		svc.Infof("force cleaning up stuck task[%s]", taskId.Hex())

		// Remove from runners map
		svc.runners.Delete(taskId)

		// Update task status to indicate it was force cleaned
		t, err := svc.GetTaskById(taskId)
		if err == nil {
			t.Status = constants.TaskStatusCancelled
			t.Error = "Task was stuck in cancelling state and was force cleaned up"
			if updateErr := svc.UpdateTask(t); updateErr != nil {
				svc.Errorf("failed to update stuck task[%s] status: %v", taskId.Hex(), updateErr)
			}
		}
	}

	if len(stuckTasks) > 0 {
		svc.Infof("cleaned up %d stuck tasks", len(stuckTasks))
	}
}

func newTaskHandlerService() *Service {
	// service
	svc := &Service{
		fetchInterval:  1 * time.Second,
		fetchTimeout:   15 * time.Second,
		reportInterval: 5 * time.Second,
		cancelTimeout:  60 * time.Second,
		mu:             sync.RWMutex{},
		runners:        sync.Map{},
		Logger:         utils.NewLogger("TaskHandlerService"),
	}

	// dependency injection
	svc.cfgSvc = nodeconfig.GetNodeConfigService()

	// grpc client
	svc.c = grpcclient.GetGrpcClient()

	return svc
}

var _service *Service
var _serviceOnce sync.Once

func GetTaskHandlerService() *Service {
	_serviceOnce.Do(func() {
		_service = newTaskHandlerService()
	})
	return _service
}
