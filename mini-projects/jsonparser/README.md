🧩 Project: Build Your Own JSON Parser (Step 1)

Imagine JSON like Lego blocks that computers use to send and understand data. In this project, we’re learning how to read those blocks and say: “Yep, this is built correctly!” or “Nope, something’s wrong!”

⸻

🪜 Step-by-Step Guide for Step 1

🛠 Step 0: Setup

“Before we play the game, we need to set up the board.”

    1.	Create folders like this:

```readme
jsonparser/
├── main.go
├── lexer/
│ └── lexer.go
├── parser/
│ └── parser.go
├── tests/
│ └── step1/
│ ├── valid.json
│ └── invalid.json
```

    2.	Put this in tests/step1/valid.json

`{}`

    3.	Put this in tests/step1/invalid.json

`{`

⸻

🧠 Step 1: Understand What We’re Building

“We’re building a tool that checks if a JSON is okay or broken.”

We want to:
• Read a file.
• Break it into pieces (like Lego blocks).
• Check if those pieces make a real object ({}).
• Say “Valid JSON” ✅ or “Invalid JSON” ❌.

⸻

🧪 The Parts of Our Tool

1️⃣ main.go — the commander

It reads the file, sends it to the lexer, then the parser, and prints the result.

```go
package main

import (
    "fmt"
    "os"

    "jsonparser/lexer"
    "jsonparser/parser"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Println("Usage: ./jsonparser <path-to-json-file>")
        os.Exit(1)
    }

    filePath := os.Args[1]
    data, err := os.ReadFile(filePath)
    if err != nil {
    	fmt.Printf("Failed to read file: %v\n", err)
    	os.Exit(1)
    }

    tokens := lexer.Tokenize(string(data))
    if parser.Parse(tokens) {
    	fmt.Println("Valid JSON")
    	os.Exit(0)
    } else {
    	fmt.Println("Invalid JSON")
    	os.Exit(1)
    }
}
```

⸻

2️⃣ lexer/lexer.go — the scanner

It breaks the string like {} into tokens (chunks), like:

[LEFT_BRACE, RIGHT_BRACE]

```go
package lexer

import "strings"

type TokenType string

const (
    LEFT_BRACE TokenType = "{"
    RIGHT_BRACE TokenType = "}"
    ILLEGAL TokenType = "ILLEGAL"
    EOF TokenType = "EOF"
)

type Token struct {
    Type TokenType
    Literal string
}

func Tokenize(input string) []Token {
    var tokens []Token
    input = strings.TrimSpace(input)

    for _, ch := range input {
    	switch ch {
    	case '{':
    		tokens = append(tokens, Token{Type: LEFT_BRACE, Literal: "{"})
    	case '}':
    		tokens = append(tokens, Token{Type: RIGHT_BRACE, Literal: "}"})
    	default:
    		// not a valid character in step 1
    		tokens = append(tokens, Token{Type: ILLEGAL, Literal: string(ch)})
    	}
    }

    tokens = append(tokens, Token{Type: EOF, Literal: ""})
    return tokens
}
```

⸻

3️⃣ parser/parser.go — the judge

It looks at the tokens and decides if it’s correct.

```go
package parser

import "jsonparser/lexer"

func Parse(tokens []lexer.Token) bool {
    // Step 1: Only valid thing is [LEFT_BRACE, RIGHT_BRACE, EOF]
    if len(tokens) != 3 {
        return false
    }

    return tokens[0].Type == lexer.LEFT_BRACE &&
    	tokens[1].Type == lexer.RIGHT_BRACE &&
    	tokens[2].Type == lexer.EOF

}
```

⸻

▶️ Run It!

Go into your terminal and run this:

```bash
go run main.go tests/step1/valid.json # ✅ Should print: Valid JSON
go run main.go tests/step1/invalid.json # ❌ Should print: Invalid JSON
```

⸻

🎓 What Did We Learn?
• ✅ JSON is just a way to store data, like a toy box.
• ✅ Lexers break it into tokens (like sorting toys).
• ✅ Parsers check if the toys are arranged correctly.
• ✅ We only accept {} right now.
• ❌ Anything else is “broken” JSON.

⸻

🧠 Coming Next…

In Step 2, we’ll look inside the box and check for strings like:

{"key": "value"}

⸻
