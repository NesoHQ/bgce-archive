package repo

import (
	"context"
	"strings"

	"community/discussion"
	"community/domain"

	"gorm.io/gorm"
)

type discussionRepository struct {
	db *gorm.DB
}

func NewDiscussionRepository(db *gorm.DB) discussion.Repository {
	return &discussionRepository{db: db}
}

func (r *discussionRepository) List(ctx context.Context, filter discussion.DiscussionFilter) ([]*domain.Discussion, int64, error) {
	var discussions []*domain.Discussion
	var total int64

	baseQuery := r.db.WithContext(ctx).Model(&domain.Discussion{})

	if filter.CategoryID != nil {
		baseQuery = baseQuery.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.Status != nil {
		baseQuery = baseQuery.Where("status = ?", *filter.Status)
	}

	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var sortOrder string
	switch strings.ToLower(strings.TrimSpace(filter.Sort)) {
	case "popular":
		sortOrder = "upvote_count DESC, last_activity_at DESC NULLS LAST, created_at DESC"
	case "unanswered":
		sortOrder = "reply_count ASC, created_at DESC"
	case "recent":
		fallthrough
	default:
		sortOrder = "last_activity_at DESC NULLS LAST, created_at DESC"
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := baseQuery.Order(sortOrder).Limit(limit).Offset(offset)
	if err := query.Find(&discussions).Error; err != nil {
		return nil, 0, err
	}

	return discussions, total, nil
}
