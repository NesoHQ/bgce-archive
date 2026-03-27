package moderation

import "context"

// NoOpChecker always approves content. Used as a fallback when RegexModerator
// cannot be initialized — keeps the service running.
type NoOpChecker struct{}

func (n *NoOpChecker) Check(_ context.Context, _ string) (*Result, error) {
	return &Result{
		Flagged:  false,
		Severity: "none",
		Source:   "noop",
	}, nil
}
