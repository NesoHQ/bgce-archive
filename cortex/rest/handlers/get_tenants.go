package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/tenant"
)

// GetTenants godoc
// @Summary Get all tenants
// @Description Get list of all tenants (admin only)
// @Tags tenants
// @Accept json
// @Produce json
// @Success 200 {object} SuccessResponse
// @Failure 500 {object} map[string]string
// @Router /tenants [get]
// @Security BearerAuth
func (h *Handlers) GetTenants(w http.ResponseWriter, r *http.Request) {
	filter := tenant.GetTenantFilter{}

	tenants, err := h.TenantService.GetTenants(r.Context(), filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Failed to retrieve tenants",
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Message: "Tenants retrieved successfully",
		Status:  true,
		Data:    tenants,
	})
}
