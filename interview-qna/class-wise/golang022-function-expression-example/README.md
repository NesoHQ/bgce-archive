# 📘 Class 22 – Function Expressions & Shadowing in Go

### 🎥 Video Name:
**Function Expression Example**

---

## ✅ Code 1: Working Example

```go
package main

import "fmt"

// Global function expression
var add = func(x, y int) {
	fmt.Println(x + y)
}

func main() {
	add(4, 7) // Calls the global `add`

	// Function expression assigned to local variable
	add := func(a int, b int) {
		c := a + b
		fmt.Println(c)
	}

	add(2, 3) // Calls the local `add`
}

func init() {
	fmt.Println("I will be called first")
}
```
## 🧠 Key Concepts
### 🔧 Function Expression

A function **assigned to a variable**. It allows us to:

-[] Store logic in a variable

-[] Treat functions like first-class citizens

-[] Create inline, nameless (anonymous) functions

**Example:**

```go
add := func(a int, b int) {
	fmt.Println(a + b)
}
```
### 🧱 Shadowing

When a variable in a **smaller (local) scope** has the **same name** as one in a **larger (outer) scope**, it "shadows" or hides it temporarily.

In the `main()` function:
```go
add := func(a int, b int) {...}
```
This local `add` shadows the global `add` from that point onward.

## 🖥️ Execution Visualization (Working Example)
```
========== Compilation Phase ==========
✔ Found init()
✔ Found main()
✔ Global `add` assigned to function

========== Execution Begins ===========

init():
→ Prints: I will be called first

main():
→ Calls global `add(4, 7)` → Prints: 11

Local Scope in main():
┌──────── Stack Frame ───────┐
│ main()                     │
│ ┌──────────────┐          │
│ │ add (local)  │────────┐ │
│ └──────────────┘        │ │
└─────────────────────────┘ │
       (shadows global) ◄───┘

→ Calls local `add(2, 3)` → Prints: 5

========== Execution Ends ==========
```
## ❌ Code 2: Fails to Compile
```go
package main

import "fmt"

// Global function expression
var add = func(x, y int) {
	fmt.Println(x + y)
}

func main() {
	adder(4, 7) // ❌ ERROR: undefined: adder

	// Function expression or Assign function in variable
	adder := func(a int, b int) {
		c := a + b
		fmt.Println(c)
	}

	add(2, 3)
}

func init() {
	fmt.Println("I will be called first")
}
```
### ❌ Why it fails

This line:
```go
adder(4, 7)
```
is **above** the declaration:
```go
adder := func(a int, b int) { ... }
```
### ⛔ The Problem: Temporal Dead Zone

In Go, **you can't use a variable before it's declared**, even if it’s in the same block.

So, when you try to use `adder`, it hasn’t been declared yet. Hence:
```bash
./main.go:10:2: undefined: adder
```

## 📚 TL;DR

Concept | Meaning
Function Expression | A function assigned to a variable
Anonymous Function | A function with no name
Shadowing | Local variable hides the same-named global one
Temporal Dead Zone | You can't use variables before their declaration in Go
IIFE vs Assignment | IIFE executes immediately; assignment waits to be called explicitly


[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/arrays
]