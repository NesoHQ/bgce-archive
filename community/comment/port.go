package comment

import (
	"context"

	"community/domain"
)

// Service defines the business logic interface for comments
type Service interface {
	ListComments(ctx context.Context, filter CommentFilter) ([]*CommentListItemResponse, int64, error)
}

// Repository defines the interface for comment persistence
type Repository interface {
	List(ctx context.Context, filter CommentFilter) ([]*domain.Comment, int64, error)
}
