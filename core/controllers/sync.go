package controllers

import (
	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/juju/errors"
	"path/filepath"

	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/gin-gonic/gin"
)

func GetSyncScan(c *gin.Context) (response *Response[entity.FsFileInfoMap], err error) {
	workspacePath := utils.GetWorkspace()
	dirPath := filepath.Join(workspacePath, c.Param("id"), c.Param("path"))
	files, err := utils.ScanDirectory(dirPath)
	if err != nil {
		return GetErrorResponse[entity.FsFileInfoMap](err)
	}
	return GetDataResponse(files)
}

func GetSyncDownload(c *gin.Context) (err error) {
	workspacePath := utils.GetWorkspace()
	filePath := filepath.Join(workspacePath, c.Param("id"), c.Query("path"))
	if !utils.Exists(filePath) {
		return errors.NotFoundf("file not exists: %s", filePath)
	}
	c.File(filePath)
	return nil
}
