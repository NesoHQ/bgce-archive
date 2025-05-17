
# 🧠 Class 16: GoLang package scope 

---

##  ১.  Package কী?

**Package** হলো GoLang কোড গুছিয়ে রাখার একটি পদ্ধতি। একটি Package অনেকগুলো ফাইল থাকতে পারে, এবং সবগুলোর `package` নাম একই হলে তারা একে অপরের কোড ব্যবহার করতে পারে।

### ✅ নিয়ম:
- একই ফোল্ডারে সব `.go` ফাইলের `package` নাম এক হওয়া উচিত।
- `package main` হলে সেটি রানযোগ্য প্রোগ্রাম।
- অন্য প্যাকেজ যেমন `package mathlib` → লাইব্রেরি বা ইউটিলিটি হিসেবে ব্যবহৃত হয়।

---

##  ২. Scope এবং Export কী?

### 📌 কোন জায়গা থেকে কোন ফাংশন বা ভেরিয়েবল অ্যাক্সেস করা যাবে।

- যদি function নাম **ছোট হাতের অক্ষরে** শুরু হয় (যেমন `add`), তাহলে এটি **শুধুমাত্র সেই Packageর ভিতরেই ব্যবহার করা যাবে**।
- যদি **বড় হাতের অক্ষরে** শুরু হয় (যেমন `Add`), তাহলে সেটি **এক্সপোর্টেড** হয় এবং অন্য প্যাকেজ থেকেও ব্যবহার করা যায়।

---

##  ৩. কোড উদাহরণ

### 📁 `add.go`

```go
package main

import "fmt"

func add(n1, n2 int) {
    res := n1 + n2
    fmt.Println(res)
}
```

📌 `add()` function নাম ছোট হাতের অক্ষরে, তাই এটা শুধু `main` Packageর ভিতরেই কাজ করবে।

---

### 📁 `main.go`

```go
package main

var (
    a = 20
    b = 30
)

func main() {
    add(4,7)
}
```

📌 এখানে `add()` কল করা হয়েছে কারণ `add.go` ফাইল একই Package আছে (package main)।  
👉 রান করতে হবে:
```bash
go run main.go add.go
```

---

### 📁 কাস্টম প্যাকেজ `mathlib/math.go`

```go
package mathlib

import "fmt"

func Add(x int, y int) {
    z := x + y
    fmt.Println(z)
}
```

📌 এবার `Add()` function বড় হাতের অক্ষরে শুরু → **Exported**  
📌 `mathlib` নামে প্যাকেজ → একে অন্য ফোল্ডারে রাখতে হবে (যেমন: `mathlib/`)

---

### 📁 `main.go` (পরিবর্তিত ভার্সন)

```go
package main

import (
    "fmt"
    "example.com/mathlib"
)

var (
    a = 20
    b = 30
)

func main() {
    fmt.Println("Showing Custom Package")
    mathlib.Add(4,7)
}
```

📌 এখানে `mathlib.Add()` ব্যবহার করা হয়েছে কারণ `Add()` এক্সপোর্টেড এবং আমরা `import` করেছি।

---

##  ৪. মডিউল ব্যবস্থাপনা

### ✅ মডিউল শুরু করতে:
```bash
go mod init example.com/mathlib
```
---

##  ৫. Key Concepts

| বিষয় | ব্যাখ্যা |
|------|----------|
|  একই ফোল্ডার = একই প্যাকেজ | `main.go`, `add.go` → `package main` |
|  কাস্টম Package আলাদা ফোল্ডার | যেমন `mathlib/math.go` |
|  রান করতে হলে সব ফাইল দিতে হবে | `go run main.go add.go` |
|  বড় হাতের ফাংশন নাম = এক্সপোর্টেড | অন্য প্যাকেজ থেকে ব্যবহারযোগ্য |
| `go mod init` দিয়ে মডিউল শুরু হয় | কাস্টম প্যাকেজ ব্যবহারে দরকার |

---

## 🧠 সারাংশ:

- প্যাকেজ ব্যবহারে কোড পরিষ্কার ও পুনঃব্যবহারযোগ্য হয়।
- স্কোপ বুঝে কোড গঠন করলে সমস্যা হয় না।
- এক্সপোর্টেড ফাংশন ও মডিউল ব্যবস্থাপনা জানলে বড় প্রজেক্টেও কাজ সহজ হয়।