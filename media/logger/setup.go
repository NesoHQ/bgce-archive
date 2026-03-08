package logger

import (
	"fmt"
	"log/slog"
	"os"
	"path"
)

func replacer(groups []string, a slog.Attr) slog.Attr {
	switch a.Key {
	case slog.TimeKey:
		return slog.Time(string(TimeKey), a.Value.Resolve().Time())

	case slog.MessageKey:
		return slog.String(string(MessageKey), a.Value.String())

	case slog.SourceKey:
		src := a.Value.Any().(*slog.Source)
		if src.Function == "" {
			return slog.Attr{}
		}
		base := path.Base(src.File)
		return slog.String(
			string(CallerKey),
			fmt.Sprintf("%s:%s:%d", base, src.Function, src.Line),
		)

	case slog.LevelKey:
		l := a.Value.Any().(slog.Level)
		return slog.String(string(LevelKey), levels[l])

	default:
		return a
	}
}

func SetupLogger(serviceName string) {
	baseHandler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		AddSource:   true,
		Level:       slog.LevelDebug,
		ReplaceAttr: replacer,
	})

	// Wrap the base handler with our custom TraceHandler
	traceHandler := NewTraceHandler(baseHandler)

	// Set the logger as default
	logger := slog.New(traceHandler).With(string(ServiceKey), serviceName)
	slog.SetDefault(logger)
}
