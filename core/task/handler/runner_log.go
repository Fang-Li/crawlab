package handler

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/crawlab-team/crawlab/grpc"
)

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

	// Update last successful connection time to help health check avoid unnecessary pings
	r.lastConnCheck = time.Now()
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
