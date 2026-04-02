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

func (h *Handlers) GetInProgressCards(w http.ResponseWriter, r *http.Request) {
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

	cards, meta, err := h.roadmapService.GetInProgressCards(r.Context(), page, limit)
	if err != nil {
		fmt.Printf("GetInProgressCards error: %v\n", err)
		utils.RespondError(w, "failed to get in progress cards", http.StatusInternalServerError)
		return
	}

	response := roadmap.GetInProgressCardsResponse{
		Success:    true,
		Message:    "retrieved successfully",
		Data:       cards,
		Pagination: meta,
	}

	utils.RespondJSON(w, http.StatusOK, response)
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

	response := roadmap.MoveCardResponse{Success: true, Message: "card moved to in progress"}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) UpdateInProgressCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

	var req roadmap.UpdateInProgressCardRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateUpdateInProgressCard(req.Title, req.Items, req.CompletionPercentage); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.UpdateInProgressCard(r.Context(), cardID, req, int64(userID)); err != nil {
		fmt.Printf("UpdateInProgressCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to update in-progress card", http.StatusInternalServerError)
		return
	}

	response := roadmap.UpdateCardResponse{Success: true, Message: "in-progress card updated"}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) DeleteInProgressCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

	if err := h.roadmapService.DeleteInProgressCard(r.Context(), cardID); err != nil {
		fmt.Printf("DeleteInProgressCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to delete in-progress card", http.StatusInternalServerError)
		return
	}

	response := roadmap.DeleteCardResponse{Success: true, Message: "in-progress card deleted"}

	utils.RespondJSON(w, http.StatusOK, response)
}
