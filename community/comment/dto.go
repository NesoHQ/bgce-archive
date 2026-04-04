package comment

import (
	"time"

	"community/domain"
)

type CommentFilter struct {
	PostID    *uint
	Status    *domain.CommentStatus
	UserID    *uint
	ParentID  *uint
	Limit     int
	Offset    int
	SortBy    string
	SortOrder string
}

type CommentResponse struct {
	ID         uint                 `json:"id"`
	UUID       string               `json:"uuid"`
	PostID     *uint                `json:"post_id,omitempty"`
	UserID     uint                 `json:"user_id"`
	ParentID   *uint                `json:"parent_id,omitempty"`
	Content    string               `json:"content"`
	Status     domain.CommentStatus `json:"status"`
	LikeCount  int                  `json:"like_count"`
	ReplyCount int                  `json:"reply_count"`
	CreatedAt  time.Time            `json:"created_at"`
}

type CommentListItemResponse struct {
	ID         uint                 `json:"id"`
	UUID       string               `json:"uuid"`
	PostID     *uint                `json:"post_id,omitempty"`
	UserID     uint                 `json:"user_id"`
	ParentID   *uint                `json:"parent_id,omitempty"`
	Content    string               `json:"content"`
	Status     domain.CommentStatus `json:"status"`
	LikeCount  int                  `json:"like_count"`
	ReplyCount int                  `json:"reply_count"`
	CreatedAt  time.Time            `json:"created_at"`
}

func ToCommentListItemResponse(c *domain.Comment) *CommentListItemResponse {
	return &CommentListItemResponse{
		ID:         c.ID,
		UUID:       c.UUID,
		PostID:     c.PostID,
		UserID:     c.UserID,
		ParentID:   c.ParentID,
		Content:    c.Content,
		Status:     c.Status,
		LikeCount:  c.LikeCount,
		ReplyCount: c.ReplyCount,
		CreatedAt:  c.CreatedAt,
	}
}

type CreateCommentRequest struct {
	PostID   uint   `json:"post_id"   validate:"required,min=1"`
	ParentID *uint  `json:"parent_id"`
	Content  string `json:"content"   validate:"required,min=1,max=2000"`
}

type CreateCommentCommand struct {
	PostID   uint
	UserID   uint
	ParentID *uint
	Content  string
}

func ToCommentResponse(c *domain.Comment) *CommentResponse {
	return &CommentResponse{
		ID:         c.ID,
		UUID:       c.UUID,
		PostID:     c.PostID,
		UserID:     c.UserID,
		ParentID:   c.ParentID,
		Content:    c.Content,
		Status:     c.Status,
		LikeCount:  c.LikeCount,
		ReplyCount: c.ReplyCount,
		CreatedAt:  c.CreatedAt,
	}
}
