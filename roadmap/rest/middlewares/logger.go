package middlewares

import (
	"fmt"
	"net/http"
	"time"
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

		// Skip logging for health check endpoints
		if path == "/api/v1/health" || path == "/health" {
			handler.ServeHTTP(w, r)
			return
		}

		rec := &recorder{
			ResponseWriter: w,
			statusCode:     200, // Default status code
		}
		start := time.Now()

		// Simple console log
		fmt.Printf("[%s] %s %s\n", time.Now().Format("15:04:05"), r.Method, path)

		handler.ServeHTTP(rec, r)

		// Log completion
		fmt.Printf("[%s] %s %s - %d (%v)\n",
			time.Now().Format("15:04:05"),
			r.Method,
			path,
			rec.statusCode,
			time.Since(start),
		)
	})
}
