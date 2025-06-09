package controllers

import (
	errors2 "errors"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/models/models"
	"github.com/crawlab-team/crawlab/core/models/service"
	"github.com/crawlab-team/crawlab/core/schedule"
	"github.com/crawlab-team/crawlab/core/spider/admin"
	"github.com/gin-gonic/gin"
	"github.com/juju/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetScheduleById handles getting a spider by ID
func GetScheduleById(_ *gin.Context, params *GetByIdParams) (response *Response[models.Schedule], err error) {
	id, err := primitive.ObjectIDFromHex(params.Id)
	if err != nil {
		return GetErrorResponse[models.Schedule](errors.BadRequestf("invalid id format"))
	}
	s, err := service.NewModelService[models.Schedule]().GetById(id)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return GetErrorResponse[models.Schedule](errors.NotFoundf("spider not found"))
	}
	if err != nil {
		return GetErrorResponse[models.Schedule](err)
	}

	// spider
	if !s.SpiderId.IsZero() {
		s.Spider, err = service.NewModelService[models.Spider]().GetById(s.SpiderId)
		if err != nil {
			if !errors.Is(err, mongo.ErrNoDocuments) {
				return GetErrorResponse[models.Schedule](err)
			}
		}
	}

	return GetDataResponse(*s)
}

func GetScheduleList(_ *gin.Context, params *GetListParams) (response *ListResponse[models.Schedule], err error) {
	query := ConvertToBsonMFromListParams(params)
	sort, err := GetSortOptionFromString(params.Sort)
	if err != nil {
		return GetErrorListResponse[models.Schedule](errors.BadRequestf("invalid request parameters: %v", err))
	}
	skip, limit := GetSkipLimitFromListParams(params)

	// total count
	total, err := service.NewModelService[models.Schedule]().Count(query)
	if err != nil {
		return GetErrorListResponse[models.Schedule](err)
	}

	// check total
	if total == 0 {
		return GetEmptyListResponse[models.Schedule]()
	}

	// aggregation pipelines
	pipelines := service.GetPaginationPipeline(query, sort, skip, limit)
	pipelines = append(pipelines, service.GetDefaultJoinPipeline[models.Spider]()...)

	// perform query
	var schedules []models.Schedule
	err = service.GetCollection[models.Schedule]().Aggregate(pipelines, nil).All(&schedules)
	if err != nil {
		return GetErrorListResponse[models.Schedule](err)
	}

	return GetListResponse(schedules, total)
}

type PostScheduleParams struct {
	Data models.Schedule `json:"data" description:"The data to create" validate:"required"`
}

func PostSchedule(c *gin.Context, params *PostScheduleParams) (response *Response[models.Schedule], err error) {
	s := params.Data
	u := GetUserFromContext(c)

	modelSvc := service.NewModelService[models.Schedule]()

	s.SetCreated(u.Id)
	s.SetUpdated(u.Id)
	id, err := modelSvc.InsertOne(s)
	if err != nil {
		return GetErrorResponse[models.Schedule](err)
	}
	s.Id = id

	if s.Enabled {
		scheduleSvc := schedule.GetScheduleService()
		if err := scheduleSvc.Enable(s, u.Id); err != nil {
			return GetErrorResponse[models.Schedule](err)
		}
	}

	return GetDataResponse(s)
}

type PutScheduleByIdParams struct {
	Id   string          `path:"id" description:"Schedule ID" format:"objectid" pattern:"^[0-9a-fA-F]{24}$"`
	Data models.Schedule `json:"data" description:"The data to update" validate:"required"`
}

func PutScheduleById(c *gin.Context, params *PutScheduleByIdParams) (response *Response[models.Schedule], err error) {
	id, err := primitive.ObjectIDFromHex(params.Id)
	if err != nil {
		return GetErrorResponse[models.Schedule](errors.BadRequestf("invalid schedule id: %v", err))
	}

	s := params.Data
	if s.Id != id {
		return GetErrorResponse[models.Schedule](errors2.New("id in path does not match id in body"))
	}

	modelSvc := service.NewModelService[models.Schedule]()
	err = modelSvc.ReplaceById(id, s)
	if err != nil {
		return GetErrorResponse[models.Schedule](err)
	}

	scheduleSvc := schedule.GetScheduleService()
	u := GetUserFromContext(c)

	if s.Enabled {
		if err := scheduleSvc.Enable(s, u.Id); err != nil {
			return GetErrorResponse[models.Schedule](err)
		}
	} else {
		if err := scheduleSvc.Disable(s, u.Id); err != nil {
			return GetErrorResponse[models.Schedule](err)
		}
	}

	return GetDataResponse(s)
}

