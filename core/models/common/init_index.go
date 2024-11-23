package common

import (
	"github.com/crawlab-team/crawlab/core/models/models"
	"github.com/crawlab-team/crawlab/core/models/service"
	"github.com/crawlab-team/crawlab/db/mongo"
	"go.mongodb.org/mongo-driver/bson"
	mongo2 "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitIndexes() {
	// nodes
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Node{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "key", Value: 1}}},
		{Keys: bson.D{{Key: "name", Value: 1}}},
		{Keys: bson.D{{Key: "is_master", Value: 1}}},
		{Keys: bson.D{{Key: "status", Value: 1}}},
		{Keys: bson.D{{Key: "enabled", Value: 1}}},
		{Keys: bson.D{{Key: "active", Value: 1}}},
	})

	// projects
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Project{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "name", Value: 1}}},
	})

	// spiders
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Spider{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "name", Value: 1}}},
		{Keys: bson.D{{Key: "type", Value: 1}}},
		{Keys: bson.D{{Key: "col_id", Value: 1}}},
		{Keys: bson.D{{Key: "project_id", Value: 1}}},
	})

	// tasks
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Task{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "spider_id", Value: 1}}},
		{Keys: bson.D{{Key: "status", Value: 1}}},
		{Keys: bson.D{{Key: "node_id", Value: 1}}},
		{Keys: bson.D{{Key: "schedule_id", Value: 1}}},
		{Keys: bson.D{{Key: "type", Value: 1}}},
		{Keys: bson.D{{Key: "mode", Value: 1}}},
		{Keys: bson.D{{Key: "priority", Value: 1}}},
		{Keys: bson.D{{Key: "parent_id", Value: 1}}},
		{Keys: bson.D{{Key: "has_sub", Value: 1}}},
		{Keys: bson.D{{Key: "created_ts", Value: -1}}, Options: (&options.IndexOptions{}).SetExpireAfterSeconds(60 * 60 * 24 * 30)},
		{Keys: bson.D{{Key: "node_id", Value: 1}, {Key: "status", Value: 1}}},
	})

	// task stats
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.TaskStat{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "created_ts", Value: -1}}, Options: (&options.IndexOptions{}).SetExpireAfterSeconds(60 * 60 * 24 * 30)},
	})

	// schedules
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Schedule{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "name", Value: 1}}},
		{Keys: bson.D{{Key: "spider_id", Value: 1}}},
		{Keys: bson.D{{Key: "enabled", Value: 1}}},
	})

	// users
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.User{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "username", Value: 1}}, Options: (&options.IndexOptions{}).SetUnique(true)},
		{Keys: bson.D{{Key: "role", Value: 1}}},
		{Keys: bson.D{{Key: "role_id", Value: 1}}},
		{Keys: bson.D{{Key: "email", Value: 1}}},
	})

	// settings
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Setting{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "key", Value: 1}}, Options: options.Index().SetUnique(true)},
	})

	// tokens
	RecreateIndexes(mongo.GetMongoCol(service.GetCollectionNameByInstance(models.Token{})), []mongo2.IndexModel{
		{Keys: bson.D{{Key: "name", Value: 1}}},
	})
}
