package handlers

import (
	"fmt"
	"net/http"
	"strconv"

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
