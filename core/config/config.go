package config

import (
	"errors"
	"strings"
	"sync"

	"github.com/apex/log"
	"github.com/crawlab-team/crawlab/core/interfaces"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/fsnotify/fsnotify"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Name string
	interfaces.Logger
}

func (c *Config) Init() {
	// Load .env file before setting up viper
	c.loadDotEnv()

	// Set default values
	c.setDefaults()

	// config
	if c.Name != "" {
		viper.SetConfigFile(c.Name) // if config file is set, load it accordingly
	} else {
		viper.AddConfigPath("./conf") // if no config file is set, load by default
		viper.SetConfigName("config")
	}

	// config type as yaml
	viper.SetConfigType("yaml")

	// auto env
	viper.AutomaticEnv()

	// env prefix
	viper.SetEnvPrefix("CRAWLAB")

	// replacer
	replacer := strings.NewReplacer(".", "_")
	viper.SetEnvKeyReplacer(replacer)

	// read in config
	if err := viper.ReadInConfig(); err != nil {
		var configFileNotFoundError viper.ConfigFileNotFoundError
		if errors.As(err, &configFileNotFoundError) {
			if c.Logger != nil {
				c.Warn("No config file found. Using default values.")
			}
		}
	}

	// init log level
	c.initLogLevel()
}

func (c *Config) WatchConfig() {
	viper.WatchConfig()
	viper.OnConfigChange(func(e fsnotify.Event) {
		if c.Logger != nil {
			c.Infof("Config file changed: %s", e.Name)
		}
	})
}

func (c *Config) setDefaults() {
	viper.SetDefault("mongo.host", "localhost")
	viper.SetDefault("mongo.port", 27017)
	viper.SetDefault("mongo.db", "crawlab_test")
	viper.SetDefault("mongo.username", "")
	viper.SetDefault("mongo.password", "")
	viper.SetDefault("mongo.authSource", "admin")
}

func (c *Config) initLogLevel() {
	// set log level
	logLevel := viper.GetString("log.level")
	l, err := log.ParseLevel(logLevel)
	if err != nil {
		l = log.InfoLevel
	}
	log.SetLevel(l)
}

func (c *Config) loadDotEnv() {
	// Try to load .env file, but don't fail if it doesn't exist
	if err := godotenv.Load(); err != nil {
		if c.Logger != nil {
			c.Debug("No .env file found or unable to load .env file")
		}
	} else {
		if c.Logger != nil {
			c.Info("Loaded .env file successfully")
		}
	}
}

func newConfig() *Config {
	return &Config{
		Logger: utils.NewLogger("Config"),
	}
}

var _config *Config
var _configOnce sync.Once

func GetConfig() *Config {
	_configOnce.Do(func() {
		_config = newConfig()
		_config.Init()
	})
	return _config
}

func InitConfig() {
	// config instance
	c := GetConfig()

	// watch config change and load responsively
	c.WatchConfig()
}
