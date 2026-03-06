package repo

import (
    "context"
    "errors"
    "axon/domain"
    "axon/notification"
    "gorm.io/gorm"
)

type preferenceRepository struct {
    db *gorm.DB
}

func NewPreferenceRepository(db *gorm.DB) notification.PreferenceRepository {
    return &preferenceRepository{db: db}
}

func (r *preferenceRepository) GetByUserID(ctx context.Context, userID uint) (*domain.UserPreference, error) {
    var preference domain.UserPreference
    err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&preference).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            // Return default preferences
            return &domain.UserPreference{
                UserID:         userID,
                EmailEnabled:   true,
                DigestEnabled:  true,
                DigestWeekly:   true,
                CommentReplies: true,
                PostUpdates:    true,
            }, nil
        }
        return nil, err
    }
    return &preference, nil
}

func (r *preferenceRepository) Create(ctx context.Context, preference *domain.UserPreference) error {
    return r.db.WithContext(ctx).Create(preference).Error
}

func (r *preferenceRepository) Update(ctx context.Context, preference *domain.UserPreference) error {
    return r.db.WithContext(ctx).Save(preference).Error
}