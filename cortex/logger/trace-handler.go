package logger

import (
	"context"
	"log/slog"
)

// TraceHandler wraps slog.Handler to automatically extract trace_id and span_id from context
type TraceHandler struct {
	handler slog.Handler
}

// NewTraceHandler creates a new handler that injects trace_id and span_id from context
func NewTraceHandler(handler slog.Handler) *TraceHandler {
	return &TraceHandler{handler: handler}
}

// Handle processes the log record and injects trace_id and span_id
func (t *TraceHandler) Handle(ctx context.Context, record slog.Record) error {
	// Extract trace ID and span ID from the context
	traceID, _ := ctx.Value(TraceIDKey).(string)
	spanID, _ := ctx.Value(SpanIDKey).(string)
	path, _ := ctx.Value(PathKey).(string)

	// Append trace_id and span_id to the log record
	if traceID != "" {
		record.AddAttrs(TraceID(traceID))
	}
	if spanID != "" {
		record.AddAttrs(SpanID(spanID))
	}
	if path != "" {
		record.AddAttrs(Path(path))
	}

	return t.handler.Handle(ctx, record)
}

// Enabled just delegates to the wrapped handler
func (t *TraceHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return t.handler.Enabled(ctx, level)
}

// WithAttrs just delegates to the wrapped handler
func (t *TraceHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return NewTraceHandler(t.handler.WithAttrs(attrs))
}

// WithGroup just delegates to the wrapped handler
func (t *TraceHandler) WithGroup(name string) slog.Handler {
	return NewTraceHandler(t.handler.WithGroup(name))
}
