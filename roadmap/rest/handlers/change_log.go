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

func (h *Handlers) CreateChangeLog(w http.ResponseWriter, r *http.Request) {
	var req roadmap.CreateChangeLogRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateCreateChangeLog(req.Title, req.Items, req.Month, req.Year); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.CreateChangeLog(r.Context(), req, int64(userID)); err != nil {
		fmt.Printf("CreateChangeLog error: %v\n", err)
		utils.RespondError(w, "failed to create changelog", http.StatusInternalServerError)
		return
	}

	response := roadmap.AddCardResponse{Success: true, Message: "changelog created"}

	utils.RespondJSON(w, http.StatusCreated, response)
}

func (h *Handlers) UpdateChangeLog(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "id is required", http.StatusUnprocessableEntity)
		return
	}

	var req roadmap.CreateChangeLogRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("Decode error: %v\n", err)
		utils.RespondError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := utils.ValidateCreateChangeLog(req.Title, req.Items, req.Month, req.Year); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		utils.RespondError(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	userID := middlewares.GetUserID(r)

	if err := h.roadmapService.UpdateChangeLog(r.Context(), cardID, req, int64(userID)); err != nil {
		fmt.Printf("UpdateChangeLog error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "changelog not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to update changelog", http.StatusInternalServerError)
		return
	}

	response := roadmap.AddCardResponse{Success: true, Message: "changelog card updated"}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) GetChangeLogs(w http.ResponseWriter, r *http.Request) {
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

	cards, meta, err := h.roadmapService.GetChangeLogs(r.Context(), page, limit)
	if err != nil {
		fmt.Printf("GetChangeLogs error: %v\n", err)
		utils.RespondError(w, "failed to get changelogs", http.StatusInternalServerError)
		return
	}

	response := roadmap.GetChangeLogsResponse{
		Success:    true,
		Message:    "retrieved successfully",
		Data:       cards,
		Pagination: meta,
	}

	utils.RespondJSON(w, http.StatusOK, response)
}

func (h *Handlers) DeleteChangeLog(w http.ResponseWriter, r *http.Request) {
	cardID := r.PathValue("id")
	if cardID == "" {
		utils.RespondError(w, "id is required", http.StatusUnprocessableEntity)
		return
	}

	if err := h.roadmapService.DeleteChangeLog(r.Context(), cardID); err != nil {
		fmt.Printf("DeleteChangeLog error: %v\n", err)
		if errors.Is(err, roadmap.ErrCardNotFound) {
			utils.RespondError(w, "changelog not found", http.StatusNotFound)
			return
		}
		utils.RespondError(w, "failed to delete changelog", http.StatusInternalServerError)
		return
	}

	response := roadmap.AddCardResponse{Success: true, Message: "changelog card deleted"}

	utils.RespondJSON(w, http.StatusOK, response)
}
