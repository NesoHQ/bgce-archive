package handlers

import (
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

	response := roadmap.MoveCardToCompletedResponse{
		Success: true,
		Message: "card moved to completed successfully",
	}

	utils.RespondJSON(w, http.StatusOK, response)
}
