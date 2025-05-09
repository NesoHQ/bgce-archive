# Class 25 - Internal Memory Deep Dive: Compilation & Execution Phases

---

## ✨ Topics Covered

This class focused on the internal workings of a Go program with a spotlight on what happens under the hood during:

- **Compilation Phase**
- **Execution Phase**
- How Go builds a binary with `go build`
- What gets stored in that binary (functions, constants, globals, etc.)
- How function expressions (e.g., `add := func(...)`) are treated in memory

---

## 👍 Key Concepts

| Concept                 | Explanation                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| **Compilation Phase**   | Parses and compiles source code into a binary executable. No code runs yet. |
| **Execution Phase**     | Runs the compiled binary, starting from `init()` and then `main()`.         |
| **Code Segment**        | Where compiled functions (`main`, `call`, anonymous `add`) and constants (`a`) are stored as part of executable instructions.|
| **Data Segment**        | Holds global variables (like `p`).                    |
| **Function Expressions**| Treated as runtime function objects, stored in code segment.                |

---

## 📋 Code Used in Class 25

```go
package main

import "fmt"

const a = 10 // constant
var p = 100

func call() {
	add := func(x int, y int) {
		z := x + y
		fmt.Println(z)
	}

	add(5, 6)
	add(p, a)
}

func main() {
	call()
	fmt.Println(a)
}

func init() {
	fmt.Println("Hello")
}
```

---

## 🔄 Compilation Phase Visualized

### `go build main.go`

- **Parser/Compiler** checks for syntax, scope, and dependencies.
- Stores:
  - Constants: `a = 10`
  - Globals: `p = 100`
  - Functions: `init`, `main`, `call`, and the anonymous `add` function inside `call`
- Generates a **binary** that includes all necessary machine code + metadata.

Binary includes:
- Code Segment: `const a`, `main`, `call`, anonymous function
- Data Segment: `var p`
- No execution happens here.

---

## ⏱ Execution Phase Visualized

```
   1. init()            => "Hello"
   2. main()            => calls call()
   3. call()            => declares and invokes add()
       - add(5, 6)      => 11
       - add(100, 10)   => 110
   4. fmt.Println(a)    => 10
```

---

## 🧠 Memory Layout

```
┌─────────────────────────────┐
│       Code Segment          │
│-----------------------------│
│ const a = 10                |
| main, call, init, add-func  │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│       Data Segment          │
│-----------------------------│
│ var p = 100                 │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│           Stack             │
│-----------------------------│
│ call() frame → add func     │
│   x=5,y=6,z=11              │
│   x=100,y=10,z=110          │
└─────────────────────────────┘
```

---

## 🔹 Summary

- Go runs in **two phases**: Compilation and Execution.
- During **compilation**, Go prepares memory layout, compiles functions and expressions.
- In **execution**, it runs `init()` and then `main()`.
- **Function expressions** like `add := func(...)` are first-class values and live in the code segment.
- The resulting binary from `go build` holds everything: code, data, metadata.

---

[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/class-wise
]