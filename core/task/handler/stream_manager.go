package handler

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/crawlab-team/crawlab/grpc"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// StreamManager manages task streams without goroutine leaks
type StreamManager struct {
	streams      sync.Map // map[primitive.ObjectID]*TaskStream
	ctx          context.Context
	cancel       context.CancelFunc
	wg           sync.WaitGroup
	service      *Service
	messageQueue chan *StreamMessage
	maxStreams   int
}

// TaskStream represents a single task's stream
type TaskStream struct {
	taskId     primitive.ObjectID
	stream     grpc.TaskService_SubscribeClient
	ctx        context.Context
	cancel     context.CancelFunc
	lastActive time.Time
	mu         sync.RWMutex
}

// StreamMessage represents a message from a stream
type StreamMessage struct {
	taskId primitive.ObjectID
	msg    *grpc.TaskServiceSubscribeResponse
	err    error
}

func NewStreamManager(service *Service) *StreamManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &StreamManager{
		ctx:          ctx,
		cancel:       cancel,
		service:      service,
		messageQueue: make(chan *StreamMessage, 100), // Buffered channel for messages
		maxStreams:   50,                             // Limit concurrent streams
	}
}

func (sm *StreamManager) Start() {
	sm.wg.Add(2)
	go sm.messageProcessor()
	go sm.streamCleaner()
}

func (sm *StreamManager) Stop() {
	sm.cancel()
	close(sm.messageQueue)

	// Close all active streams
	sm.streams.Range(func(key, value interface{}) bool {
		if ts, ok := value.(*TaskStream); ok {
			ts.Close()
		}
		return true
	})

	sm.wg.Wait()
}

func (sm *StreamManager) AddTaskStream(taskId primitive.ObjectID) error {
	// Check if we're at the stream limit
	streamCount := 0
	sm.streams.Range(func(key, value interface{}) bool {
		streamCount++
		return true
	})

	if streamCount >= sm.maxStreams {
		return fmt.Errorf("stream limit reached (%d)", sm.maxStreams)
	}

	// Create new stream
	stream, err := sm.service.subscribeTask(taskId)
	if err != nil {
		return fmt.Errorf("failed to subscribe to task stream: %v", err)
	}

	ctx, cancel := context.WithCancel(sm.ctx)
	taskStream := &TaskStream{
		taskId:     taskId,
		stream:     stream,
		ctx:        ctx,
		cancel:     cancel,
		lastActive: time.Now(),
	}

	sm.streams.Store(taskId, taskStream)

	// Start listening for messages in a single goroutine per stream
	sm.wg.Add(1)
	go sm.streamListener(taskStream)

	return nil
}

func (sm *StreamManager) RemoveTaskStream(taskId primitive.ObjectID) {
	if value, ok := sm.streams.LoadAndDelete(taskId); ok {
		if ts, ok := value.(*TaskStream); ok {
			ts.Close()
		}
	}
}

func (sm *StreamManager) streamListener(ts *TaskStream) {
	defer sm.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			sm.service.Errorf("stream listener panic for task[%s]: %v", ts.taskId.Hex(), r)
		}
		ts.Close()
		sm.streams.Delete(ts.taskId)
	}()

	sm.service.Debugf("stream listener started for task[%s]", ts.taskId.Hex())

	for {
		select {
		case <-ts.ctx.Done():
			sm.service.Debugf("stream listener stopped for task[%s]", ts.taskId.Hex())
			return
		case <-sm.ctx.Done():
			return
		default:
			msg, err := ts.stream.Recv()

			if err != nil {
				if errors.Is(err, io.EOF) {
					sm.service.Debugf("stream EOF for task[%s]", ts.taskId.Hex())
					return
				}
				if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
					return
				}
				sm.service.Errorf("stream error for task[%s]: %v", ts.taskId.Hex(), err)
				return
			}

			// Update last active time
			ts.mu.Lock()
			ts.lastActive = time.Now()
			ts.mu.Unlock()

			// Send message to processor
			select {
			case sm.messageQueue <- &StreamMessage{
				taskId: ts.taskId,
				msg:    msg,
				err:    nil,
			}:
			case <-ts.ctx.Done():
				return
			case <-sm.ctx.Done():
				return
			default:
				sm.service.Warnf("message queue full, dropping message for task[%s]", ts.taskId.Hex())
			}
		}
	}
}

func (sm *StreamManager) messageProcessor() {
	defer sm.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			sm.service.Errorf("message processor panic: %v", r)
		}
	}()

	sm.service.Debugf("stream message processor started")

	for {
		select {
		case <-sm.ctx.Done():
			sm.service.Debugf("stream message processor shutting down")
			return
		case msg, ok := <-sm.messageQueue:
			if !ok {
				return
			}
			sm.processMessage(msg)
		}
	}
}

func (sm *StreamManager) processMessage(streamMsg *StreamMessage) {
	if streamMsg.err != nil {
		sm.service.Errorf("stream message error for task[%s]: %v", streamMsg.taskId.Hex(), streamMsg.err)
		return
	}

	// Process the actual message
	sm.service.processStreamMessage(streamMsg.taskId, streamMsg.msg)
}

func (sm *StreamManager) streamCleaner() {
	defer sm.wg.Done()
	defer func() {
		if r := recover(); r != nil {
			sm.service.Errorf("stream cleaner panic: %v", r)
		}
	}()

	ticker := time.NewTicker(2 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-sm.ctx.Done():
			return
		case <-ticker.C:
			sm.cleanupInactiveStreams()
		}
	}
}

func (sm *StreamManager) cleanupInactiveStreams() {
	now := time.Now()
	inactiveThreshold := 10 * time.Minute

	sm.streams.Range(func(key, value interface{}) bool {
		taskId := key.(primitive.ObjectID)
		ts := value.(*TaskStream)

		ts.mu.RLock()
		lastActive := ts.lastActive
		ts.mu.RUnlock()

		if now.Sub(lastActive) > inactiveThreshold {
			sm.service.Debugf("cleaning up inactive stream for task[%s]", taskId.Hex())
			sm.RemoveTaskStream(taskId)
		}

		return true
	})
}

func (ts *TaskStream) Close() {
	ts.cancel()
	if ts.stream != nil {
		_ = ts.stream.CloseSend()
	}
}
