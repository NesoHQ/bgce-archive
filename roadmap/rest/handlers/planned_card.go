package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"roadmap/domain"
	"roadmap/rest/middlewares"
	"roadmap/rest/utils"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (h *Handlers) AddPlannedCard(w http.ResponseWriter, r *http.Request) {
	var req roadmap.AddPlannedCardRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateAddPlannedCard(req.Title, req.Items, req.PlannedAt); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)
	now := time.Now()

	card := domain.PlannedCard{
		ID:        primitive.NewObjectID().Hex(),
		Title:     req.Title,
		Items:     req.Items,
		PlannedAt: req.PlannedAt,
		CreatedBy: int64(userID),
		CreatedAt: now,
		UpdatedBy: int64(userID),
		UpdatedAt: now,
	}

	if err := h.roadmap.AddPlannedCard(r.Context(), card); err != nil {
		fmt.Printf("AddPlannedCard error: %v\n", err)
		utils.RespondError(w, "failed to add planned card", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusCreated, map[string]any{"status": true, "message": "planned card added"})
}
