package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

// Config holds the application configuration
type Config struct {
	Path          string `mapstructure:"path"`
	DefaultBranch string `mapstructure:"default_branch"`
	AutoCommit    bool   `mapstructure:"auto_commit"`
	Verbose       bool   `mapstructure:"verbose"`
}

var (
	// GlobalConfig is the global configuration instance
	GlobalConfig *Config
	cfgFile      string
)

// SetConfigFile sets the config file path
func SetConfigFile(file string) {
	cfgFile = file
}

// Init initializes the configuration
func Init(appName string) error {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		home, err := os.UserHomeDir()
		if err != nil {
			return fmt.Errorf("failed to get home directory: %w", err)
		}
		viper.AddConfigPath(home)
		viper.SetConfigName(fmt.Sprintf(".%s", appName))
		viper.SetConfigType("yaml")
	}

	// Set defaults
	viper.SetDefault("path", ".")
	viper.SetDefault("default_branch", "main")
	viper.SetDefault("auto_commit", true)
	viper.SetDefault("verbose", false)

	// Read environment variables
	viper.SetEnvPrefix(appName)
	viper.AutomaticEnv()

	// Read config file (optional)
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return fmt.Errorf("failed to read config file: %w", err)
		}
	}

	// Unmarshal config
	GlobalConfig = &Config{}
	if err := viper.Unmarshal(GlobalConfig); err != nil {
		return fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return nil
}

// GetConfig returns the global configuration
func GetConfig() *Config {
	if GlobalConfig == nil {
		GlobalConfig = &Config{
			Path:          ".",
			DefaultBranch: "main",
			AutoCommit:    true,
			Verbose:       false,
		}
	}
	return GlobalConfig
}

// GetString gets a string value from viper
func GetString(key string) string {
	return viper.GetString(key)
}

// GetBool gets a boolean value from viper
func GetBool(key string) bool {
	return viper.GetBool(key)
}

// BindPFlag binds a flag to a config key
func BindPFlag(key string, flag *pflag.Flag) error {
	return viper.BindPFlag(key, flag)
}

// GetConfigFileUsed returns the config file being used
func GetConfigFileUsed() string {
	return viper.ConfigFileUsed()
}

// ResolvePath resolves a path relative to the current working directory
func ResolvePath(path string) (string, error) {
	if path == "" {
		return os.Getwd()
	}
	if filepath.IsAbs(path) {
		return path, nil
	}
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	return filepath.Join(cwd, path), nil
}
