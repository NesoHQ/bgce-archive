# 📘 CLass 22 – Go Function Expression & Shadowing

🎥 **ভিডিও নাম:** Function Expression Example

---

## ✅ Example 1:  
```go
package main

import "fmt"

// গ্লোবাল ফাংশন এক্সপ্রেশন
var add = func(x, y int) {
    fmt.Println(x + y)
}

func main() {
    add(4, 7) // গ্লোবাল `add` কল হচ্ছে

    // লোকাল ভেরিয়েবলে ফাংশন এক্সপ্রেশন অ্যাসাইন করা
    add := func(a int, b int) {
        c := a + b
        fmt.Println(c) কোড ২
    }

    add(2, 3) // এখন লোকাল `add` কল হচ্ছে
}

func init() {
    fmt.Println("আমি প্রথমে কল হব")
```

---

## 🧠 মূল ধারণাসমূহ

### 🔧 Function Expression

যখন কোনো ফাংশনকে একটি ভেরিয়েবলে সংরক্ষণ করা হয়। এর মাধ্যমে আমরা —

- logic একটি ভেরিয়েবলে রাখতে পারি
- ফাংশনকে ফার্স্ট-ক্লাস সিটিজেন হিসেবে ব্যবহার করতে পারি
- inline বা anonymous ফাংশন তৈরি করতে পারি

**উদাহরণ:**

```go
add := func(a int, b int) {
    fmt.Println(a + b)
}
```

---

### 🧱 Shadowing

যখন একটি ছোট স্কোপে (লোকাল স্কোপে) থাকা ভেরিয়েবলের নাম বড় স্কোপে থাকা একই নামের ভেরিয়েবলকে ঢেকে ফেলে বা “শ্যাডো” করে।

```go
add := func(a int, b int) {...}
```

এই `add` লোকাল স্কোপে গ্লোবাল `add` কে ঢেকে দেয়।

---

### 🖥️  CLI-  execution vizualization

```
========== কম্পাইলেশন ফেজ ==========
✔ init() পাওয়া গেছে
✔ main() পাওয়া গেছে
✔ গ্লোবাল `add` ফাংশন অ্যাসাইন করা হয়েছে

========== এক্সিকিউশন শুরু ==========
init():
→ প্রিন্ট করে: আমি প্রথমে কল হব

main():
→ গ্লোবাল `add(4, 7)` → প্রিন্ট: 11

main() এর ভিতরের লোকাল স্কোপ:
┌──────── Stack Frame ───────┐
│ main()                     │
│ ┌──────────────┐          │
│ │ add (লোকাল)  │────────┐ │
│ └──────────────┘        │ │
└─────────────────────────┘ │
       (গ্লোবালটিকে ঢেকে দেয়) ◄───┘

→ লোকাল `add(2, 3)` → প্রিন্ট: 5

========== এক্সিকিউশন শেষ ==========
```

---

## ❌ Example  2: কম্পাইল হয় না

```go
package main

import "fmt"

// গ্লোবাল ফাংশন এক্সপ্রেশন
var add = func(x, y int) {
    fmt.Println(x + y)
}

func main() {
    adder(4, 7) // ❌ ERROR: undefined: adder

    adder := func(a int, b int) {
        c := a + b
        fmt.Println(c)
    }

    add(2, 3)
}

func init() {
    fmt.Println("আমি প্রথমে কল হব")
}
``` 

---

## ❌ কেন এটা কাজ করে না?

এই লাইনটি:

```go
adder(4, 7)
```

ডিক্লেয়ারেশনের উপরে আছে:

```go
adder := func(a int, b int) { ... }
```

🛑 **সমস্যা: Temporal Dead Zone**

Go তে তুমি কোনো ভেরিয়েবলকে তার ডিক্লেয়ারেশনের আগে ব্যবহার করতে পারো না even একই ব্লকের মধ্যেও।

তাই `adder` ব্যবহার করার সময়ে সেটি এখনো ডিক্লেয়ার হয়নি।

ভুল:  
```bash
./main.go:10:2: undefined: adder
```

---

## 📚 TL;DR

| ধারণা | অর্থ |
|-------|------|
| Function Expression | একটি ভেরিয়েবলে সংরক্ষিত ফাংশন |
| Anonymous Function | নামবিহীন ফাংশন |
| Shadowing | লোকাল ভেরিয়েবল গ্লোবালটিকে ঢেকে দেয় |
| Temporal Dead Zone | ডিক্লেয়ারেশনের আগে কোনো ভেরিয়েবল ব্যবহার করা যায় না |
| IIFE vs Assignment | IIFE সাথে সাথে চলে; অ্যাসাইনমেন্ট পরে কল করতে হয় |

[Author: @ifrunruhin12 @shahriar-em0n  Date: 2025-05-01 Category: interview-qa/class-wise ]
