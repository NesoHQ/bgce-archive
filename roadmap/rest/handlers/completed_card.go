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

func (h *Handlers) GetCompletedCards(w http.ResponseWriter, r *http.Request) {
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

	cards, meta, err := h.roadmapService.GetCompletedCards(r.Context(), page, limit)
	if err != nil {
		fmt.Printf("GetCompletedCards error: %v\n", err)
		utils.RespondError(w, "failed to get completed cards", http.StatusInternalServerError)
		return
	}

	response := roadmap.GetCompletedCardsResponse{
		Success:    true,
		Message:    "retrieved successfully",
		Data:       cards,
		Pagination: meta,
	}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) MoveCardToCompleted(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusBadRequest)
		return
	}

	userID := middlewares.GetUserID(r)

	err := h.roadmapService.MoveCardToCompleted(r.Context(), cardID, int64(userID))
	if err != nil {
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		fmt.Printf("MoveCardToCompleted error: %v\n", err)
		utils.RespondError(w, "failed to move card to completed", http.StatusInternalServerError)
		return
	}

	response := roadmap.MoveCardResponse{
		Success: true,
		Message: "card moved to completed",
	}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) UpdateCompletedCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

	var req roadmap.UpdateCompletedCardRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateUpdateCompletedCard(req.Title, req.Items); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.UpdateCompletedCard(r.Context(), cardID, req, int64(userID)); err != nil {
		fmt.Printf("UpdateCompletedCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to update completed card", http.StatusInternalServerError)
		return
	}

	response := roadmap.UpdateCardResponse{Success: true, Message: "completed card updated"}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) DeleteCompletedCard(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "card_id is required", http.StatusUnprocessableEntity)
		return
	}

	if err := h.roadmapService.DeleteCompletedCard(r.Context(), cardID); err != nil {
		fmt.Printf("DeleteCompletedCard error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "card not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to delete completed card", http.StatusInternalServerError)
		return
	}

	response := roadmap.DeleteCardResponse{Success: true, Message: "completed card deleted"}

	utils.RespondJSON(w, http.StatusOK, response)
}
