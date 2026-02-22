package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

// GetTenantByUUID godoc
// @Summary Get tenant by UUID
// @Description Get a single tenant by UUID
// @Tags tenants
// @Accept json
// @Produce json
// @Param id path string true "Tenant UUID"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tenants/{id} [get]
func (h *Handlers) GetTenantByUUID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	tenantUUID, err := uuid.Parse(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Invalid tenant UUID",
			"message": err.Error(),
		})
		return
	}

	tenant, err := h.TenantService.GetTenantByUUID(r.Context(), tenantUUID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Tenant not found",
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Message: "Tenant retrieved successfully",
		Status:  true,
		Data:    tenant,
	})
}
