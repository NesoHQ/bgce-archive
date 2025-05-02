# 🧠 Class 19: Init Function

**Video Topic**: `init()` Function in Go

---

## 🔤 Code Written in This Class

```go
//example 1
package main

import "fmt"

func main() {
	fmt.Println("Hello Init Function!")
}

func init() {
	fmt.Println("I am the function that is executed first")
}
```

```go
//example 2
package main

import "fmt"

var a = 10

func main() {
	fmt.Println(a)
}

func init() {
	fmt.Println(a)
	a = 20
}
```

## 🔍 Key Concepts

1. `init()` is a special Go function that runs before `main()`, automatically.

2. You can have multiple `init()` functions across different files and packages. They all run in the order of:

    - Dependency packages first

    - File order (top to bottom) next

3. You don't call `init()` manually. It runs automatically before the program starts.

##  🧠 CLI Memory & Execution Visualization (example 1)

Let’s visualize how Go handles `init()` under the hood:
```
// 🛠 Compile Time: Go detects init()

Found init() in main package ✅

----------- EXECUTION BEGINS -----------

🧠 Data Segment:
(none)

📚 Stack:
┌────────────────────┐
│ 🧩 init()           │
└────────────────────┘

🖨️ Output:
"I am the function that is executed first"

👋 init() returns

📚 Stack:
┌────────────────────┐
│ 🧩 main()           │
└────────────────────┘

🖨️ Output:
"Hello Init Function!"

✅ Program ends gracefully
```

## 🔍 CLI Visualization: Execution & Memory Layout (example 2)
```
=========== Program Compilation ===========
Found global variable: a = 10
Found init() ✅
Found main() ✅

=========== Execution Begins ==============

🧠 Data Segment (Globals):
a = 10 ← initialized before anything runs

📚 Stack Frame:
┌────────────┐
│  init()    │
└────────────┘

🔁 init() runs
→ Prints: 10
→ Updates a = 20

Stack after init():
(returns to runtime)

📚 Stack Frame:
┌────────────┐
│  main()    │
└────────────┘

🔁 main() runs
→ Prints: 20

=========== Execution Ends ================

📌 Summary

    ✅ Global variable a is initialized before any function runs.

    ⚙️ init() executes first:

        Reads a = 10

        Changes a = 20

    🧨 main() sees updated value: 20

This is a classic example of how init() can prepare or modify the runtime environment before the actual program logic in main() kicks in.

```

## ⚡ Quick Recap

1. ✅ `init()` always runs before `main()` even if it’s written after `main()` in your code.

2. ⛓️ You can use it to initialize configs, connections, default values, etc.

3. 💡 A Go file can have at most one `main()`, but multiple `init()`s.

> 🧪 "Init is like the secret backstage crew. You don’t see them during the show, but they’re the reason the lights come on."
