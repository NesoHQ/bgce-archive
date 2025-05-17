# 🧠 Class 20: Init Function

📺 **Video Topic**: `init()` Function in Go

## 🔤 Code Written in This Class

### ✅ Example 1

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Init Function!")
}

func init() {
    fmt.Println("I am the function that is executed first")
}
```

### ✅ Example 2

```go
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

- `init()` একটি বিশেষ Go function যা `main()` এর আগে automatically run হয় ।
- একাধিক ফাইল এবং প্যাকেজে একাধিক `init()` থাকতে পারে। চালানোর ক্রম:
  - Dependency packages আগে
  - তারপর ফাইল অর্ডার অনুযায়ী (উপরে থেকে নিচে)
- `init()` ম্যানুয়ালি কল করা যায় না। এটি প্রোগ্রাম শুরু হওয়ার আগেই চলে।

---

## 🧠 CLI Memory & Execution Visualization (Example 1)

```text
🛠 Compile Time: Go detects init()
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

---

## 🔍 CLI Visualization: Execution & Memory Layout (Example 2)

```text
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
```

---

## 📌 Summary

- Global variable `a` প্রোগ্রাম চলার আগেই initialized হয়।
- `init()` প্রথমে execute হয়:
  - `a = 10` পড়ে
  - `a = 20` করে আপডেট করে
- `main()` updated value দেখায়: `20`

> এটি একটি ক্লাসিক উদাহরণ, যেখানে `init()` মূল প্রোগ্রাম চলার আগে runtime environment প্রস্তুত করে।

---

## ⚡ Quick Recap

-  `init()` সবসময় `main()` এর আগে চলে, এমনকি যদি কোডে পরে লেখা থাকে।
-  এটি config, database connection, default value ইত্যাদি initialize করার জন্য ব্যবহার করা হয়।
-  একটি Go ফাইলে একটাই `main()` থাকতে পারে, কিন্তু একাধিক `init()` থাকতে পারে।

>  Init is like the secret backstage crew. You don’t see them during the show, but they’re the reason the lights come on.

[Author: @ifrunruhin12 @shahriar-em0n  Date: 2025-05-01 Category: interview-qa/class-wise ]
