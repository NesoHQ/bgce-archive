package moderation

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"
)

type Rule struct {
	Pattern         string `json:"pattern"`
	Severity        string `json:"severity"`
	UseWordBoundary bool   `json:"useWordBoundary"`
}

type slangConfig struct {
	Version string `json:"version"`
	Rules   []Rule `json:"rules"`
}

type compiledRule struct {
	regex    *regexp.Regexp
	severity string
}

type RegexModerator struct {
	rules []*compiledRule
}

var _ Moderator = (*RegexModerator)(nil)

var whitespaceRe = regexp.MustCompile(`[\s\.\-\_\*\+]+`)

func NewRegexModerator(configPath string) (*RegexModerator, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("read config: %w", err)
	}

	var cfg slangConfig
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("parse config: %w", err)
	}

	if len(cfg.Rules) == 0 {
		return nil, fmt.Errorf("no rules found")
	}

	var compiled []*compiledRule

	for _, rule := range cfg.Rules {
		pattern := rule.Pattern

		if rule.UseWordBoundary {
			pattern = `\b` + pattern + `\b`
		}

		re, err := regexp.Compile("(?i)" + pattern)
		if err != nil {
			return nil, fmt.Errorf("invalid pattern %q: %w", pattern, err)
		}

		compiled = append(compiled, &compiledRule{
			regex:    re,
			severity: rule.Severity,
		})
	}

	return &RegexModerator{rules: compiled}, nil
}

func (r *RegexModerator) Check(ctx context.Context, content string) (*Result, error) {
	normalized := normalize(content)

	highestSeverity := "none"

	for _, rule := range r.rules {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		if rule.regex.MatchString(normalized) {
			highestSeverity = maxSeverity(highestSeverity, rule.severity)
		}
	}

	return &Result{
		Flagged:  highestSeverity != "none",
		Severity: highestSeverity,
		Score:    0, // not used yet
		Source:   "regex",
	}, nil
}

func normalize(text string) string {
	text = strings.ToLower(text)
	return whitespaceRe.ReplaceAllString(text, "")
}

func maxSeverity(a, b string) string {
	rank := map[string]int{
		"none":   0,
		"low":    1,
		"medium": 2,
		"high":   3,
	}

	if rank[b] > rank[a] {
		return b
	}
	return a
}
