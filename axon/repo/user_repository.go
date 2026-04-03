// @d:\Codes\bgce-archive\axon\repo\user_repository.go
package repo

import (
	"context"

	"axon/notification"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) notification.UserRepository {
	return &userRepository{db: db}
}

// Exists checks if a user exists in the users table (cortex service)
func (r *userRepository) Exists(ctx context.Context, userID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Raw(`SELECT COUNT(*) FROM users WHERE id = ?`, userID).Scan(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetByID fetches user by ID for validation
func (r *userRepository) GetByID(ctx context.Context, userID uint) (*notification.User, error) {
	var user notification.User
	err := r.db.WithContext(ctx).Raw(`SELECT id, email FROM users WHERE id = ?`, userID).Scan(&user).Error
	if err != nil {
		return nil, err
	}
	if user.ID == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return &user, nil
}
