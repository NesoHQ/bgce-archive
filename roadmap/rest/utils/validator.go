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

func ValidateUpdateInProgressCard(title string, items []string, percentage float64) error {
	if title == "" {
		return errors.New("title is required")
	}
	if len(items) == 0 {
		return errors.New("items must not be empty")
	}
	if percentage < 0 || percentage > 100 {
		return errors.New("completion percentage must be between 0 and 100")
	}
	return nil
}

func ValidateUpdateCompletedCard(title string, items []string) error {
	if title == "" {
		return errors.New("title is required")
	}
	if len(items) == 0 {
		return errors.New("items must not be empty")
	}
	return nil
}

func ValidateCreateChangeLog(title string, items []string, month string, year int64) error {
	if title == "" {
		return errors.New("title is required")
	}
	if len(items) == 0 {
		return errors.New("items must not be empty")
	}
	if month == "" {
		return errors.New("month is required")
	}
	if year == 0 {
		return errors.New("year is required")
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
