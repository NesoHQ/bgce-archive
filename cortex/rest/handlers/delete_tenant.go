package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

// DeleteTenant godoc
// @Summary Delete tenant
// @Description Delete a tenant (admin only)
// @Tags tenants
// @Accept json
// @Produce json
// @Param id path string true "Tenant UUID"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tenants/{id} [delete]
// @Security BearerAuth
func (h *Handlers) DeleteTenant(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	tenantUUID, err := uuid.Parse(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Invalid tenant ID",
			"message": err.Error(),
		})
		return
	}

	err = h.TenantService.DeleteTenant(r.Context(), tenantUUID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Failed to delete tenant",
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Message: "Tenant deleted successfully",
		Status:  true,
		Data:    nil,
	})
}