type PostScheduleEnableDisableParams struct {
	Id string `path:"id" description:"Schedule ID" format:"objectid" pattern:"^[0-9a-fA-F]{24}$"`
}

func PostScheduleEnable(c *gin.Context, params *PostScheduleEnableDisableParams) (response *VoidResponse, err error) {
	userId := GetUserFromContext(c).Id
	return postScheduleEnableDisableFunc(true, userId, params)
}

func PostScheduleDisable(c *gin.Context, params *PostScheduleEnableDisableParams) (response *VoidResponse, err error) {
	userId := GetUserFromContext(c).Id
	return postScheduleEnableDisableFunc(false, userId, params)
}

func postScheduleEnableDisableFunc(isEnable bool, userId primitive.ObjectID, params *PostScheduleEnableDisableParams) (response *VoidResponse, err error) {
	id, err := primitive.ObjectIDFromHex(params.Id)
	if err != nil {
		return GetErrorVoidResponse(errors.BadRequestf("invalid schedule id: %v", err))
	}

	svc := schedule.GetScheduleService()
	s, err := service.NewModelService[models.Schedule]().GetById(id)
	if err != nil {
		return GetErrorVoidResponse(err)
	}

	if isEnable {
		err = svc.Enable(*s, userId)
	} else {
		err = svc.Disable(*s, userId)
	}
	if err != nil {
		return GetErrorVoidResponse(err)
	}

	return GetVoidResponse()
}

type PostScheduleRunParams struct {
	Id       string   `path:"id" description:"Schedule ID" format:"objectid" pattern:"^[0-9a-fA-F]{24}$"`
	Mode     string   `json:"mode" description:"Run mode" enum:"random,all,selected-nodes"`
	NodeIds  []string `json:"node_ids" description:"Node IDs" items.type:"string" items.format:"objectid" items.pattern:"^[0-9a-fA-F]{24}$"`
	Cmd      string   `json:"cmd" description:"Command"`
	Param    string   `json:"param" description:"Parameters"`
	Priority int      `json:"priority" description:"Priority" default:"5" minimum:"1" maximum:"10"`
}

func PostScheduleRun(c *gin.Context, params *PostScheduleRunParams) (response *Response[[]primitive.ObjectID], err error) {
	userId := GetUserFromContext(c).Id
	return postScheduleRunFunc(params, userId)
}

func postScheduleRunFunc(params *PostScheduleRunParams, userId primitive.ObjectID) (response *Response[[]primitive.ObjectID], err error) {
	id, err := primitive.ObjectIDFromHex(params.Id)
	if err != nil {
		return GetErrorResponse[[]primitive.ObjectID](errors.BadRequestf("invalid schedule id: %v", err))
	}

	var nodeIds []primitive.ObjectID
	for _, nodeId := range params.NodeIds {
		nodeId, err := primitive.ObjectIDFromHex(nodeId)
		if err != nil {
			return GetErrorResponse[[]primitive.ObjectID](errors.BadRequestf("invalid node id: %v", err))
		}
		nodeIds = append(nodeIds, nodeId)
	}

	opts := interfaces.SpiderRunOptions{
		Mode:       params.Mode,
		NodeIds:    nodeIds,
		Cmd:        params.Cmd,
		Param:      params.Param,
		Priority:   params.Priority,
		ScheduleId: id,
		UserId:     userId,
	}

	// schedule
	sch, err := service.NewModelService[models.Schedule]().GetById(id)
	if err != nil {
		return GetErrorResponse[[]primitive.ObjectID](err)
	}

	// spider
	s, err := service.NewModelService[models.Spider]().GetById(sch.SpiderId)
	if err != nil {
		return GetErrorResponse[[]primitive.ObjectID](err)
	}

	// user
	opts.UserId = userId

	// schedule tasks
	taskIds, err := admin.GetSpiderAdminService().Schedule(s.Id, &opts)
	if err != nil {
		return GetErrorResponse[[]primitive.ObjectID](err)
	}

	return GetDataResponse(taskIds)
}
