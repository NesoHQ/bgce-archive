package comment

import "community/moderation"

// NewService creates a new comment service with injected dependencies
func NewService(repo Repository, checker moderation.Moderator) Service {
	return &service{
		repo:    repo,
		checker: checker,
	}
}
