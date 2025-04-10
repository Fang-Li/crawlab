package controllers

import (
	"encoding/json"
	"net/http"
	"reflect"
	"strings"

	"github.com/crawlab-team/crawlab/core/constants"
	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/crawlab-team/crawlab/core/models/models"
	"github.com/crawlab-team/crawlab/core/mongo"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/crawlab-team/crawlab/trace"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var logger = utils.NewLogger("Controllers")

func GetUserFromContext(c *gin.Context) (u *models.User) {
	value, ok := c.Get(constants.UserContextKey)
	if !ok {
		return nil
	}
	u, ok = value.(*models.User)
	if !ok {
		return nil
	}
	return u
}

func ConvertToBsonMFromListParams(params *GetListParams) (q bson.M) {
	if params.Filter == "" {
		return nil
	}
	filter := ConvertToFilter(params.Filter)
	return utils.FilterToQuery(filter)
}

func ConvertToBsonMFromFilter(filterStr string) (q bson.M) {
	if filterStr == "" {
		return nil
	}
	filter := ConvertToFilter(filterStr)
	return utils.FilterToQuery(filter)
}

func ConvertToFilter(filterStr string) (f *entity.Filter) {
	if filterStr == "" {
		return nil
	}
	trimmedFilterStr := strings.TrimSpace(filterStr)
	if strings.HasPrefix(trimmedFilterStr, "[") {
		return convertToFilterArray(filterStr)
	} else if strings.HasPrefix(trimmedFilterStr, "{") {
		return convertToFilterMap(filterStr)
	} else {
		return nil
	}
}

func convertToFilterMap(filterStr string) (f *entity.Filter) {
	var filter map[string]interface{}
	if err := json.Unmarshal([]byte(filterStr), &filter); err != nil {
		return nil
	}

	var conditions []*entity.Condition
	for k, v := range filter {
		conditions = append(conditions, &entity.Condition{
			Key:   k,
			Op:    constants.FilterOpEqual,
			Value: convertFilterValue(v),
		})
	}

	return &entity.Filter{
		IsOr:       false,
		Conditions: conditions,
	}
}

func convertToFilterArray(filterStr string) (f *entity.Filter) {
	var conditions []*entity.Condition
	if err := json.Unmarshal([]byte(filterStr), &conditions); err != nil {
		return nil
	}

	for i, cond := range conditions {
		conditions[i].Value = convertFilterValue(cond.Value)
	}

	return &entity.Filter{
		IsOr:       false,
		Conditions: conditions,
	}
}

func convertFilterValue(value interface{}) interface{} {
	v := reflect.ValueOf(value)
	switch v.Kind() {
	case reflect.String:
		item := value.(string)
		// attempt to convert object id
		id, err := primitive.ObjectIDFromHex(item)
		if err == nil {
			return id
		} else {
			return item
		}
	case reflect.Float64:
		// JSON numbers are decoded as float64 by default
		switch value.(type) {
		case float64:
			num := value.(float64)
			// Check if it's a whole number
			if num == float64(int64(num)) {
				return int64(num)
			} else {
				return num
			}
		case int:
			num := value.(int)
			return int64(num)
		case int64:
			num := value.(int64)
			return num
		}
	case reflect.Bool:
		return value.(bool)
	case reflect.Slice, reflect.Array:
		var items []interface{}
		for i := 0; i < v.Len(); i++ {
			vItem := v.Index(i)
			item := vItem.Interface()

			switch typedItem := item.(type) {
			case string:
				// Try to convert to ObjectID first
				if id, err := primitive.ObjectIDFromHex(typedItem); err == nil {
					items = append(items, id)
				} else {
					items = append(items, typedItem)
				}
			case float64:
				if typedItem == float64(int64(typedItem)) {
					items = append(items, int64(typedItem))
				} else {
					items = append(items, typedItem)
				}
			case bool:
				items = append(items, typedItem)
			default:
				items = append(items, item)
			}
		}
		return items
	default:
		return value
	}
	return value
}

// GetFilterFromContext Get entity.Filter from gin.Context
func GetFilterFromContext(c *gin.Context) (f *entity.Filter) {
	filterStr := c.GetString(constants.FilterQueryFieldFilter)
	return ConvertToFilter(filterStr)
}

// ConvertToBsonMFromContext Get bson.M from gin.Context
func ConvertToBsonMFromContext(c *gin.Context) (q bson.M) {
	f := GetFilterFromContext(c)
	return utils.FilterToQuery(f)
}

func GetResultListQuery(c *gin.Context) (q mongo.ListQuery) {
	f := GetFilterFromContext(c)
	for _, cond := range f.Conditions {
		q = append(q, mongo.ListQueryCondition{
			Key:   cond.Key,
			Op:    cond.Op,
			Value: utils.NormalizeObjectId(cond.Value),
		})
	}
	return q
}

func GetSortsFromString(sortStr string) (sorts []entity.Sort, err error) {
	if sortStr == "" {
		return nil, nil
	}
	parts := strings.Split(sortStr, ",")
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		if !strings.HasPrefix(trimmed, "-") {
			key := strings.TrimLeft(trimmed, "+")
			sorts = append(sorts, entity.Sort{
				Key:       key,
				Direction: constants.DESCENDING,
			})
		} else if strings.HasPrefix(trimmed, "+") {
			key := strings.TrimLeft(trimmed, "+")
			sorts = append(sorts, entity.Sort{
				Key:       key,
				Direction: constants.ASCENDING,
			})
		} else {
			key := strings.TrimLeft(trimmed, "-")
			sorts = append(sorts, entity.Sort{
				Key:       key,
				Direction: constants.ASCENDING,
			})
		}
	}
	return sorts, nil
}

