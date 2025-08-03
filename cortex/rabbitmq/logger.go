package rabbitmq

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"runtime"
	"time"

	"github.com/wagslane/go-rabbitmq"
)

type Logger struct{}

func (l *Logger) log(level slog.Level, msg string, args ...any) {
	if !slog.Default().Handler().Enabled(context.Background(), level) {
		return
	}
	var pcs [1]uintptr
	runtime.Callers(3, pcs[:]) // Callers, log, Xf (i.e Debugf)
	r := slog.NewRecord(time.Now(), slog.LevelDebug, fmt.Sprintf(msg, args...), pcs[0])
	slog.Default().Handler().Handle(context.Background(), r)
}

// Debugf implements rabbitmq.Logger.
func (l *Logger) Debugf(msg string, args ...interface{}) {
	l.log(slog.LevelDebug, msg, args...)
}

// Errorf implements rabbitmq.Logger.
func (l *Logger) Errorf(msg string, args ...interface{}) {
	l.log(slog.LevelError, msg, args...)
}

// Fatalf implements rabbitmq.Logger.
func (l *Logger) Fatalf(msg string, args ...interface{}) {
	l.log(slog.LevelError, msg, args...)
	os.Exit(1)
}

// Infof implements rabbitmq.Logger.
func (l *Logger) Infof(msg string, args ...interface{}) {
	l.log(slog.LevelInfo, msg, args...)
}

// Warnf implements rabbitmq.Logger.
func (l *Logger) Warnf(msg string, args ...interface{}) {
	l.log(slog.LevelWarn, msg, args...)
}

var _ = (rabbitmq.Logger)(&Logger{})
