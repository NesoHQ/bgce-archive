# 💡 Interview Question: Variable Shadowing in Go

## 🧪 Code Example

```go
package main

import "fmt"

var a = 10

func main() {
	age := 30

	if age > 18 {
		a := 47        // 👇 Shadows the global `a` ONLY inside this `if` block
		fmt.Println(a) // ➜ 47
	}

	fmt.Println(a)     // ➜ 10 (prints the global `a`)
}
```
## 📌 Takeaways:

1. 🔒 Variable shadowing occurs when a local variable has the same name as a variable in an outer scope.

2. ⛔ Go won't throw an error — it’ll just use the innermost version in the current scope.

3. 📦 Global `a` is untouched and printed outside the `if` block.

4. ✅ This behavior is intentional and useful for encapsulation and temporary overrides.

## 🧠 Memory & Stack Animation — Step by Step
```
// ⏱ Program Start
📦 Data Segment:
┌─────────────┐
│ global a=10 │ ◄── stays alive till program ends
└─────────────┘

// 🚀 main() gets called
📚 Stack:
┌────────────────────────────┐
│ 🧩 main() Stack Frame      │
│   └── age = 30             │
└────────────────────────────┘

--- age > 18 is TRUE, so we enter the `if` block ---

🧱 New block scope begins inside main()
📚 Stack:
┌────────────────────────────┐
│ 🧩 main() Stack Frame      │
│   └── age = 30             │
│   🔸 a (shadows global) =47│ ◄── new `a` shadows the global
└────────────────────────────┘

🖨️ fmt.Println(a)
📤 Output: 47 ✅

--- if block ends, block-scope a is destroyed ---

📚 Stack:
┌────────────────────────────┐
│ 🧩 main() Stack Frame      │
│   └── age = 30             │
└────────────────────────────┘

🖨️ fmt.Println(a)
📤 Output: 10 ✅ (Back to global `a`)

--- main() ends, stack is popped ---

📚 Stack:
(empty)

🧼 Program exits
```
## 📌 Visualization Summary

-[] 🧠 Global variables (like a = 10) live in the data segment.

-[] 🧵 Local variables (like age or shadowed a) live in the stack.

-[] 🔄 When a new scope is entered (if, for, function block), it pushes new variables to the stack.

-[] ⛓️ Once the block ends, the shadowed variable gets popped and memory is freed.

-[] 🧼 At the end, the stack is cleared, but the data segment lives throughout the whole execution.

[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/arrays
]