func GetSortOptionFromString(sortStr string) (sort bson.D, err error) {
	sorts, err := GetSortsFromString(sortStr)
	if err != nil {
		return nil, err
	}
	if sorts == nil || len(sorts) == 0 {
		return bson.D{{"_id", -1}}, nil
	}
	return SortsToOption(sorts)
}

// GetSorts Get entity.Sort from gin.Context
func GetSorts(c *gin.Context) (sorts []entity.Sort, err error) {
	// bind
	sortStr := c.Query(constants.SortQueryField)
	if err := json.Unmarshal([]byte(sortStr), &sorts); err != nil {
		return nil, err
	}
	return sorts, nil
}

// GetSortsOption Get entity.Sort from gin.Context
func GetSortsOption(c *gin.Context) (sort bson.D, err error) {
	sorts, err := GetSorts(c)
	if err != nil {
		return nil, err
	}

	if sorts == nil || len(sorts) == 0 {
		return bson.D{{"_id", -1}}, nil
	}

	return SortsToOption(sorts)
}

func MustGetSortOption(c *gin.Context) (sort bson.D) {
	sort, err := GetSortsOption(c)
	if err != nil {
		return nil
	}
	return sort
}

// SortsToOption Translate entity.Sort to bson.D
func SortsToOption(sorts []entity.Sort) (sort bson.D, err error) {
	sort = bson.D{}
	for _, s := range sorts {
		switch s.Direction {
		case constants.ASCENDING:
			sort = append(sort, bson.E{Key: s.Key, Value: 1})
		case constants.DESCENDING:
			sort = append(sort, bson.E{Key: s.Key, Value: -1})
		}
	}
	if len(sort) == 0 {
		sort = bson.D{{"_id", -1}}
	}
	return sort, nil
}

type BaseResponse interface {
	GetData() interface{}
	GetDataString() string
	ToJSON() string
}

type Response[T any] struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Data    T      `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func (r Response[T]) GetData() any {
	return r.Data
}

func (r Response[T]) GetDataString() string {
	data, err := json.Marshal(r.Data)
	if err != nil {
		return ""
	}
	return string(data)
}

func (r Response[T]) ToJSON() string {
	data, err := json.Marshal(r)
	if err != nil {
		return ""
	}
	return string(data)
}

type ListResponse[T any] struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Total   int    `json:"total"`
	Data    []T    `json:"data"`
	Error   string `json:"error,omitempty"`
}

func (r ListResponse[T]) GetData() any {
	return r.Data
}

func (r ListResponse[T]) GetDataString() string {
	if r.Data == nil {
		return ""
	}
	data, err := json.Marshal(r.Data)
	if err != nil {
		return ""
	}
	return string(data)
}

func (r ListResponse[T]) ToJSON() string {
	data, err := json.Marshal(r)
	if err != nil {
		return ""
	}
	return string(data)
}

type VoidResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

func (r VoidResponse) GetData() any {
	return nil
}

func (r VoidResponse) GetDataString() string {
	return ""
}

func GetDataResponse[T any](model T) (res *Response[T], err error) {
	return &Response[T]{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
		Data:    model,
	}, nil
}

func GetListResponse[T any](models []T, total int) (res *ListResponse[T], err error) {
	return &ListResponse[T]{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
		Data:    models,
		Total:   total,
	}, nil
}

func GetVoidResponse() (res *VoidResponse, err error) {
	return &VoidResponse{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
	}, nil
}

func GetErrorResponse[T any](err error) (res *Response[T], err2 error) {
	return &Response[T]{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageError,
		Error:   err.Error(),
	}, err
}

func GetErrorVoidResponse(err error) (res *VoidResponse, err2 error) {
	return &VoidResponse{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageError,
		Error:   err.Error(),
	}, err
}

func GetErrorListResponse[T any](err error) (res *ListResponse[T], err2 error) {
	return &ListResponse[T]{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageError,
		Error:   err.Error(),
	}, err
}

func handleError(statusCode int, c *gin.Context, err error) {
	if utils.IsDev() {
		trace.PrintError(err)
	}
	c.AbortWithStatusJSON(statusCode, entity.Response{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageError,
		Error:   err.Error(),
	})
}

func HandleError(statusCode int, c *gin.Context, err error) {
	handleError(statusCode, c, err)
}

func HandleErrorBadRequest(c *gin.Context, err error) {
	HandleError(http.StatusBadRequest, c, err)
}

func HandleErrorForbidden(c *gin.Context, err error) {
	HandleError(http.StatusForbidden, c, err)
}

func HandleErrorUnauthorized(c *gin.Context, err error) {
	HandleError(http.StatusUnauthorized, c, err)
}

func HandleErrorNotFound(c *gin.Context, err error) {
	HandleError(http.StatusNotFound, c, err)
}

func HandleErrorInternalServerError(c *gin.Context, err error) {
	HandleError(http.StatusInternalServerError, c, err)
}

func HandleSuccess(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusOK, entity.Response{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
	})
}

func HandleSuccessWithData(c *gin.Context, data interface{}) {
	c.AbortWithStatusJSON(http.StatusOK, entity.Response{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
		Data:    data,
	})
}

func HandleSuccessWithListData(c *gin.Context, data interface{}, total int) {
	c.AbortWithStatusJSON(http.StatusOK, entity.ListResponse{
		Status:  constants.HttpResponseStatusOk,
		Message: constants.HttpResponseMessageSuccess,
		Data:    data,
		Total:   total,
	})
}
