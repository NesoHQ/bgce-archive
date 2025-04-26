# Class 26: Closure & Go Internal Memory Deep Dive 💡

Welcome to Class 26, where we uncover the magic behind closures in Go, escape analysis, and how memory is managed under the hood! 🧠🔥

---

## 🧾 The Code

```go
package main

import "fmt"

const a = 10
var p = 100

//Closure
func outer(money int) func() {
	age := 30
	fmt.Println("Age =", age)

	show := func() {
		money = money + a + p
		fmt.Println(money)
	}

	return show
}

func call() {
	incr1 := outer(100)
	incr1() // money = 100 + 10 + 100 = 210
	incr1() // money = 210 + 10 + 100 = 320

	incr2 := outer(100)
	incr2()
	incr2()
}

func main() {
	call()
}

func init() {
	fmt.Println("=== Bank ===")
}
```

---

## 🔍 Key Concepts

### 🔒 What is a Closure?
A **closure** is a function that references variables from outside its own scope. In this case:

```go
show := func() {
    money = money + a + p
    fmt.Println(money)
}
```
`show` forms a closure by capturing the `money` variable defined in `outer()`.

### 🧠 Why is Closure Important?
Closures let you encapsulate logic along with state. This is why `incr1()` and `incr2()` maintain separate `money` values even though they use the same function.

### 🧮 Stack vs Heap
- **Stack**: Fast memory, used for function calls and local variables.
- **Heap**: Used when variables need to persist beyond the function call (like in closures!).

Because `money` needs to stick around *after* `outer()` returns, **escape analysis** detects this and allocates `money` on the heap.

### 🧪 What is Escape Analysis?
Escape analysis is the process that the **Go compiler** uses during the **compilation phase** to determine whether variables can be safely allocated on the stack or must go to the heap.

- ✅ If a variable is used *only* inside a function, it's put on the **stack**.
- 🚀 If a variable is used *outside* (like in a returned closure), it's moved to the **heap**.

### 🧱 Memory Segments
| Segment        | What's Stored                         |
|----------------|----------------------------------------|
| Code Segment   | Compiled instructions (functions)      |
| Data Segment   | Global and static variables (`a`, `p`) |
| Stack          | Local variables (`age`)                |
| Heap           | Escaping variables (`money`)           |

---

## 🧠 Visualization

### CLI-Style Memory Layout

```
┌─────────────────────────────┐
│       Code Segment          │
│-----------------------------│
│ main, call, init, outer,    │
│ anonymous show function     │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│       Data Segment          │
│-----------------------------│
│ const a = 10                │
│ var p = 100                 │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│           Stack             │
│-----------------------------│
│ outer() frame               │
│   age = 30                  │
│   return address            │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│            Heap             │
│-----------------------------│
│ money = 100 (for incr1)     │
│ money = 100 (for incr2)     │
└─────────────────────────────┘
```

Each closure has its own `money` on the heap. Every call to `outer(100)` results in a new memory block being allocated.

### Garbage Collector’s Role 🧹
When the closure is no longer referenced (e.g., `incr1` or `incr2` goes out of scope), the **Garbage Collector** detects that the heap memory (e.g., `money`) is unreachable. It then safely reclaims that memory so your program doesn’t become a memory hoarder. This is vital for maintaining efficiency, especially when many closures are involved.

GC is triggered automatically and runs concurrently with your program. It uses a combination of **mark-and-sweep** and **concurrent garbage collection techniques** to do this efficiently.

---

## 🧠 TL;DR
- Closures can capture and remember variable state 🔁
- Escape analysis figures out which variables must live on the heap 📦
- Stack is temporary, heap is persistent (with GC 🧹)
- Go separates memory into Code, Data, Stack, Heap — each with its role 🧩
- GC ensures unused heap memory (like old closure data) is recycled ♻️

---


