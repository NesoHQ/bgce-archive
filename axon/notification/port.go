// @d:\Codes\bgce-archive\axon\notification\port.go
package notification

import (
	"context"

	"axon/domain"
)

// Repository defines data access operations for notifications
type Repository interface {
	// Create logs a sent notification
	Create(ctx context.Context, notification *domain.Notification) error

	// GetByID fetches a notification by ID
	GetByID(ctx context.Context, id uint) (*domain.Notification, error)

	// GetByUserID fetches notification history for a user
	GetByUserID(ctx context.Context, userID uint, limit, offset int) ([]*domain.Notification, int64, error)

	// UpdateStatus updates delivery status
	UpdateStatus(ctx context.Context, id uint, status domain.NotificationStatus, providerRef string) error

	// GetPendingDigest gets notifications for weekly digest
	GetPendingDigest(ctx context.Context, userID uint) ([]*domain.Notification, error)

	// MarkDigestSent marks notifications as included in digest
	MarkDigestSent(ctx context.Context, ids []uint) error
}

// PreferenceRepository defines user preference operations
type PreferenceRepository interface {
	// GetByUserID fetches user's notification preferences
	GetByUserID(ctx context.Context, userID uint) (*domain.UserPreference, error)

	// Create creates default preferences for new user
	Create(ctx context.Context, preference *domain.UserPreference) error

	// Update updates user preferences
	Update(ctx context.Context, preference *domain.UserPreference) error
}

// UserRepository defines user lookup operations (reads from cortex users table)
type UserRepository interface {
	// Exists checks if a user exists
	Exists(ctx context.Context, userID uint) (bool, error)

	// GetByID fetches user by ID for validation
	GetByID(ctx context.Context, userID uint) (*User, error)
}

// User represents a minimal user record for validation
type User struct {
	ID    uint
	Email string
}

// Service defines business operations
type Service interface {
	// SendWelcomeEmail sends welcome email to new users
	SendWelcomeEmail(ctx context.Context, userID uint, userEmail, userName string) error

	// SendPasswordReset sends password reset email
	SendPasswordReset(ctx context.Context, userEmail, resetToken string) error

	// SendEmailVerification sends email verification
	SendEmailVerification(ctx context.Context, userID uint, userEmail, verifyToken string) error

	// SendCommentReplyNotification notifies post author of reply
	SendCommentReplyNotification(ctx context.Context, postAuthorID uint, postAuthorEmail, commenterName, postTitle, comment string) error

	// SendPostPublishedNotification notifies followers of new post (NEW)
	SendPostPublishedNotification(ctx context.Context, followerID uint, followerEmail, authorName, postTitle, postSlug string) error

	// SendCourseEnrolledNotification sends course enrollment confirmation (NEW)
	SendCourseEnrolledNotification(ctx context.Context, userID uint, userEmail, courseName string) error

	// SendWeeklyDigest sends weekly digest to user
	SendWeeklyDigest(ctx context.Context, userID uint, userEmail string) error

	// Send sends a generic notification (NEW)
	Send(ctx context.Context, req *domain.SendRequest) error

	// SendEmail sends a direct email (NEW)
	SendEmail(ctx context.Context, req *domain.EmailRequest) error

	// GetUserPreferences gets notification preferences
	GetUserPreferences(ctx context.Context, userID uint) (*domain.UserPreference, error)

	// UpdateUserPreferences updates notification preferences
	UpdateUserPreferences(ctx context.Context, preference *domain.UserPreference) error

	// GetNotificationHistory gets user's notification history
	GetNotificationHistory(ctx context.Context, userID uint, limit, offset int) ([]*domain.Notification, int64, error)
}
