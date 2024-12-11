package controllers

import (
	"errors"
	"github.com/crawlab-team/crawlab/core/constants"
	"github.com/crawlab-team/crawlab/core/models/models"
	"math"
	"os"
	"path/filepath"
	"sync"

	"github.com/apex/log"
	"github.com/crawlab-team/crawlab/core/fs"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/models/service"
	"github.com/crawlab-team/crawlab/core/spider/admin"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/crawlab-team/crawlab/db/generic"
	"github.com/crawlab-team/crawlab/db/mongo"
	"github.com/crawlab-team/crawlab/trace"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongo2 "go.mongodb.org/mongo-driver/mongo"
)

func GetSpiderById(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		HandleErrorBadRequest(c, err)
		return
	}
	s, err := service.NewModelService[models.Spider]().GetById(id)
	if errors.Is(err, mongo2.ErrNoDocuments) {
		HandleErrorNotFound(c, err)
		return
	}
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// stat
	s.Stat, err = service.NewModelService[models.SpiderStat]().GetById(s.Id)
	if err != nil {
		if !errors.Is(err, mongo2.ErrNoDocuments) {
			HandleErrorInternalServerError(c, err)
			return
		}
	}

	// data collection (compatible to old version) # TODO: remove in the future
	if s.ColName == "" && !s.ColId.IsZero() {
		col, err := service.NewModelService[models.DataCollection]().GetById(s.ColId)
		if err != nil {
			if !errors.Is(err, mongo2.ErrNoDocuments) {
				HandleErrorInternalServerError(c, err)
				return
			}
		} else {
			s.ColName = col.Name
		}
	}

	// git
	if utils.IsPro() && !s.GitId.IsZero() {
		s.Git, err = service.NewModelService[models.Git]().GetById(s.GitId)
		if err != nil {
			if !errors.Is(err, mongo2.ErrNoDocuments) {
				HandleErrorInternalServerError(c, err)
				return
			}
		}
	}

	HandleSuccessWithData(c, s)
}

func GetSpiderList(c *gin.Context) {
	// get all list
	all := MustGetFilterAll(c)
	if all {
		NewController[models.Spider]().getAll(c)
		return
	}

	// get list
	withStats := c.Query("stats")
	if withStats == "" {
		NewController[models.Spider]().GetList(c)
		return
	}

	// get list with stats
	getSpiderListWithStats(c)
}

