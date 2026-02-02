package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"cortex/rest/middlewares"
	"cortex/rest/utils"
	"cortex/user"
)

func (h *Handlers) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := middlewares.GetUserId(r)
	if userID == 0 {
		utils.SendError(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req user.ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Validation failed", utils.ParseValidationErrors(err))
		return
	}

	err := h.userService.ChangePassword(r.Context(), userID, req)
	if err != nil {
		if err == user.ErrInvalidPassword {
			utils.SendError(w, http.StatusBadRequest, "Invalid old password", nil)
			return
		}
		slog.Error("Failed to change password", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "Failed to change password", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    nil,
		Message: "Password changed successfully",
		Status:  true,
	})
}
