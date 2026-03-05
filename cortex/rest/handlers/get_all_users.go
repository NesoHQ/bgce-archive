package handlers

import (
	"net/http"

	entuser "cortex/ent/user"
	"cortex/rest/middlewares"
	"cortex/rest/utils"
)

func (h *Handlers) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	if _, err := middlewares.CheckRole(
		[]entuser.Role{entuser.RoleAdmin},
		r,
	); err != nil {
		utils.SendError(w, http.StatusUnauthorized, "Unauthorized: "+err.Error(), nil)
		return
	}

	users, err := h.userService.ListUsers(ctx, nil, nil)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Unable to retrieve users at this time", nil)
		return
	}

	utils.SendJson(w, http.StatusOK, SuccessResponse{
		Data:    users,
		Message: "Users retrieved successfully",
		Status:  true,
	})
}
