package comment

import (
	"context"

	"community/domain"
)

// Service defines the business logic interface for comments
type Service interface {
	ListComments(ctx context.Context, filter CommentFilter) ([]*CommentListItemResponse, int64, error)
	CreateComment(ctx context.Context, cmd CreateCommentCommand) (*CommentResponse, error)
}

// Repository defines the interface for comment persistence
type Repository interface {
	List(ctx context.Context, filter CommentFilter) ([]*domain.Comment, int64, error)
	Create(ctx context.Context, comment *domain.Comment) error
	FindByID(ctx context.Context, id uint) (*domain.Comment, error)
}
