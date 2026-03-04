package util

import (
	"math"
	"strings"
)

func CalculateReadTime(content *string) int {
	const wordsPerMinute = 200

	words := strings.Fields(*content)
	wordCount := len(words)

	minutes := int(math.Ceil(float64(wordCount) / float64(wordsPerMinute)))

	if minutes < 1 {
		minutes = 1
	}

	return minutes
}
