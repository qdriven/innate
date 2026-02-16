package logger

import (
	"log/slog"
	"os"
)

// Logger is the global logger instance
var defaultLogger *slog.Logger

// Init initializes the default logger
func Init() {
	defaultLogger = slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
}

// Get returns the default logger instance
func Get() *slog.Logger {
	if defaultLogger == nil {
		Init()
	}
	return defaultLogger
}

// SetLevel sets the logging level
func SetLevel(level slog.Level) {
	defaultLogger = slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: level,
	}))
}

// Debug logs a debug message
func Debug(msg string, args ...any) {
	Get().Debug(msg, args...)
}

// Info logs an info message
func Info(msg string, args ...any) {
	Get().Info(msg, args...)
}

// Warn logs a warning message
func Warn(msg string, args ...any) {
	Get().Warn(msg, args...)
}

// Error logs an error message
func Error(msg string, args ...any) {
	Get().Error(msg, args...)
}
