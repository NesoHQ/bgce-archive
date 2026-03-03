package discussion

import (
	"context"
)

type service struct {
	repo Repository
}

func (s *service) ListDiscussions(ctx context.Context, filter DiscussionFilter) ([]*DiscussionListItemResponse, int64, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Sort == "" {
		filter.Sort = "recent"
	}

	discussions, total, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]*DiscussionListItemResponse, len(discussions))
	for i, d := range discussions {
		responses[i] = ToDiscussionListItemResponse(d)
	}

	return responses, total, nil
}
