package utils

import (
	"encoding/json"
	"errors"
	"net/http"
)

func ValidateAddPlannedCard(title string, items []string) error {
	if title == "" {
		return errors.New("title is required")
	}
	if len(items) == 0 {
		return errors.New("items must not be empty")
	}
	return nil
}

func RespondJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func RespondError(w http.ResponseWriter, message string, status int) {
	RespondJSON(w, status, map[string]any{"status": false, "message": message})
}
