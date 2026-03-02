package comment

import (
	"context"
)

type service struct {
	repo Repository
}

func (s *service) ListComments(ctx context.Context, filter CommentFilter) ([]*CommentListItemResponse, int64, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.SortBy == "" {
		filter.SortBy = "created_at"
	}
	if filter.SortOrder == "" {
		filter.SortOrder = "DESC"
	}

	comments, total, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]*CommentListItemResponse, len(comments))
	for i, c := range comments {
		responses[i] = ToCommentListItemResponse(c)
	}

	return responses, total, nil
}
