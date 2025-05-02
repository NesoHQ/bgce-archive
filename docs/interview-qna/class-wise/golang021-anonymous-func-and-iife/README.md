# 📘 Class 21 – Expressions, Anonymous Functions & IIFE in Go

### 🎥 Video Name: 
**Anonymous function, Expression & IIFE**

---

## 📦 Code Written in This Class

```go
// Anonymous function
// IIFE - Immediately Invoked Function Expression

package main

import "fmt"

func main() {
	// Anonymous function
	func(a int, b int) {
		c := a + b
		fmt.Println(c)
	}(5, 7) // IIFE
}

func init() {
	fmt.Println("I'll be called first")
}
```
## 🧠 Key Concepts
### 🧮 Expression in Go

> An expression is any snippet of code that evaluates to a value.

**Examples:**

```go
a + b          // is an expression
func(x, y){}   // is a function expression
```
Expressions can be used as values, passed around, or even executed immediately — which leads us to…

### **🧙 Anonymous Function**

An **anonymous function** is a function **without a name.**

Instead of:
```go
func add(a, b int) int {
	return a + b
}
```
You write:
```go
func(a, b int) int {
	return a + b
}
```
✅ You can assign it to a variable, pass it as an argument, or invoke it on the spot.

### ⚡ IIFE (Immediately Invoked Function Expression)

> An **IIFE** is an anonymous function that is **executed immediately** right after it's defined.

Syntax:
```go
func(a int, b int) {
	// do stuff
}(5, 7)
```
**Use-case**: You want to run a small block of logic **immediately, without polluting the namespace** with a new function name.

## 🖥️ CLI-style Execution Visualization

```
=========== Compilation Phase =============
Found init() ✅
Found main() ✅

=========== Execution Phase ===============

🔁 init() runs first
→ Prints: I'll be called first

🧠 Data Segment:
(No global vars in this case)

📚 Stack Frame:
┌─────────────────────┐
│    main()           │
│ ┌─────────────────┐ │
│ │  anonymous func │ │
│ └─────────────────┘ │
└─────────────────────┘

main() calls an IIFE:
→ Passes 5 and 7
→ Inside IIFE: c := 5 + 7 = 12
→ Prints: 12

=========== Execution Complete =============
```

## 🧵 TL;DR

-[] ✅ Expressions return values and can be assigned or executed.

-[] 🧪 Anonymous functions have no name, great for quick logic blocks.

-[] 🚀 IIFE: Define & execute in one go. Great for one-off logic.
