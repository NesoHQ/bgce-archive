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
        http.Error(w, "invalid template id", http.StatusBadRequest)
        return
    }
    
    template, err := h.repo.GetByID(r.Context(), uint(id))
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }
    
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status": true,
        "data":   template,
    })
}

// CreateTemplate handles POST /api/v1/notifications/templates
func (h *TemplateHandler) CreateTemplate(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Name       string             `json:"name" validate:"required"`
        Type       domain.TemplateType `json:"type" validate:"required"`
        Subject    string             `json:"subject" validate:"required"`
        BodyHTML   string             `json:"body_html"`
        BodyText   string             `json:"body_text"`
        SendGridID string             `json:"sendgrid_id"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }
    
    template := &domain.Template{
        Name:       req.Name,
        Type:       req.Type,
        Subject:    req.Subject,
        BodyHTML:   req.BodyHTML,
        BodyText:   req.BodyText,
        SendGridID: req.SendGridID,
        IsActive:   true,
    }
    
    if err := h.repo.Create(r.Context(), template); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  true,
        "message": "template created successfully",
        "data":    template,
    })
}

// UpdateTemplate handles PUT /api/v1/notifications/templates/{id}
func (h *TemplateHandler) UpdateTemplate(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        http.Error(w, "invalid template id", http.StatusBadRequest)
        return
    }
    
    existing, err := h.repo.GetByID(r.Context(), uint(id))
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }
    
    var req struct {
        Name       *string             `json:"name"`
        Subject    *string             `json:"subject"`
        BodyHTML   *string             `json:"body_html"`
        BodyText   *string             `json:"body_text"`
        SendGridID *string             `json:"sendgrid_id"`
        IsActive   *bool               `json:"is_active"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
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
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  true,
        "message": "template updated successfully",
        "data":    existing,
    })
}