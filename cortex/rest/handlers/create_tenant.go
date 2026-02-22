package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/tenant"
)

type CreateTenantRequest struct {
	Name   string  `json:"name" binding:"required"`
	Slug   string  `json:"slug" binding:"required"`
	Domain *string `json:"domain"`
	Plan   string  `json:"plan"`
}

// CreateTenant godoc
// @Summary Create a new tenant
// @Description Create a new tenant organization (admin only)
// @Tags tenants
// @Accept json
// @Produce json
// @Param tenant body CreateTenantRequest true "Tenant data"
// @Success 201 {object} SuccessResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tenants [post]
// @Security BearerAuth
func (h *Handlers) CreateTenant(w http.ResponseWriter, r *http.Request) {
	var req CreateTenantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Invalid request body",
			"message": err.Error(),
		})
		return
	}

	// Set default plan if not provided
	if req.Plan == "" {
		req.Plan = "free"
	}

	params := tenant.CreateTenantParams{
		Name:   req.Name,
		Slug:   req.Slug,
		Domain: req.Domain,
		Plan:   req.Plan,
	}

	newTenant, err := h.TenantService.CreateTenant(r.Context(), params)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "Failed to create tenant",
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(SuccessResponse{
		Message: "Tenant created successfully",
		Status:  true,
		Data:    newTenant,
	})
}
