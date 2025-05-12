package controllers

import (
	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/gin-gonic/gin"
)

func GetSystemInfo(_ *gin.Context) (response *Response[entity.SystemInfo], err error) {
	info := entity.SystemInfo{
		Edition: utils.GetEdition(),
		Version: utils.GetVersion(),
	}
	return GetDataResponse(info)
}