func getSpiderListWithStats(c *gin.Context) {
	// params
	pagination := MustGetPagination(c)
	query := MustGetFilterQuery(c)
	sort := MustGetSortOption(c)

	// get list
	spiders, err := service.NewModelService[models.Spider]().GetMany(query, &mongo.FindOptions{
		Sort:  sort,
		Skip:  pagination.Size * (pagination.Page - 1),
		Limit: pagination.Size,
	})
	if err != nil {
		if err.Error() != mongo2.ErrNoDocuments.Error() {
			HandleErrorInternalServerError(c, err)
		}
		return
	}
	if len(spiders) == 0 {
		HandleSuccessWithListData(c, []models.Spider{}, 0)
		return
	}

	// ids
	var ids []primitive.ObjectID
	var gitIds []primitive.ObjectID
	for _, s := range spiders {
		ids = append(ids, s.Id)
		if !s.GitId.IsZero() {
			gitIds = append(gitIds, s.GitId)
		}
	}

	// total count
	total, err := service.NewModelService[models.Spider]().Count(query)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// stat list
	spiderStats, err := service.NewModelService[models.SpiderStat]().GetMany(bson.M{"_id": bson.M{"$in": ids}}, nil)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// cache stat list to dict
	dict := map[primitive.ObjectID]models.SpiderStat{}
	var taskIds []primitive.ObjectID
	for _, st := range spiderStats {
		if st.Tasks > 0 {
			taskCount := int64(st.Tasks)
			st.AverageWaitDuration = int64(math.Round(float64(st.WaitDuration) / float64(taskCount)))
			st.AverageRuntimeDuration = int64(math.Round(float64(st.RuntimeDuration) / float64(taskCount)))
			st.AverageTotalDuration = int64(math.Round(float64(st.TotalDuration) / float64(taskCount)))
		}
		dict[st.Id] = st

		if !st.LastTaskId.IsZero() {
			taskIds = append(taskIds, st.LastTaskId)
		}
	}

	// task list and stats
	var tasks []models.Task
	dictTask := map[primitive.ObjectID]models.Task{}
	dictTaskStat := map[primitive.ObjectID]models.TaskStat{}
	if len(taskIds) > 0 {
		// task list
		queryTask := bson.M{
			"_id": bson.M{
				"$in": taskIds,
			},
		}
		tasks, err = service.NewModelService[models.Task]().GetMany(queryTask, nil)
		if err != nil {
			HandleErrorInternalServerError(c, err)
			return
		}

		// task stats list
		taskStats, err := service.NewModelService[models.TaskStat]().GetMany(queryTask, nil)
		if err != nil {
			HandleErrorInternalServerError(c, err)
			return
		}

		// cache task stats to dict
		for _, st := range taskStats {
			dictTaskStat[st.Id] = st
		}

		// cache task list to dict
		for _, t := range tasks {
			st, ok := dictTaskStat[t.Id]
			if ok {
				t.Stat = &st
			}
			dictTask[t.SpiderId] = t
		}
	}

	// git list
	var gits []models.Git
	if len(gitIds) > 0 && utils.IsPro() {
		gits, err = service.NewModelService[models.Git]().GetMany(bson.M{"_id": bson.M{"$in": gitIds}}, nil)
		if err != nil {
			HandleErrorInternalServerError(c, err)
			return
		}
	}

	// cache git list to dict
	dictGit := map[primitive.ObjectID]models.Git{}
	for _, g := range gits {
		dictGit[g.Id] = g
	}

	// iterate list again
	var data []models.Spider
	for _, s := range spiders {
		// spider stat
		st, ok := dict[s.Id]
		if ok {
			s.Stat = &st

			// last task
			t, ok := dictTask[s.Id]
			if ok {
				s.Stat.LastTask = &t
			}
		}

		// git
		if !s.GitId.IsZero() && utils.IsPro() {
			g, ok := dictGit[s.GitId]
			if ok {
				s.Git = &g
			}
		}

		// add to list
		data = append(data, s)
	}

	// response
	HandleSuccessWithListData(c, data, total)
}

func PostSpider(c *gin.Context) {
	// bind
	var s models.Spider
	if err := c.ShouldBindJSON(&s); err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	if s.Mode == "" {
		s.Mode = constants.RunTypeRandom
	}
	if s.Priority == 0 {
		s.Priority = 5
	}

	// user
	u := GetUserFromContext(c)

	// add
	s.SetCreated(u.Id)
	s.SetUpdated(u.Id)
	id, err := service.NewModelService[models.Spider]().InsertOne(s)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}
	s.SetId(id)

	// add stat
	st := models.SpiderStat{}
	st.SetId(id)
	st.SetCreated(u.Id)
	st.SetUpdated(u.Id)
	_, err = service.NewModelService[models.SpiderStat]().InsertOne(st)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// create folder
	fsSvc, err := getSpiderFsSvcById(id)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}
	err = fsSvc.CreateDir(".")
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	HandleSuccessWithData(c, s)
}

func PutSpiderById(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	// bind
	var s models.Spider
	if err := c.ShouldBindJSON(&s); err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	u := GetUserFromContext(c)

	modelSvc := service.NewModelService[models.Spider]()

	// save
	s.SetUpdated(u.Id)
	err = modelSvc.ReplaceById(id, s)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	_s, err := modelSvc.GetById(id)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}
	s = *_s

	HandleSuccessWithData(c, s)
}

