/*
 * Copyright (c) 2025. Core Digital Limited
 * 版权所有 (c) 2025. 重庆科锐数研科技有限公司 (Core Digital Limited)
 * All rights reserved. 保留所有权利。
 *
 * 该软件由 重庆科锐数研科技有限公司 (Core Digital Limited) 开发，未经明确书面许可，任何人不得使用、复制、修改或分发该软件的任何部分。
 * This software is developed by Core Digital Limited. No one is permitted to use, copy, modify, or distribute this software without explicit written permission.
 *
 * 许可证：
 * 该软件仅供授权使用。授权用户有权在授权范围内使用、复制、修改和分发该软件。
 * License:
 * This software is for authorized use only. Authorized users are permitted to use, copy, modify, and distribute this software within the scope of their authorization.
 *
 * 免责声明：
 * 该软件按"原样"提供，不附带任何明示或暗示的担保，包括但不限于对适销性和适用于特定目的的担保。在任何情况下，版权持有者或其许可方对因使用该软件而产生的任何损害或其他责任概不负责。
 * Disclaimer:
 * This software is provided "as is," without any express or implied warranties, including but not limited to warranties of merchantability and fitness for a particular purpose. In no event shall the copyright holder or its licensors be liable for any damages or other liability arising from the use of this software.
 */

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
