# Class 24 — Go Internal Memory (Code, Data, Stack, Heap)

### 🧠 Topics Covered
This class dives deep into how Go programs are structured in memory. Concepts explained include:

- **Code Segment**: Stores compiled instructions (functions).
- **Data Segment**: Stores global/static variables (like `var a = 10`).
- **Stack**: Stores local function variables. Each function call creates a new *stack frame*.
- **Heap**: Used for dynamically allocated memory (we'll explore this more later).
- **Garbage Collector**: Runs on the heap. Cleans up memory that's no longer in use.

---

### 📜 Code from Class 24

```go
package main

import "fmt"

var a = 10

func add(x, y int) {
	z := x + y
	fmt.Println(z)
}

func main() {
	add(5,4)
	add(a,3)
}

func init() {
	fmt.Println("Hello")
}
```

## 🔍 Code Execution Flow & Memory Layout

```pgsql
           ┌────────────────────────────────────────────┐
           │               Code Segment                 │
           │--------------------------------------------│
           │ Functions: init, main, add                 │
           └────────────────────────────────────────────┘
                          │
                          ▼
           ┌────────────────────────────────────────────┐
           │              Data Segment                  │
           │--------------------------------------------│
           │ Global Variable: a = 10                    │
           └────────────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────────┐
              │          Stack             │
              │----------------------------│
              │ main() Stack Frame         │
              │   - Calls add(5, 4)        │
              │       - x=5, y=4           │
              │       - z=9                │
              │   - Calls add(10, 3)       │
              │       - x=10, y=3          │
              │       - z=13               │
              └────────────────────────────┘
                          │
                          ▼
           ┌────────────────────────────────────────────┐
           │               Heap (Unused here)           │
           │       (Managed by the Garbage Collector)   │
           └────────────────────────────────────────────┘
```
## ⚙️ Execution Order

1. `init()` is run automatically before `main()` → prints:
```nginx
Hello
```
2. `main()` runs and calls:
    -[] `add(5, 4)` → prints:
    ```
    9
    ```
    -[] `add(a, 3)` → uses `a = 10` → prints:
    ```
    13
    ```

## 📌 Key Concepts Recap

Concept | Meaning
Code Segment | Where all functions live after compilation
Data Segment | Stores global variables
Stack | Temporary memory for function execution (local vars, params)
Heap | For dynamic memory (we didn't use heap explicitly here)
Garbage Collector | Automatically manages memory on the heap
init() Function | Special function in Go — runs before main()

> 🧼 Garbage Collector Insight:
> Go’s GC sits on the heap and sweeps unused allocations to keep memory clean. You won't notice it in this small program, but it's your bestie when your app scales.