func DeleteSpiderById(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	// spider
	s, err := service.NewModelService[models.Spider]().GetById(id)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	if err := mongo.RunTransaction(func(context mongo2.SessionContext) (err error) {
		// delete spider
		err = service.NewModelService[models.Spider]().DeleteById(id)
		if err != nil {
			return err
		}

		// delete spider stat
		err = service.NewModelService[models.SpiderStat]().DeleteById(id)
		if err != nil {
			return err
		}

		// related tasks
		tasks, err := service.NewModelService[models.Task]().GetMany(bson.M{"spider_id": id}, nil)
		if err != nil {
			return err
		}

		if len(tasks) == 0 {
			return nil
		}

		// task ids
		var taskIds []primitive.ObjectID
		for _, t := range tasks {
			taskIds = append(taskIds, t.Id)
		}

		// delete related tasks
		err = service.NewModelService[models.Task]().DeleteMany(bson.M{"_id": bson.M{"$in": taskIds}})
		if err != nil {
			return err
		}

		// delete related task stats
		err = service.NewModelService[models.TaskStat]().DeleteMany(bson.M{"_id": bson.M{"$in": taskIds}})
		if err != nil {
			return err
		}

		// delete tasks logs
		wg := sync.WaitGroup{}
		wg.Add(len(taskIds))
		for _, id := range taskIds {
			go func(id string) {
				// delete task logs
				logPath := filepath.Join(utils.GetTaskLogPath(), id)
				if err := os.RemoveAll(logPath); err != nil {
					log.Warnf("failed to remove task log directory: %s", logPath)
				}
				wg.Done()
			}(id.Hex())
		}
		wg.Wait()

		return nil
	}); err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	if !s.GitId.IsZero() {
		go func() {
			// delete spider directory
			fsSvc, err := getSpiderFsSvcById(id)
			if err != nil {
				log.Errorf("failed to get spider fs service: %s", err.Error())
				return
			}
			err = fsSvc.Delete(".")
			if err != nil {
				log.Errorf("failed to delete spider directory: %s", err.Error())
				return
			}
		}()
	}

	HandleSuccess(c)
}

