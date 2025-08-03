package middlewares

import (
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

	"cortex/logger"
)

func Recover(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				slog.ErrorContext(r.Context(),
					fmt.Sprintf("Recovered from panic. err: %v", err),
					logger.Extra(map[string]any{
						"stack": string(debug.Stack()),
					}),
				)
				http.Error(w, "500 - Internal Server Error", http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
