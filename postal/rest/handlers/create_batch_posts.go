package handlers

import (
	"net/http"

	"postal/config"
	"postal/rest/middlewares"
	"postal/rest/utils"
)



func (h *Handlers) BatchUploadPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Get user ID from middleware
	userID := middlewares.GetUserID(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	maxCSVUploadSize := config.GetConfig().MaxCSVUploadSizeMB << 20
	r.Body = http.MaxBytesReader(w, r.Body, maxCSVUploadSize)

	err := r.ParseMultipartForm(maxCSVUploadSize)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid multipart form", nil)
		return
	}

	file, fileheader, err := r.FormFile("file")
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Failed to read file", nil)
		return
	}

	defer file.Close()

	if fileheader.Header.Get("content-type") != "text/csv" {
		utils.SendError(w, http.StatusBadRequest, "Invalid file type. Only CSV files are allowed.", nil)
		return
	}

	err = h.PostService.BatchUploadPosts(ctx, userID, &file)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, err.Error(), nil)
		return
	}

	response := map[string]any{
		"success": true,
		"message": "Posts uploaded successfully",
	}

	utils.SendJson(w, http.StatusOK, response)
}
