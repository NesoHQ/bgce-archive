package repo

import (
	"context"
	"errors"
	"log/slog"
	"strings"

	"community/comment"
	"community/domain"

	"gorm.io/gorm"
)

var (
	allowedCommentSortBy = map[string]string{
		"created_at":  "created_at",
		"updated_at":  "updated_at",
		"like_count":  "like_count",
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

func (r *commentRepository) FindByID(ctx context.Context, id uint) (*domain.Comment, error) {
	var c domain.Comment

	err := r.db.WithContext(ctx).First(&c, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &c, nil
}

func (r *commentRepository) Create(ctx context.Context, c *domain.Comment) error {
	if err := r.db.WithContext(ctx).Create(c).Error; err != nil {
		return err
	}

	if c.ParentID != nil {
		if err := r.incrementReplyCount(ctx, *c.ParentID); err != nil {
			slog.WarnContext(ctx, "failed to increment reply_count",
				"parent_id", *c.ParentID,
				"comment_id", c.ID,
				"error", err,
			)
		}
	}

	return nil
}

func (r *commentRepository) incrementReplyCount(ctx context.Context, parentID uint) error {
	return r.db.WithContext(ctx).
		Model(&domain.Comment{}).
		Where("id = ?", parentID).
		UpdateColumn("reply_count", gorm.Expr("reply_count + 1")).
		Error
}
