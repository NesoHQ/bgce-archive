
## Class 07: Hello, World!
---

### 📄 কোড:
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

---

## 🔍 ব্যাখ্যা:

### ✅ `package main`
- Go-তে প্রতিটি প্রোগ্রাম একটি প্যাকেজের অংশ।
- `main` প্যাকেজ মানে এটি একটি **executable program**  এটি চালানো যাবে।
- যদি `main` না দাও, তাহলে Go বুঝবে এটা লাইব্রেরি।

---

### ✅ `import "fmt"`
- `fmt` Go এর স্ট্যান্ডার্ড প্যাকেজ, যেটা **input/output** এর কাজ করে।
- এখানে আমরা `fmt.Println` ব্যবহার করেছি স্ক্রিনে কিছু প্রিন্ট করতে।

---

### ✅ `func main() { ... }`
- `main()` ফাংশন হলো Go প্রোগ্রামের **entry point**।
- প্রোগ্রাম চালালে প্রথমেই এই ফাংশনটি রান হয়।

---

### ✅ `fmt.Println("Hello, World!")`
- এটি Go এর স্ট্যান্ডার্ড ফাংশন যা স্ক্রিনে `"Hello, World!"` প্রিন্ট করে।
- `Println` মানে print line  এটি নতুন লাইনে প্রিন্ট করে।

---

## 🧠 মনে রাখার মতো কিছু বিষয়:
| বিষয় | ব্যাখ্যা |
|------|----------|
| `package main` | executable প্রোগ্রামের জন্য বাধ্যতামূলক |
| `import "fmt"` | I/O operations এর জন্য দরকারি |
| `func main()` | Go প্রোগ্রামের execution শুরু এখান থেকে |
| `fmt.Println()` | কনসোলে কিছু প্রিন্ট করার জন্য ব্যবহৃত হয় |

---

## 🚀 রান করার নিয়ম (Go ইনস্টল থাকার পর):
```bash
go run (file name).go
```

---
### Extra :

- Go একটি compiled language, যার মানে হলো কোড compile হয়ে এক্সিকিউটেবল ফাইল তৈরি করে।

- Go এর compiler খুব দ্রুত এবং lightweight।

- Go concurrency-friendly, অর্থাৎ একই সাথে অনেক কাজ (goroutines) সহজে হ্যান্ডেল করতে পারে।

- Go এ garbage collection থাকে, যা অপ্রয়োজনীয় মেমোরি নিজে থেকে ম্যানেজ করে।

- Go এর syntax খুব সহজ এবং readable, যা নতুনদের জন্য শেখা সহজ করে তোলে।

[Author : @shahriar-em0n  Date: 2025-06-09 Category: interview-qa/class-wise ]