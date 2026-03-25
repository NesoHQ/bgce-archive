package moderation

import "context"

// ContentChecker checks whether content violates community guidelines.

type ContentChecker interface {
	// Check returns flagged=true if the content violates guidelines.
	Check(ctx context.Context, content string) (flagged bool, err error)
}

// NoOpChecker always approves content. Used as a fallback
// rather than refusing to start over a non-critical dependency.
type NoOpChecker struct{}

func (n *NoOpChecker) Check(_ context.Context, _ string) (bool, error) {
	return false, nil
}
