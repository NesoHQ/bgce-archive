package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"roadmap/rest/middlewares"
	"roadmap/rest/utils"
	"roadmap/roadmap"
)

func (h *Handlers) AddPlannedCard(w http.ResponseWriter, r *http.Request) {
	var req roadmap.AddPlannedCardRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateAddPlannedCard(req.Title, req.Items); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.AddPlannedCard(r.Context(), req, int64(userID)); err != nil {
		fmt.Printf("AddPlannedCard error: %v\n", err)
		utils.RespondError(w, "failed to add planned card", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusCreated, map[string]any{"status": true, "message": "planned card added"})
}

func (h *Handlers) MoveCardToInProgress(w http.ResponseWriter, r *http.Request) {
	CardID := r.PathValue("id")

	if CardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}
	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.MoveCardToInProgress(r.Context(), CardID, int64(userID)); err != nil {
		fmt.Printf("MoveCardToInProgress error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "planned card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to move card to in progress", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]any{"status": true, "message": "card moved to in progress"})
}
