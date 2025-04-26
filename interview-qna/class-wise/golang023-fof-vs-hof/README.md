# Class 23: Functional Programming Concepts in Go

## Code Example
```go
package main

import "fmt"

func add(a int, b int) { // Parameter: a and b
	c := a + b
	fmt.Println(c)
}

func main() {
	add(2, 5) // 2 and 5 are arguments
	processOperation(4, 5, add)
	sum := call() // function expression
	sum(4, 7)
}

func processOperation(a int, b int, op func(p int, q int)) { // Higher order function
	op(a, b)
}

func call() func(x int, y int) {
	return add
}
```

---

## 🧠 Key Concepts

### 1. **Parameter vs Argument**
- **Parameter**: The variable listed inside the function definition. (e.g., `a int, b int` in `add(a, b)`)
- **Argument**: The actual value passed to the function when it's called. (e.g., `add(2, 5)`)

### 2. **First Order Function**
A regular function that does not take another function as input or return one.
- Examples:
  - Named function: `func add(a, b int)`
  - Anonymous function: `func(a int, b int) { ... }`
  - IIFE (Immediately Invoked Function Expression): `func(a, b int) { ... }(5, 7)`
  - Function expression: `sum := func(a, b int) { ... }`

### 3. **Higher Order Function**
A function that **takes a function as a parameter**, **returns a function**, or **both**.
- Example:
  - `processOperation` takes a function `op` as a parameter
  - `call()` returns a function `add`

### 4. **Callback Function**
- A function that is passed into another function to be executed later.
- In `processOperation(4, 5, add)`, the function `add` is a callback.

### 5. **First-Class Citizen (Function)**
- In Go, functions can be assigned to variables, passed as arguments, and returned from other functions.
- This makes them *first-class citizens*.

---

## 🧠 Conceptual Context (Functional Paradigm)

> Functional programming treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.

### Inspiration from Mathematics
- **First Order Logic**: Objects with properties (e.g., `Person`, `Car`, etc.)
- **Higher Order Logic**: Functions and their relation with other functions (like in Go's higher-order functions)

Languages like **Haskell**, **Racket**, etc., are built on deep functional paradigms.

Go borrows **some** of these concepts, but it is still **imperative and procedural** by nature.

---

## 📟 CLI Visualization (Call Stack + Segments)

### 1. **Data Segment**
- `add` (global function definition)
- `call` (returns a function)
- `processOperation` (stored function)

### 2. **Code Execution Flow (Stack Frames)**
```shell
Call Stack:
┌──────────────────────────┐
│ main()                   │
│ ├── add(2, 5)            │ => prints 7
│ ├── processOperation     │
│ │   └── op(4, 5) => add  │ => prints 9
│ ├── call()               │ => returns add
│ └── sum(4, 7)            │ => prints 11
└──────────────────────────┘
```

Everything runs in the order written, but since functions are first-class, Go can pass and return them like variables.

---

## Summary
- 🌱 Go supports functional programming **concepts** like first-class and higher-order functions.
- 💡 You can pass around functions like variables — extremely powerful for modular and clean code.
- 🧠 Understanding **first order vs higher order functions**, **parameters vs arguments**, and **callback functions** gives you a major edge in writing elegant Go code.

---

✅ This was a big brain class. You crushed it!

---


