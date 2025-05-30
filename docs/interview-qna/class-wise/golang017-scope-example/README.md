
# 🧠 Class 17: Scope with another boring example 

---

## 🧑‍💻 Code Example :

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

---

## 🧠 মূল ধারণাসমূহ

### ✅ অর্ডার ম্যাটার করে না (প্যাকেজ-লেভেলের জন্য)

Go তে ফাংশন এবং গ্লোবাল ভ্যারিয়েবলগুলোর অর্ডার (ক্রম) গুরুত্বপূর্ণ নয়। মানে `main()` ফাংশনের পরেও যদি অন্য ফাংশন বা ভ্যারিয়েবল ডিক্লেয়ার করা হয়, Go ঠিকই সব চিনে নেয় এবং কম্পাইল করে।

### 🤓 Go ≠ ফাংশনাল প্রোগ্রামিং প্যারাডাইম

Go কিছু দারুণ ফিচার ধার করেছে ফাংশনাল ল্যাঙ্গুয়েজ থেকে (যেমন: ফার্স্ট-ক্লাস ফাংশন, ক্লোজার ইত্যাদি), কিন্তু Go নিজে ফাংশনাল প্রোগ্রামিং ল্যাঙ্গুয়েজ নয়।

### ⚖️ তাহলে Go কোন প্যারাডাইমে পড়ে?

Go হলো একাধিক প্যারাডাইম সাপোর্ট করে এমন ভাষা, তবে এর মূল স্টাইল হচ্ছে **imperative** এবং **procedural**। এটি ক্লাসিক OOP-এর বদলে **struct-based composition** কে গুরুত্ব দেয়।

> এটি ডিজাইন করা হয়েছে যাতে ভাষাটি হয়:

-  সহজ  
-  ভবিষ্যৎ অনুমানযোগ্য (Predictable)  
-  সহজে পড়া যায় এমন (Readable)

তুমি চাইলে functional-এর মতো স্টাইলে কোড লিখতে পারো, কিন্তু Go কে ডিজাইন করা হয়নি অনেক জটিল functional abstraction-এর জন্য।

[Author: @ifrunruhin12 @shahriar-em0n  Date: 2025-05-01 Category: interview-qa/class-wise ]
