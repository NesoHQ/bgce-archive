package utils

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"servicetemplate/logger"
)

func SendJson(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Add("Content-Type", "application/json")

	str, err := json.Marshal(data)
	if err != nil {
		slog.Error(err.Error(), logger.Extra(map[string]any{
			"data": data,
		}))

		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"message": "Internal server error"}`))
		return
	}

	w.WriteHeader(status)
	w.Write(str)
}
