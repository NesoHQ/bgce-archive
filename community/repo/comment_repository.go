package repo

import (
	"context"
	"strings"

	"community/comment"
	"community/domain"

	"gorm.io/gorm"
)

var (
	allowedCommentSortBy    = map[string]string{
		"created_at": "created_at",
		"updated_at": "updated_at",
		"like_count": "like_count",
		"reply_count": "reply_count",
	}
	allowedSortOrder = map[string]string{
		"asc":  "ASC",
		"desc": "DESC",
	}
)

type commentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) comment.Repository {
	return &commentRepository{db: db}
}

func (r *commentRepository) List(ctx context.Context, filter comment.CommentFilter) ([]*domain.Comment, int64, error) {
	var comments []*domain.Comment
	var total int64

	baseQuery := r.db.WithContext(ctx).Model(&domain.Comment{})

	if filter.PostID != nil {
		baseQuery = baseQuery.Where("post_id = ?", *filter.PostID)
	}
	if filter.Status != nil {
		baseQuery = baseQuery.Where("status = ?", *filter.Status)
	}
	if filter.UserID != nil {
		baseQuery = baseQuery.Where("user_id = ?", *filter.UserID)
	}
	if filter.ParentID != nil {
		baseQuery = baseQuery.Where("parent_id = ?", *filter.ParentID)
	}

	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortBy := "created_at"
	if s, ok := allowedCommentSortBy[strings.ToLower(strings.TrimSpace(filter.SortBy))]; ok {
		sortBy = s
	}
	sortOrder := "DESC"
	if s, ok := allowedSortOrder[strings.ToLower(strings.TrimSpace(filter.SortOrder))]; ok {
		sortOrder = s
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

	query := baseQuery.Order(sortBy + " " + sortOrder).Limit(limit).Offset(offset)
	if err := query.Find(&comments).Error; err != nil {
		return nil, 0, err
	}

	return comments, total, nil
}
