package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"cortex/rest/utils"
	"cortex/user"
)

func (h *Handlers) Login(w http.ResponseWriter, r *http.Request) {
	var req user.LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if err := utils.Validate(req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Validation failed", utils.ParseValidationErrors(err))
		return
	}

	loginResp, err := h.userService.Login(r.Context(), req)
	if err != nil {
		if err == user.ErrInvalidCredentials {
			utils.SendError(w, http.StatusUnauthorized, "Invalid credentials", nil)
			return
		}
		slog.Error("Failed to login", slog.Any("error", err))
		utils.SendError(w, http.StatusInternalServerError, "Failed to login", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    loginResp,
		Message: "Login successful",
		Status:  true,
	})
}
