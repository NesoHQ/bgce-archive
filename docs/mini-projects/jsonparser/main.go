package main

import (
	"fmt"
	"os"

	"jsonparser/lexer"
	"jsonparser/parser"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: JSON Parsing file!")
		os.Exit(1)
	}

	data, _ := os.ReadFile(os.Args[1])
	tokens := lexer.Tokenize(string(data))
	if parser.Parse(tokens) {
		fmt.Println("Valid JSON")
		os.Exit(0)
	} else {
		fmt.Println("Invalid JSON")
		os.Exit(1)
	}
}
