package handler

import (
	"context"
	"fmt"
	"sync"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// taskRequest represents a task execution request
type taskRequest struct {
	taskId primitive.ObjectID
}

// TaskWorkerPool manages a bounded pool of workers for task execution
type TaskWorkerPool struct {
	workers   int
	ctx       context.Context
	cancel    context.CancelFunc
	wg        sync.WaitGroup
	taskQueue chan taskRequest
	service   *Service
}

func NewTaskWorkerPool(workers int, service *Service) *TaskWorkerPool {
	// Use service context for proper cancellation chain
	ctx, cancel := context.WithCancel(service.ctx)
	// Use a more generous queue size to handle task bursts
	// Queue size is workers * 5 to allow for better buffering
	queueSize := workers * 5
	if queueSize < 50 {
		queueSize = 50 // Minimum queue size
	}

	return &TaskWorkerPool{
		workers:   workers,
		ctx:       ctx,
		cancel:    cancel,
		taskQueue: make(chan taskRequest, queueSize),
		service:   service,
	}
}

func (pool *TaskWorkerPool) Start() {
	for i := 0; i < pool.workers; i++ {
		pool.wg.Add(1)
		go pool.worker(i)
	}
}

func (pool *TaskWorkerPool) Stop() {
	pool.cancel()
	close(pool.taskQueue)
	pool.wg.Wait()
}

func (pool *TaskWorkerPool) SubmitTask(taskId primitive.ObjectID) error {
	req := taskRequest{
		taskId: taskId,
	}

	select {
	case pool.taskQueue <- req:
		pool.service.Debugf("task[%s] queued for parallel execution, queue usage: %d/%d",
			taskId.Hex(), len(pool.taskQueue), cap(pool.taskQueue))
		return nil // Return immediately - task will execute in parallel
	case <-pool.ctx.Done():
		return fmt.Errorf("worker pool is shutting down")
	default:
		queueLen := len(pool.taskQueue)
		queueCap := cap(pool.taskQueue)
		pool.service.Warnf("task queue is full (%d/%d), consider increasing task.workers configuration",
			queueLen, queueCap)
		return fmt.Errorf("task queue is full (%d/%d), consider increasing task.workers configuration",
			queueLen, queueCap)
	}
}

func (pool *TaskWorkerPool) worker(workerID int) {
	defer pool.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			pool.service.Errorf("worker %d panic recovered: %v", workerID, r)
		}
	}()

	pool.service.Debugf("worker %d started", workerID)

	for {
		select {
		case <-pool.ctx.Done():
			pool.service.Debugf("worker %d shutting down", workerID)
			return
		case req, ok := <-pool.taskQueue:
			if !ok {
				pool.service.Debugf("worker %d: task queue closed", workerID)
				return
			}

			// Execute task asynchronously - each worker handles one task at a time
			// but multiple workers can process different tasks simultaneously
			pool.service.Debugf("worker %d processing task[%s]", workerID, req.taskId.Hex())
			err := pool.service.executeTask(req.taskId)
			if err != nil {
				pool.service.Errorf("worker %d failed to execute task[%s]: %v",
					workerID, req.taskId.Hex(), err)
			} else {
				pool.service.Debugf("worker %d completed task[%s]", workerID, req.taskId.Hex())
			}
		}
	}
}
