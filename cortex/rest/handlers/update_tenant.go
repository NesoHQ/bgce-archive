package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/tenant"

	"github.com/google/uuid"
)

type UpdateTenantRequest struct {
	Name     *string                `json:"name"`
	Slug     *string                `json:"slug"`
	Domain   *string                `json:"domain"`
	Status   *string                `json:"status"`
	Plan     *string                `json:"plan"`
	Settings map[string]interface{} `json:"settings"`
}

// UpdateTenant godoc
// @Summary Update tenant
// @Description Update tenant information (admin only)
// @Tags tenants
// @Accept json
// @Produce json
// @Param id path string true "Tenant UUID"
// @Param tenant body UpdateTenantRequest true "Tenant data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tenants/{id} [put]
// @Security BearerAuth
func (h *Handlers) UpdateTenant(w http.ResponseWriter, r *http.Request) {
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

	var req UpdateTenantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Invalid request body",
			"message": err.Error(),
		})
		return
	}

	params := tenant.UpdateTenantParams{
		UUID:     tenantUUID,
		Name:     req.Name,
		Slug:     req.Slug,
		Domain:   req.Domain,
		Status:   req.Status,
		Plan:     req.Plan,
		Settings: req.Settings,
	}

	updatedTenant, err := h.TenantService.UpdateTenant(r.Context(), params)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Failed to update tenant",
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SuccessResponse{
		Message: "Tenant updated successfully",
		Status:  true,
		Data:    updatedTenant,
	})
}
