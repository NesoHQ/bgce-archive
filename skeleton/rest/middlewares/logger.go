package middlewares

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/google/uuid"

	"servicetemplate/logger"
	"servicetemplate/util"
)

type recorder struct {
	http.ResponseWriter
	statusCode int
	length     int
}

func (r *recorder) Write(data []byte) (int, error) {
	sz, err := r.ResponseWriter.Write(data)
	r.length += sz
	return sz, err
}

func (r *recorder) WriteHeader(statusCode int) {
	r.statusCode = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

func (r *recorder) Flush() {
	if flusher, ok := r.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

func Logger(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		rec := &recorder{
			ResponseWriter: w,
		}
		start := time.Now()

		r = NewRequestWithTraceCtx(r)

		handler.ServeHTTP(rec, r)

		// ignore healthcheck route
		if path == "/api/v1/hello" {
			return
		}

		slog.InfoContext(
			r.Context(),
			"",
			logger.Path(path),
			logger.Query(r.URL.Query()),
			logger.Method(r.Method),
			logger.Status(rec.statusCode),
			logger.UserAgent(r.UserAgent()),
			logger.Ip(r.RemoteAddr),
			logger.Latency(time.Since(start)),
			logger.Length(rec.length),
		)
	})
}

func NewRequestWithTraceCtx(r *http.Request) *http.Request {
	traceID := r.Header.Get(util.X_TRACE_ID_KEY)

	if traceID == "" {
		newtraceID, err := uuid.NewRandom()
		if err != nil {
			slog.ErrorContext(r.Context(), "Failed to generate uuid")
			return r
		}
		traceID = newtraceID.String()
	}

	spanID, err := uuid.NewRandom()
	if err != nil {
		slog.ErrorContext(r.Context(), "Failed to generate uuid")
		return r
	}

	ctx := r.Context()
	ctx = context.WithValue(ctx, logger.TraceIDKey, traceID)
	ctx = context.WithValue(ctx, logger.SpanIDKey, spanID.String())
	ctx = context.WithValue(ctx, logger.PathKey, r.URL.Path)

	return r.WithContext(ctx)
}
