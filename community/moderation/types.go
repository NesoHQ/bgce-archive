package moderation

import "context"

// Result is future-proof (ML-ready)
type Result struct {
	Flagged  bool
	Severity string
	Score    float64 // ML confidence later
	Source   string  // "regex" | "ml"
	Matches  []Match
}

type Match struct {
	Pattern  string
	Severity string
}

type Moderator interface {
	Check(ctx context.Context, content string) (*Result, error)
}
