package comment

import (
	"context"
	"fmt"
	"strings"

	"community/domain"
	"community/moderation"
)

type service struct {
	repo    Repository
	checker moderation.Moderator
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

type ErrInvalidParent struct {
	Reason string
}

func (e *ErrInvalidParent) Error() string {
	return fmt.Sprintf("invalid parent_id: %s", e.Reason)
}

func (s *service) CreateComment(ctx context.Context, cmd CreateCommentCommand) (*CommentResponse, error) {
	cmd.Content = strings.TrimSpace(cmd.Content)

	if cmd.ParentID != nil {
		parent, err := s.repo.FindByID(ctx, *cmd.ParentID)
		if err != nil {
			return nil, fmt.Errorf("CreateComment: failed to fetch parent: %w", err)
		}

		if parent == nil {
			return nil, &ErrInvalidParent{Reason: "parent comment not found"}
		}

		if parent.ParentID != nil {
			return nil, &ErrInvalidParent{Reason: "parent_id must reference a top-level comment"}
		}

		if parent.PostID == nil || *parent.PostID != cmd.PostID {
			return nil, &ErrInvalidParent{Reason: "parent comment does not belong to this post"}
		}
	}

	status := domain.CommentStatusApproved
	result, err := s.checker.Check(ctx, cmd.Content)

	var toxicityScore *float64
	if result != nil && result.Flagged {
		score := severityToScore(result.Severity)
		toxicityScore = &score
	}

	if err != nil || result != nil && result.Flagged {
		status = domain.CommentStatusPending
	}

	postID := cmd.PostID
	c := &domain.Comment{
		PostID:        &postID,
		UserID:        cmd.UserID,
		ParentID:      cmd.ParentID,
		Content:       cmd.Content,
		Status:        status,
		ToxicityScore: toxicityScore,
	}

	if err := s.repo.Create(ctx, c); err != nil {
		return nil, fmt.Errorf("CreateComment: failed to persist comment: %w", err)
	}

	return ToCommentResponse(c), nil
}

func severityToScore(severity string) float64 {
	switch severity {
	case "high":
		return 0.80
	case "medium":
		return 0.60
	case "low":
		return 0.30
	default:
		return 0.00
	}
}
