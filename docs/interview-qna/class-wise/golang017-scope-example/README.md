# 📘 Class 17  
**Video Name:** Scope with another boring example 🙃

---

## 🧑‍💻 Code written in this class

```go
package main

import "fmt"

var (
	a = 10
	b = 20
)

func printNum(num int) {
	fmt.Println(num)
}

func add(x int, y int) {
	res := x + y
	printNum(res)
}

func main() {
	add(a, b)
}
```
## 🧠 Key Concepts

1. **✅ Order doesn't matter (for package-level stuff)**
    The order of functions and globally declared variables does not matter in Go.
    Even if the functions and variables are defined after `main()`, Go will still recognize and compile everything correctly.

2. **🤓 Go ≠ Functional Paradigm**
    Although Go has borrowed some cool ideas from functional languages (like first-class functions, closures, etc.), **Go is not a functional programming language.**

3. **⚖️ What paradigm is Go really?**

    > Go is a **multi-paradigm** language, but its primary style is **imperative** and **procedural**, with **struct-based composition** over classic OOP.

It's built to be:

    ✅ Simple

    🔍 Predictable

    📖 Readable

You can write in a functional-ish style, but Go wasn’t designed for heavy functional abstractions.

[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/class-wise
]