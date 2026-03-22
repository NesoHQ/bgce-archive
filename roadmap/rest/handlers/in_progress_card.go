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
