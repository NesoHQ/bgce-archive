# Class 23: Go-তে Functional Programming ধারণা

```go
package main

import "fmt"

func add(a int, b int) { // Parameter: a and b
    c := a + b
    fmt.Println(c)
}

func main() {
    add(2, 5) // 2 এবং 5 হলো argument
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

## 🧠 মূল ধারণাসমূহ

### ১. Parameter বনাম Argument

- **Parameter:** ফাংশনের ভিতরে ডিফাইন করা ভেরিয়েবল (যেমন: `a int`, `b int` in `add(a, b)`).
- **Argument:** ফাংশন কল করার সময় যেসব মান পাঠানো হয় (যেমন: `add(2, 5)` এ `2` এবং `5`).

---

### ২. First Order Function

- এমন ফাংশন যেটি অন্য কোনো ফাংশন নেয় না বা ফেরত দেয় না।
- উদাহরণ:
    - Named function: `func add(a, b int)`
    - Anonymous function: `func(a int, b int) { ... }`
    - IIFE: `func(a, b int) { ... }(5, 7)`
    - Function expression: `sum := func(a, b int) { ... }`

---

### ৩. Higher Order Function

- এমন ফাংশন যা অন্য ফাংশন নেয়, ফেরত দেয়, অথবা দুটোই করে।
- উদাহরণ:
    - `processOperation` একটি ফাংশন নেয়
    - `call()` একটি ফাংশন রিটার্ন করে

---

### ৪. Callback Function

- যেসব ফাংশন অন্য ফাংশনের ভিতরে পাঠানো হয় এবং পরে কল করা হয়।
- উদাহরণ: `processOperation(4, 5, add)` → এখানে `add` হলো callback function

---

### ৫. First-Class Citizen (Function)

- Go-তে ফাংশনগুলো first-class citizen অর্থাৎ:
    - ফাংশন ভেরিয়েবলে রাখা যায়
    - আর্গুমেন্ট হিসেবে পাঠানো যায়
    - অন্য ফাংশন থেকে রিটার্ন করা যায়

---

## 🧠 ধারণাগত প্রেক্ষাপট (Functional Programming Paradigm)

- Functional programming হলো গণিতের ফাংশনের মত হিসাব করা এবং mutable state পরিহার করা।
- অনুপ্রেরণা: গণিতের দুইটি লজিক ধারা —
    - First Order Logic → বস্তু ও তার প্রপার্টি
    - Higher Order Logic → ফাংশন এবং তার সম্পর্ক
- Haskell, Racket ইত্যাদি ভাষা ফাংশনাল প্রোগ্রামিং ভিত্তিক।
- Go এই ধারণা কিছুটা গ্রহণ করলেও মূলত এটি imperative/procedural ভাষা।

---

## 🖥️ CLI Visualization (Call Stack + Segment)

### ডেটা সেগমেন্ট:

- `add` (গ্লোবাল ফাংশন)
- `call` (ফাংশন রিটার্ন করে)
- `processOperation` (স্টোর করা ফাংশন)

---

### এক্সিকিউশন ফ্লো (স্ট্যাক ফ্রেম অনুযায়ী):

```
Call Stack:
┌──────────────────────────┐
│ main()                   │
│ ├── add(2, 5)            │ => ৭ প্রিন্ট করে
│ ├── processOperation     │
│ │   └── op(4, 5) → add   │ => ৯ প্রিন্ট করে
│ ├── call()               │ => add রিটার্ন করে
│ └── sum(4, 7)            │ => ১১ প্রিন্ট করে
└──────────────────────────┘
```

---

##  সারসংক্ষেপ

-  Go ফাংশনাল প্রোগ্রামিং এর অনেক ধারণা সমর্থন করে যেমন: first-class ও higher-order functions।
-  ফাংশনগুলোকে ভেরিয়েবলের মত ব্যবহার করা যায় — কোড মডুলার ও পরিষ্কার হয়।
-  Parameter বনাম Argument, First vs Higher Order Function, এবং Callback Function ভালোভাবে বোঝা clean এবং power-efficient কোড লেখার জন্য জরুরি।

[Author: @ifrunruhin12 @shahriar-em0n  Date: 2025-05-01 Category: interview-qa/class-wise ]
