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
    NotificationTypePostPublished  NotificationType = "post_published"    // NEW
    NotificationTypeCourseEnrolled NotificationType = "course_enrolled"  // NEW
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
    ID          uint
    UserID      uint
    Type        NotificationType
    Subject     string
    Body        string
    Recipient   string // email address
    Status      NotificationStatus
    ProviderRef string // SendGrid message ID
    SentAt      *time.Time
    DeliveredAt *time.Time
    CreatedAt   time.Time
    UpdatedAt   time.Time
}

// UserPreference stores notification preferences per user
type UserPreference struct {
    ID              uint
    UserID          uint
    EmailEnabled    bool
    DigestEnabled   bool
    DigestWeekly    bool
    CommentReplies  bool
    PostUpdates     bool
    CreatedAt       time.Time
    UpdatedAt       time.Time
}

// SendRequest is the request payload for sending notifications
type SendRequest struct {
    UserID      uint                   `json:"user_id"`
    Type        NotificationType       `json:"type"`
    Recipient   string                 `json:"recipient"`
    Subject     string                 `json:"subject"`
    TemplateData map[string]interface{} `json:"template_data"`
}

// EmailRequest is the request payload for direct email sending
type EmailRequest struct {
    To       string                 `json:"to"`
    Subject  string                 `json:"subject"`
    BodyHTML string                 `json:"body_html"`
    BodyText string                 `json:"body_text"`
}