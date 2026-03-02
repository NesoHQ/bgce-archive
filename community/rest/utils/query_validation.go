package utils

import (
	"net/http"
	"strings"

	"community/domain"
)

const (
	MaxLimit     = 100
	DefaultLimit = 20
)

var (
	validCommentStatuses = map[domain.CommentStatus]bool{
		domain.CommentStatusPending:  true,
		domain.CommentStatusApproved: true,
		domain.CommentStatusRejected: true,
		domain.CommentStatusSpam:     true,
	}
	validDiscussionStatuses = map[domain.DiscussionStatus]bool{
		domain.DiscussionStatusOpen:   true,
		domain.DiscussionStatusClosed: true,
		domain.DiscussionStatusLocked: true,
	}
	validCommentSortBy = map[string]bool{
		"created_at": true, "updated_at": true, "like_count": true, "reply_count": true,
	}
	validSortOrder = map[string]bool{
		"asc": true, "desc": true,
	}
	validDiscussionSort = map[string]bool{
		"recent": true, "popular": true, "unanswered": true,
	}
)

func ClampLimit(limit int) int {
	if limit <= 0 {
		return DefaultLimit
	}
	if limit > MaxLimit {
		return MaxLimit
	}
	return limit
}

func ClampOffset(offset int) int {
	if offset < 0 {
		return 0
	}
	return offset
}

func ValidCommentStatus(s domain.CommentStatus) bool {
	return validCommentStatuses[s]
}

func ValidDiscussionStatus(s domain.DiscussionStatus) bool {
	return validDiscussionStatuses[s]
}

func ValidCommentSortBy(s string) bool {
	return validCommentSortBy[strings.ToLower(strings.TrimSpace(s))]
}

func ValidSortOrder(s string) bool {
	return validSortOrder[strings.ToLower(strings.TrimSpace(s))]
}

func ValidDiscussionSort(s string) bool {
	return validDiscussionSort[strings.ToLower(strings.TrimSpace(s))]
}

func SendValidationError(w http.ResponseWriter, message string) {
	SendJson(w, http.StatusBadRequest, map[string]interface{}{
		"status":  false,
		"message": message,
	})
}
