package discussion

import (
	"time"

	"community/domain"
)

type DiscussionFilter struct {
	CategoryID *uint
	Status     *domain.DiscussionStatus
	Sort       string // recent, popular, unanswered
	Limit      int
	Offset     int
}

type DiscussionResponse struct {
	ID             uint                    `json:"id"`
	UUID           string                  `json:"uuid"`
	UserID         uint                    `json:"user_id"`
	CategoryID     uint                    `json:"category_id"`
	Title          string                  `json:"title"`
	Slug           string                  `json:"slug"`
	Content        string                  `json:"content"`
	Status         domain.DiscussionStatus `json:"status"`
	IsPinned       bool                    `json:"is_pinned"`
	UpvoteCount    int                     `json:"upvote_count"`
	ViewCount      int                     `json:"view_count"`
	ReplyCount     int                     `json:"reply_count"`
	LastActivityAt *time.Time              `json:"last_activity_at,omitempty"`
	CreatedAt      time.Time               `json:"created_at"`
}

type DiscussionListItemResponse struct {
	ID             uint                    `json:"id"`
	UUID           string                  `json:"uuid"`
	Title          string                  `json:"title"`
	Slug           string                  `json:"slug"`
	UserID         uint                    `json:"user_id"`
	CategoryID     uint                    `json:"category_id"`
	Status         domain.DiscussionStatus `json:"status"`
	UpvoteCount    int                     `json:"upvote_count"`
	ReplyCount     int                     `json:"reply_count"`
	ViewCount      int                     `json:"view_count"`
	IsPinned       bool                    `json:"is_pinned"`
	LastActivityAt *time.Time              `json:"last_activity_at,omitempty"`
	CreatedAt      time.Time               `json:"created_at"`
}

func ToDiscussionListItemResponse(d *domain.Discussion) *DiscussionListItemResponse {
	return &DiscussionListItemResponse{
		ID:             d.ID,
		UUID:           d.UUID,
		Title:          d.Title,
		Slug:           d.Slug,
		UserID:         d.UserID,
		CategoryID:     d.CategoryID,
		Status:         d.Status,
		UpvoteCount:    d.UpvoteCount,
		ReplyCount:     d.ReplyCount,
		ViewCount:      d.ViewCount,
		IsPinned:       d.IsPinned,
		LastActivityAt: d.LastActivityAt,
		CreatedAt:      d.CreatedAt,
	}
}
