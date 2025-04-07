package utils

import (
	"github.com/crawlab-team/crawlab/trace"
	"io"
)

func Close(c io.Closer) {
	err := c.Close()
	if err != nil {
		trace.PrintError(err)
	}
}

func ContainsString(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
