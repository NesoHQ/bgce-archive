package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

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

func (h *Handlers) GetPlannedCards(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil {
		page = p
	}

	limit := 10
	if l, err := strconv.Atoi(limitStr); err == nil {
		limit = l
	}

	cards, meta, err := h.roadmapService.GetPlannedCards(r.Context(), page, limit)
	if err != nil {
		fmt.Printf("GetPlannedCards error: %v\n", err)
		utils.RespondError(w, "failed to get planned cards", http.StatusInternalServerError)
		return
	}

	response := roadmap.GetPlannedCardsResponse{
		Success:    true,
		Message:    "retrieved successfully",
		Data:       cards,
		Pagination: meta,
	}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) MoveCardToPlanned(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")

	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}
	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.MoveCardToPlanned(r.Context(), cardID, int64(userID)); err != nil {
		fmt.Printf("MoveCardToPlanned error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to move card to planned", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]any{"status": true, "message": "card moved to planned"})
}

func (h *Handlers) UpdatePlannedCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

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

	if err := h.roadmapService.UpdatePlannedCard(r.Context(), cardID, req, int64(userID)); err != nil {
		fmt.Printf("UpdatePlannedCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to update planned card", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]any{"status": true, "message": "planned card updated"})
}

func (h *Handlers) DeletePlannedCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

	if err := h.roadmapService.DeletePlannedCard(r.Context(), cardID); err != nil {
		fmt.Printf("DeletePlannedCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to delete planned card", http.StatusInternalServerError)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]any{"status": true, "message": "planned card deleted"})
}
