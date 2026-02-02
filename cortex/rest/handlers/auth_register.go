package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"cortex/rest/utils"
	"cortex/user"
)

func (h *Handlers) Register(w http.ResponseWriter, r *http.Request) {
	var req user.RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Validation failed", utils.ParseValidationErrors(err))
		return
	}

	userResp, err := h.userService.Register(r.Context(), req)
	if err != nil {
		if err == user.ErrUserAlreadyExists {
			utils.SendError(w, http.StatusConflict, "User already exists", nil)
			return
		}
		slog.Error("Failed to register user", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "Failed to register user", nil)
		return
	}

	utils.SendJson(w, http.StatusCreated, SuccessResponse{
		Data:    userResp,
		Message: "User registered successfully",
		Status:  true,
	})
}
