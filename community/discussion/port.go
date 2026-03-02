package discussion

import (
	"context"

	"community/domain"
)

// Service defines the business logic interface for discussions
type Service interface {
	ListDiscussions(ctx context.Context, filter DiscussionFilter) ([]*DiscussionListItemResponse, int64, error)
}

// Repository defines the interface for discussion persistence
type Repository interface {
	List(ctx context.Context, filter DiscussionFilter) ([]*domain.Discussion, int64, error)
}
