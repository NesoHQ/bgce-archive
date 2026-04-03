// @d:\Codes\bgce-archive\axon\domain\notification.go
package domain

import "time"

// NotificationType represents different notification categories
type NotificationType string

const (
	NotificationTypeWelcome        NotificationType = "welcome"
	NotificationTypePasswordReset  NotificationType = "password_reset"
	NotificationTypeEmailVerify    NotificationType = "email_verify"
	NotificationTypeCommentReply   NotificationType = "comment_reply"
	NotificationTypePostPublished  NotificationType = "post_published"
	NotificationTypeCourseEnrolled NotificationType = "course_enrolled"
	NotificationTypeDigest         NotificationType = "digest"
)

// NotificationStatus tracks delivery state
type NotificationStatus string

const (
	StatusPending   NotificationStatus = "pending"
	StatusSent      NotificationStatus = "sent"
	StatusFailed    NotificationStatus = "failed"
	StatusDelivered NotificationStatus = "delivered"
)

// Notification represents a single notification record
type Notification struct {
	ID          uint               `json:"id"`
	UserID      uint               `json:"user_id"`
	Type        NotificationType   `json:"type"`
	Subject     string             `json:"subject"`
	Body        string             `json:"body,omitempty"`
	Recipient   string             `json:"recipient"`
	Status      NotificationStatus `json:"status"`
	ProviderRef string             `json:"provider_ref,omitempty"`
	SentAt      *time.Time         `json:"sent_at,omitempty"`
	DeliveredAt *time.Time         `json:"delivered_at,omitempty"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
}

// TableName sets the table name to email_notifications to avoid conflict with
// the notifications table in archive.sql which is used for in-app notifications
func (Notification) TableName() string {
	return "email_notifications"
}

// UserPreference stores notification preferences per user
type UserPreference struct {
	ID             uint      `json:"id"`
	UserID         uint      `json:"user_id"`
	EmailEnabled   bool      `json:"email_enabled"`
	DigestEnabled  bool      `json:"digest_enabled"`
	DigestWeekly   bool      `json:"digest_weekly"`
	CommentReplies bool      `json:"comment_replies"`
	PostUpdates    bool      `json:"post_updates"`
	CreatedAt      time.Time `json:"created_at,omitempty"`
	UpdatedAt      time.Time `json:"updated_at,omitempty"`
}

// TableName sets the table name to email_preferences for clarity
func (UserPreference) TableName() string {
	return "email_preferences"
}

// SendRequest is the request payload for sending notifications
type SendRequest struct {
	UserID       uint                   `json:"user_id"`
	Type         NotificationType       `json:"type"`
	Recipient    string                 `json:"recipient"`
	Subject      string                 `json:"subject,omitempty"`
	TemplateData map[string]interface{} `json:"template_data,omitempty"`
}

// EmailRequest is the request payload for direct email sending
type EmailRequest struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	BodyHTML string `json:"body_html,omitempty"`
	BodyText string `json:"body_text,omitempty"`
}
