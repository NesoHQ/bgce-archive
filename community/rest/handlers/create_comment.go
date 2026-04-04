package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"community/comment"
	"community/rest/middlewares"
	"community/rest/utils"
)

func (h *Handlers) CreateComment(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userID := middlewares.GetUserID(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized request", nil)
		return
	}

	var req comment.CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid request body", nil)
		return
	}

	defer r.Body.Close()

	req.Content = strings.TrimSpace(req.Content)

	if errs := h.Validator.ValidateStruct(req); errs != nil {
		utils.SendJson(w, http.StatusBadRequest, map[string]any{
			"status":  false,
			"message": "validation failed",
			"errors":  errs.Errors,
		})
		return
	}

	cmd := comment.CreateCommentCommand{
		PostID:   req.PostID,
		UserID:   userID,
		ParentID: req.ParentID,
		Content:  req.Content,
	}

	result, err := h.CommentService.CreateComment(ctx, cmd)
	if err != nil {
		var invalidParent *comment.ErrInvalidParent
		if errors.As(err, &invalidParent) {
			utils.SendError(w, http.StatusUnprocessableEntity, invalidParent.Reason, nil)
			return
		}

		utils.SendError(w, http.StatusInternalServerError, "failed to create comment", nil)
		return
	}

	w.Header().Set("Location", "/api/v1/comments/"+result.UUID)
	utils.SendJson(w, http.StatusCreated, map[string]any{
		"status":  true,
		"message": "Comment created successfully",
		"data":    result,
	})
}
