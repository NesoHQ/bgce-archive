package lexer

import "strings"

func Tokenize(input string) []string {
	tokens := []string{}
	for _, char := range strings.TrimSpace(input) {
		if char == '{' || char == '}' {
			tokens = append(tokens, string(char))
		}
	}
	return tokens
}