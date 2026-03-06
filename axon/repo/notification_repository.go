package repo

import (
    "context"
    "errors"
    "fmt"
    "time"
    
    "axon/domain"
    "axon/notification"
    
    "gorm.io/gorm"
)

type notificationRepository struct {
    db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) notification.Repository {
    return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(ctx context.Context, notification *domain.Notification) error {
    return r.db.WithContext(ctx).Create(notification).Error
}

func (r *notificationRepository) GetByID(ctx context.Context, id uint) (*domain.Notification, error) {
    var notification domain.Notification
    err := r.db.WithContext(ctx).First(&notification, id).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, fmt.Errorf("notification not found")
        }
        return nil, err
    }
    return &notification, nil
}

func (r *notificationRepository) GetByUserID(ctx context.Context, userID uint, limit, offset int) ([]*domain.Notification, int64, error) {
    var notifications []*domain.Notification
    var total int64
    
    query := r.db.WithContext(ctx).Model(&domain.Notification{}).Where("user_id = ?", userID)
    
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }
    
    err := query.Order("created_at DESC").
        Limit(limit).
        Offset(offset).
        Find(&notifications).Error
    
    return notifications, total, err
}

func (r *notificationRepository) UpdateStatus(ctx context.Context, id uint, status domain.NotificationStatus, providerRef string) error {
    updates := map[string]interface{}{
        "status":       status,
        "provider_ref": providerRef,
        "updated_at":   time.Now(),
    }
    
    switch status {
    case domain.StatusSent:
        updates["sent_at"] = time.Now()
    case domain.StatusDelivered:
        updates["delivered_at"] = time.Now()
    }
    
    return r.db.WithContext(ctx).
        Model(&domain.Notification{}).
        Where("id = ?", id).
        Updates(updates).Error
}

func (r *notificationRepository) GetPendingDigest(ctx context.Context, userID uint) ([]*domain.Notification, error) {
    var notifications []*domain.Notification
    
    // Get notifications from last 7 days not yet included in digest
    sevenDaysAgo := time.Now().AddDate(0, 0, -7)
    
    err := r.db.WithContext(ctx).
        Where("user_id = ? AND created_at >= ? AND type != ?", userID, sevenDaysAgo, domain.NotificationTypeDigest).
        Order("created_at DESC").
        Find(&notifications).Error
    
    return notifications, err
}

func (r *notificationRepository) MarkDigestSent(ctx context.Context, ids []uint) error {
    if len(ids) == 0 {
        return nil
    }
    
    return r.db.WithContext(ctx).
        Model(&domain.Notification{}).
        Where("id IN ?", ids).
        Update("included_in_digest", true).Error
}