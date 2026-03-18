package utils

import (
	"encoding/json"
	"errors"
	"net/http"

	"roadmap/domain"
)

func ValidateAddPlannedCard(title string, items []string, period domain.Period) error {
	if title == "" {
		return errors.New("title is required")
	}
	if len(items) == 0 {
		return errors.New("items must not be empty")
	}
	if period.Year == 0 {
		return errors.New("completedAt year is required")
	}
	switch period.Quartile {
	case domain.Q1, domain.Q2, domain.Q3, domain.Q4:
	default:
		return errors.New("completedAt quartile must be Q1, Q2, Q3, or Q4")
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
