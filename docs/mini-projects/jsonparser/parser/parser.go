package parser

func Parse(tokens []string) bool {
	return len(tokens) == 2 && tokens[0] == "{" && tokens[1] == "}"
}
