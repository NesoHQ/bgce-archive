package utils

import "net/http"

func SendError(w http.ResponseWriter, status int, message string, data interface{}) {
	SendJson(w, status, map[string]any{
		"status":  false,
		"message": message,
		"data":    data,
	})
}
