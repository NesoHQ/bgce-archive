# Class 21 – expression, anonymous function ও IIFE - in go

## 🎥 ভিডিও নাম: anonymous function, expression ও IIFE

## 🔤 Code Written in This Class

```go
// anonymous function
// IIFE - ইমিডিয়েটলি ইনভোকড function expression

package main

import "fmt"

func main() {
    // anonymous function
    func(a int, b int) {
        c := a + b
        fmt.Println(c)
    }(5, 7) // IIFE
}

func init() {
    fmt.Println("আমি সবার আগে কল হব")
}
```

## 🧠 মূল ধারণাসমূহ

###  Go-তে Expression (expression)

expression হলো যেকোনো code snippet যা কোনো মান (value) রিটার্ন করে।

example:

```go
a + b          // একটি expression
func(x, y){}   // একটি function expression
```

expression মান হিসেবে ব্যবহার, pass অথবা সাথে সাথেই execute করা যায়।

###  anonymous function

anonymous function হলো নামবিহীন function।

```go
func(a, b int) int {
    return a + b
}
```

✅ এটি ভ্যারিয়েবল হিসেবে সংরক্ষণ, আর্গুমেন্ট হিসেবে pass বা সাথে সাথেই কল করা যায়।

### ⚡ IIFE (Immediately Invoked Function Expression)

IIFE হলো এমন একটি anonymous function যেটি ডিক্লেয়ার করার সাথেসাথে execute হয়।

```go
func(a int, b int) {
    // কাজ
}(5, 7)
```

**ব্যবহার:** ছোট লজিক ব্লক তাৎক্ষণিক চালানোর জন্য উপযোগী, নতুন নাম না দিয়েই।

### 🖥️ CLI-  execution vizualization

```
=========== compilation ধাপ =============
init() function খুঁজে পাওয়া গেছে ✅
main() function খুঁজে পাওয়া গেছে ✅

=========== এক্সিকিউশন ধাপ =============

🔁 init() প্রথমে চলে
→ আউটপুট: আমি সবার আগে কল হব

🧠 ডেটা সেগমেন্ট:
(কোনো গ্লোবাল ভ্যারিয়েবল নেই)

📚 stack frame:
┌─────────────────────┐
│    main()           │
│ ┌─────────────────┐ │
│ │  anonymous function │ │
│ └─────────────────┘ │
└─────────────────────┘

main() একটি IIFE কল করে:
→ 5 এবং 7 pass করে
→ ভিতরে: c := 5 + 7 = 12
→ output: 12

=========== execution সম্পূর্ণ ============
```

### 🧵 TL;DR (সংক্ষেপে)

- []  expression- মান রিটার্ন করে, এসাইন বা execute করা যায়।
- []  anonymous function- দ্রুত লজিক ব্লক চালাতে ব্যবহৃত হয়।
- []  IIFE- ডিফাইন এবং execute একসাথে — একবারের কাজের জন্য দারুন!