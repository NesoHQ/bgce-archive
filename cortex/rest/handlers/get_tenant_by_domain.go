package handlers

import (
	"encoding/json"
	"net/http"
)

// GetTenantByDomain godoc
// @Summary Get tenant by domain/slug
// @Description Get tenant information by domain or slug identifier
// @Tags tenants
// @Accept json
// @Produce json
// @Param identifier path string true "Domain or slug identifier"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tenants/by-domain/{identifier} [get]
func (h *Handlers) GetTenantByDomain(w http.ResponseWriter, r *http.Request) {
	// Extract identifier from path: /api/v1/tenants/by-domain/{identifier}
	identifier := r.PathValue("identifier")

	tenant, err := h.TenantService.GetTenantByDomain(r.Context(), identifier)
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