func DeleteSpiderList(c *gin.Context) {
	var payload struct {
		Ids []primitive.ObjectID `json:"ids"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	// Fetch spiders before deletion
	spiders, err := service.NewModelService[models.Spider]().GetMany(bson.M{
		"_id": bson.M{
			"$in": payload.Ids,
		},
	}, nil)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	if err := mongo.RunTransaction(func(context mongo2.SessionContext) (err error) {
		// delete spiders
		if err := service.NewModelService[models.Spider]().DeleteMany(bson.M{
			"_id": bson.M{
				"$in": payload.Ids,
			},
		}); err != nil {
			return err
		}

		// delete spider stats
		if err := service.NewModelService[models.SpiderStat]().DeleteMany(bson.M{
			"_id": bson.M{
				"$in": payload.Ids,
			},
		}); err != nil {
			return err
		}

		// related tasks
		tasks, err := service.NewModelService[models.Task]().GetMany(bson.M{"spider_id": bson.M{"$in": payload.Ids}}, nil)
		if err != nil {
			return err
		}

		if len(tasks) == 0 {
			return nil
		}

		// task ids
		var taskIds []primitive.ObjectID
		for _, t := range tasks {
			taskIds = append(taskIds, t.Id)
		}

		// delete related tasks
		if err := service.NewModelService[models.Task]().DeleteMany(bson.M{"_id": bson.M{"$in": taskIds}}); err != nil {
			return err
		}

		// delete related task stats
		if err := service.NewModelService[models.TaskStat]().DeleteMany(bson.M{"_id": bson.M{"$in": taskIds}}); err != nil {
			return err
		}

		// delete tasks logs
		wg := sync.WaitGroup{}
		wg.Add(len(taskIds))
		for _, id := range taskIds {
			go func(id string) {
				// delete task logs
				logPath := filepath.Join(utils.GetTaskLogPath(), id)
				if err := os.RemoveAll(logPath); err != nil {
					log.Warnf("failed to remove task log directory: %s", logPath)
				}
				wg.Done()
			}(id.Hex())
		}
		wg.Wait()

		return nil
	}); err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// Delete spider directories
	go func() {
		wg := sync.WaitGroup{}
		wg.Add(len(spiders))
		for i := range spiders {
			go func(s *models.Spider) {
				defer wg.Done()

				// Skip spider with git
				if !s.GitId.IsZero() {
					return
				}

				// Delete spider directory
				fsSvc, err := getSpiderFsSvcById(s.Id)
				if err != nil {
					log.Errorf("failed to get spider fs service: %s", err.Error())
					trace.PrintError(err)
					return
				}
				err = fsSvc.Delete(".")
				if err != nil {
					log.Errorf("failed to delete spider directory: %s", err.Error())
					trace.PrintError(err)
					return
				}
			}(&spiders[i])
		}
		wg.Wait()
	}()

	HandleSuccess(c)
}

func GetSpiderListDir(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	GetBaseFileListDir(rootPath, c)
}

func GetSpiderFile(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	GetBaseFileFile(rootPath, c)
}

func GetSpiderFileInfo(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	GetBaseFileFileInfo(rootPath, c)
}

func PostSpiderSaveFile(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	PostBaseFileSaveFile(rootPath, c)
}

func PostSpiderSaveFiles(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	targetDirectory := c.PostForm("targetDirectory")
	PostBaseFileSaveFiles(filepath.Join(rootPath, targetDirectory), c)
}

func PostSpiderSaveDir(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	PostBaseFileSaveDir(rootPath, c)
}

func PostSpiderRenameFile(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	PostBaseFileRenameFile(rootPath, c)
}

func DeleteSpiderFile(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	DeleteBaseFileFile(rootPath, c)
}

func PostSpiderCopyFile(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	PostBaseFileCopyFile(rootPath, c)
}

func PostSpiderExport(c *gin.Context) {
	rootPath, err := getSpiderRootPathByContext(c)
	if err != nil {
		HandleErrorForbidden(c, err)
		return
	}
	PostBaseFileExport(rootPath, c)
}

func PostSpiderRun(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	// options
	var opts interfaces.SpiderRunOptions
	if err := c.ShouldBindJSON(&opts); err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// user
	if u := GetUserFromContext(c); u != nil {
		opts.UserId = u.GetId()
	}

	adminSvc := admin.GetSpiderAdminService()

	// schedule
	taskIds, err := adminSvc.Schedule(id, &opts)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	HandleSuccessWithData(c, taskIds)
}

func GetSpiderResults(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		HandleErrorBadRequest(c, err)
		return
	}

	s, err := service.NewModelService[models.Spider]().GetById(id)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	// params
	pagination := MustGetPagination(c)
	query := getResultListQuery(c)

	col := mongo.GetMongoCol(s.ColName)

	var results []bson.M
	err = col.Find(utils.GetMongoQuery(query), utils.GetMongoOpts(&generic.ListOptions{
		Sort:  []generic.ListSort{{"_id", generic.SortDirectionDesc}},
		Skip:  pagination.Size * (pagination.Page - 1),
		Limit: pagination.Size,
	})).All(&results)
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	total, err := mongo.GetMongoCol(s.ColName).Count(utils.GetMongoQuery(query))
	if err != nil {
		HandleErrorInternalServerError(c, err)
		return
	}

	HandleSuccessWithListData(c, results, total)
}

func getSpiderFsSvc(s *models.Spider) (svc interfaces.FsService, err error) {
	workspacePath := utils.GetWorkspace()
	fsSvc := fs.NewFsService(filepath.Join(workspacePath, s.Id.Hex()))

	return fsSvc, nil
}

func getSpiderFsSvcById(id primitive.ObjectID) (svc interfaces.FsService, err error) {
	s, err := service.NewModelService[models.Spider]().GetById(id)
	if err != nil {
		log.Errorf("failed to get spider: %s", err.Error())
		trace.PrintError(err)
		return nil, err
	}
	return getSpiderFsSvc(s)
}

func getSpiderRootPathByContext(c *gin.Context) (rootPath string, err error) {
	// spider id
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		return "", err
	}

	// spider
	s, err := service.NewModelService[models.Spider]().GetById(id)
	if err != nil {
		return "", err
	}

	return utils.GetSpiderRootPath(s)
}
