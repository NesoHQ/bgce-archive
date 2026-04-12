package moderation

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"sort"
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

type moderationRule struct {
	regex    *regexp.Regexp
	severity string
}

var severityOrder = map[string]int{
	"none":   0,
	"low":    1,
	"medium": 2,
	"high":   3,
}

type RegexModerator struct {
	moderationRules []*moderationRule
}

var _ Moderator = (*RegexModerator)(nil)

// whitespaceRe compiled once at package level — not per call
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

	compiled := make([]*moderationRule, 0, len(cfg.Rules))

	for _, rule := range cfg.Rules {
		pattern := rule.Pattern

		if rule.UseWordBoundary {
			pattern = `\b` + pattern + `\b`
		}

		re, err := regexp.Compile("(?i)" + pattern)
		if err != nil {
			return nil, fmt.Errorf("invalid pattern %q: %w", pattern, err)
		}

		compiled = append(compiled, &moderationRule{
			regex:    re,
			severity: rule.Severity,
		})
	}

	sort.Slice(compiled, func(i, j int) bool {
		return severityOrder[compiled[i].severity] > severityOrder[compiled[j].severity]
	})

	return &RegexModerator{moderationRules: compiled}, nil
}

func (r *RegexModerator) Check(ctx context.Context, content string) (*Result, error) {
	normalized := normalize(content)

	for _, rule := range r.moderationRules {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		if rule.regex.MatchString(normalized) {
			return &Result{
				Flagged:  true,
				Severity: rule.severity,
				Score:    0,
				Source:   "regex",
			}, nil
		}
	}

	return &Result{
		Flagged:  false,
		Severity: "none",
		Score:    0,
		Source:   "regex",
	}, nil
}

func normalize(text string) string {
	text = strings.ToLower(text)
	return whitespaceRe.ReplaceAllString(text, "")
}
