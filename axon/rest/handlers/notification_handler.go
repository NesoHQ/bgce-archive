// @d:\Codes\bgce-archive\axon\rest\handlers\notification_handler.go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    
    "axon/domain"
    "axon/notification"
    
    "github.com/go-chi/chi/v5"
)

type NotificationHandler struct {
    service notification.Service
}

func NewNotificationHandler(service notification.Service) *NotificationHandler {
    return &NotificationHandler{service: service}
}

// GetUserPreferences handles GET /api/v1/users/{id}/notification-preferences
func (h *NotificationHandler) GetUserPreferences(w http.ResponseWriter, r *http.Request) {
    userIDStr := chi.URLParam(r, "id")
    userID, err := strconv.ParseUint(userIDStr, 10, 64)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }
    
    preference, err := h.service.GetUserPreferences(r.Context(), uint(userID))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status": true,
        "data":   preference,
    })
}

// UpdateUserPreferences handles PUT /api/v1/users/{id}/notification-preferences
func (h *NotificationHandler) UpdateUserPreferences(w http.ResponseWriter, r *http.Request) {
    userIDStr := chi.URLParam(r, "id")
    userID, err := strconv.ParseUint(userIDStr, 10, 64)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }
    
    var preference struct {
        EmailEnabled   *bool `json:"email_enabled"`
        DigestEnabled  *bool `json:"digest_enabled"`
        DigestWeekly   *bool `json:"digest_weekly"`
        CommentReplies *bool `json:"comment_replies"`
        PostUpdates    *bool `json:"post_updates"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&preference); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }
    
    // Get existing preferences
    existing, err := h.service.GetUserPreferences(r.Context(), uint(userID))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    // Update fields
    if preference.EmailEnabled != nil {
        existing.EmailEnabled = *preference.EmailEnabled
    }
    if preference.DigestEnabled != nil {
        existing.DigestEnabled = *preference.DigestEnabled
    }
    if preference.DigestWeekly != nil {
        existing.DigestWeekly = *preference.DigestWeekly
    }
    if preference.CommentReplies != nil {
        existing.CommentReplies = *preference.CommentReplies
    }
    if preference.PostUpdates != nil {
        existing.PostUpdates = *preference.PostUpdates
    }
    
    if err := h.service.UpdateUserPreferences(r.Context(), existing); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  true,
        "message": "preferences updated successfully",
        "data":    existing,
    })
}

// GetNotificationHistory handles GET /api/v1/users/{id}/notifications
func (h *NotificationHandler) GetNotificationHistory(w http.ResponseWriter, r *http.Request) {
    userIDStr := chi.URLParam(r, "id")
    userID, err := strconv.ParseUint(userIDStr, 10, 64)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }
    
    limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
    if limit == 0 {
        limit = 20
    }
    offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
    
    notifications, total, err := h.service.GetNotificationHistory(r.Context(), uint(userID), limit, offset)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status": true,
        "data":   notifications,
        "pagination": map[string]interface{}{
            "total":   total,
            "limit":   limit,
            "offset":  offset,
        },
    })
}

// SendNotification handles POST /api/v1/notifications/send (NEW)
func (h *NotificationHandler) SendNotification(w http.ResponseWriter, r *http.Request) {
    var req domain.SendRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }
    
    if req.Recipient == "" {
        http.Error(w, "recipient is required", http.StatusBadRequest)
        return
    }
    
    if req.Type == "" {
        http.Error(w, "type is required", http.StatusBadRequest)
        return
    }
    
    if err := h.service.Send(r.Context(), &req); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  true,
        "message": "notification sent successfully",
    })
}

// SendEmail handles POST /api/v1/notifications/email (NEW)
func (h *NotificationHandler) SendEmail(w http.ResponseWriter, r *http.Request) {
    var req domain.EmailRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }
    
    if req.To == "" {
        http.Error(w, "to is required", http.StatusBadRequest)
        return
    }
    
    if req.Subject == "" {
        http.Error(w, "subject is required", http.StatusBadRequest)
        return
    }
    
    if err := h.service.SendEmail(r.Context(), &req); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  true,
        "message": "email sent successfully",
    })
}