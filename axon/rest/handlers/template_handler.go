package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"axon/domain"
	"axon/template"

	"github.com/go-chi/chi/v5"
)

type TemplateHandler struct {
	repo template.Repository
}

func NewTemplateHandler(repo template.Repository) *TemplateHandler {
	return &TemplateHandler{repo: repo}
}

// ListTemplates handles GET /api/v1/notifications/templates
func (h *TemplateHandler) ListTemplates(w http.ResponseWriter, r *http.Request) {
	templates, err := h.repo.List(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": true,
		"data":   templates,
	})
}

// GetTemplate handles GET /api/v1/notifications/templates/{id}
func (h *TemplateHandler) GetTemplate(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "invalid template id",
		})
		return
	}

	tmpl, err := h.repo.GetByID(r.Context(), uint(id))
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "template not found",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": true,
		"data":   tmpl,
	})
}

// CreateTemplate handles POST /api/v1/notifications/templates
func (h *TemplateHandler) CreateTemplate(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name       string              `json:"name" validate:"required"`
		Type       domain.TemplateType `json:"type" validate:"required"`
		Subject    string              `json:"subject" validate:"required"`
		BodyHTML   string              `json:"body_html"`
		BodyText   string              `json:"body_text"`
		SendGridID string              `json:"sendgrid_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "invalid request body",
		})
		return
	}

	tmpl := &domain.Template{
		Name:       req.Name,
		Type:       req.Type,
		Subject:    req.Subject,
		BodyHTML:   req.BodyHTML,
		BodyText:   req.BodyText,
		SendGridID: req.SendGridID,
		IsActive:   true,
	}

	if err := h.repo.Create(r.Context(), tmpl); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  true,
		"message": "template created successfully",
		"data":    tmpl,
	})
}

// UpdateTemplate handles PUT /api/v1/notifications/templates/{id}
func (h *TemplateHandler) UpdateTemplate(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "invalid template id",
		})
		return
	}

	existing, err := h.repo.GetByID(r.Context(), uint(id))
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "template not found",
		})
		return
	}

	var req struct {
		Name       *string `json:"name"`
		Subject    *string `json:"subject"`
		BodyHTML   *string `json:"body_html"`
		BodyText   *string `json:"body_text"`
		SendGridID *string `json:"sendgrid_id"`
		IsActive   *bool   `json:"is_active"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": "invalid request body",
		})
		return
	}

	if req.Name != nil {
		existing.Name = *req.Name
	}
	if req.Subject != nil {
		existing.Subject = *req.Subject
	}
	if req.BodyHTML != nil {
		existing.BodyHTML = *req.BodyHTML
	}
	if req.BodyText != nil {
		existing.BodyText = *req.BodyText
	}
	if req.SendGridID != nil {
		existing.SendGridID = *req.SendGridID
	}
	if req.IsActive != nil {
		existing.IsActive = *req.IsActive
	}

	if err := h.repo.Update(r.Context(), existing); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  false,
			"message": err.Error(),
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  true,
		"message": "template updated successfully",
		"data":    existing,
	})
}
