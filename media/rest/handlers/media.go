package handlers

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"media/media"
	"media/rest/utils"
	"net/http"
	"strconv"
	"strings"
)

// UploadHandler handles file upload requests
func (h *Handlers) UploadHandler(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (max 50MB)
	err := r.ParseMultipartForm(50 << 20)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Failed to parse form data", err)
		return
	}

	// Get file from form
	file, header, err := r.FormFile("file")
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "File is required", err)
		return
	}
	defer file.Close()

	// Parse optional fields
	var req media.UploadRequest
	if tenantIDStr := r.FormValue("tenant_id"); tenantIDStr != "" {
		tenantID, err := strconv.Atoi(tenantIDStr)
		if err == nil {
			req.TenantID = &tenantID
		}
	}
	if userIDStr := r.FormValue("user_id"); userIDStr != "" {
		userID, err := strconv.Atoi(userIDStr)
		if err == nil {
			req.UserID = &userID
		}
	}

	// Upload file
	response, err := h.mediaSvc.Upload(
		r.Context(),
		header.Filename,
		header.Header.Get("Content-Type"),
		header.Size,
		file,
		req,
	)
	if err != nil {
		slog.Error("Failed to upload file", "error", err)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to upload file", err)
		return
	}

	utils.RespondJSON(w, http.StatusCreated, map[string]interface{}{
		"status":  true,
		"message": "File uploaded successfully",
		"data":    response,
	})
}

// ListMediaHandler handles listing media files
func (h *Handlers) ListMediaHandler(w http.ResponseWriter, r *http.Request) {
	var req media.ListMediaRequest

	// Parse query parameters
	query := r.URL.Query()

	if tenantIDStr := query.Get("tenant_id"); tenantIDStr != "" {
		tenantID, err := strconv.Atoi(tenantIDStr)
		if err == nil {
			req.TenantID = &tenantID
		}
	}

	if userIDStr := query.Get("user_id"); userIDStr != "" {
		userID, err := strconv.Atoi(userIDStr)
		if err == nil {
			req.UserID = &userID
		}
	}

	req.MimeType = query.Get("mime_type")

	if pageStr := query.Get("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err == nil {
			req.Page = page
		}
	}

	if limitStr := query.Get("limit"); limitStr != "" {
		limit, err := strconv.Atoi(limitStr)
		if err == nil {
			req.Limit = limit
		}
	}

	response, err := h.mediaSvc.List(r.Context(), req)
	if err != nil {
		slog.Error("Failed to list media files", "error", err)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to list media files", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status": true,
		"data":   response,
	})
}

// GetMediaByIDHandler handles getting a media file by ID
func (h *Handlers) GetMediaByIDHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid media ID", err)
		return
	}

	response, err := h.mediaSvc.GetByID(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows") {
			utils.RespondError(w, http.StatusNotFound, "Media file not found", err)
			return
		}
		slog.Error("Failed to get media file", "error", err, "id", id)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to get media file", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status": true,
		"data":   response,
	})
}

// GetMediaByUUIDHandler handles getting a media file by UUID
func (h *Handlers) GetMediaByUUIDHandler(w http.ResponseWriter, r *http.Request) {
	uuid := r.PathValue("uuid")
	if uuid == "" {
		utils.RespondError(w, http.StatusBadRequest, "UUID is required", nil)
		return
	}

	response, err := h.mediaSvc.GetByUUID(r.Context(), uuid)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows") {
			utils.RespondError(w, http.StatusNotFound, "Media file not found", err)
			return
		}
		slog.Error("Failed to get media file", "error", err, "uuid", uuid)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to get media file", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status": true,
		"data":   response,
	})
}

// DeleteMediaHandler handles deleting a media file
func (h *Handlers) DeleteMediaHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid media ID", err)
		return
	}

	err = h.mediaSvc.Delete(r.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			utils.RespondError(w, http.StatusNotFound, "Media file not found", err)
			return
		}
		slog.Error("Failed to delete media file", "error", err, "id", id)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to delete media file", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  true,
		"message": "Media file deleted successfully",
	})
}

// GetUserMediaHandler handles getting media files for a specific user
func (h *Handlers) GetUserMediaHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("user_id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	// Parse pagination parameters
	query := r.URL.Query()
	page := 1
	limit := 20

	if pageStr := query.Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	if limitStr := query.Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	response, err := h.mediaSvc.GetUserMedia(r.Context(), userID, page, limit)
	if err != nil {
		slog.Error("Failed to get user media", "error", err, "user_id", userID)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to get user media", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status": true,
		"data":   response,
	})
}

// OptimizeImageHandler handles image optimization requests
func (h *Handlers) OptimizeImageHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid media ID", err)
		return
	}

	var req media.OptimizeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	// Set defaults
	if req.Quality == 0 {
		req.Quality = 85
	}

	response, err := h.mediaSvc.OptimizeImage(r.Context(), id, req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			utils.RespondError(w, http.StatusNotFound, "Media file not found", err)
			return
		}
		if strings.Contains(err.Error(), "not an image") {
			utils.RespondError(w, http.StatusBadRequest, "File is not an image", err)
			return
		}
		slog.Error("Failed to optimize image", "error", err, "id", id)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to optimize image", err)
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  true,
		"message": fmt.Sprintf("Image optimized successfully (%.2f%% savings)", response.Savings),
		"data":    response,
	})
}

// HealthHandler handles health check requests
func (h *Handlers) HealthHandler(w http.ResponseWriter, r *http.Request) {
	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"service": "media",
		"version": h.cnf.Version,
	})
}
