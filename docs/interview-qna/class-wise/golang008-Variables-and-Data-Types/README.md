# Class 08: Variables and Data Types

> Go একটি strongly typed এবং statically typed compiled language, যার ফলে প্রতিটি ভ্যারিয়েবলের টাইপ স্পষ্টভাবে নির্ধারিত এবং গুরুত্বপূর্ণ

## 🧠 Variable Declare করার নিয়ম

Go তে ভেরিয়েবল declare করার তিনটি পদ্ধতি আছে:

### 1. Short Variable Declaration (`:=`)

Short declaration (`:=`) শুধুমাত্র ফাংশনের ভেতরে ব্যবহার করা যায়:

```go
func main() {
    a := 10
}
```

- টাইপ উল্লেখ করতে হয় না, Go নিজে থেকে টাইপ নির্ধারণ করে নেয় (Type Inference)৷

### 2. Explicit Type Declaration

```go
var x int = 10
```

- এখানে `x` explicitly `int` টাইপের বলে দেওয়া হয়েছে।

### 3. Implicit Type Declaration

```go
var a = 10
```

- টাইপ উল্লেখ করা হয়নি, তবে `a` এর টাইপ `int` হিসাবে নির্ধারিত হবে ১০ দেখে।

---

## 📘 Data Types

Go ভাষায় বিভিন্ন ধরনের ডেটা টাইপ আছে, যেগুলো মূলত 3 টি ভাগে ভাগ করা যায়।

## ১. Numeric Types

> Go-তে numeric types মূলত তিনটি ভাগে বিভক্ত থাকে।

### Integer Types

| Type   | Size                 | Description                                             |
| ------ | -------------------- | ------------------------------------------------------- |
| int    | platform-dependent   | সাধারন পূর্ণসংখ্যা                                      |
| int8   | 8-bit                | -128 to 127                                             |
| int16  | 16-bit               | -32,768 to 32,767                                       |
| int32  | 32-bit               | -2,147,483,648 to 2,147,483,647                         |
| int64  | 64-bit               | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| uint   | unsigned int         | 0 to 4,294,967,295                                      |
| uint8  | 0 to 255             | Unsigned 8-bit integer                                  |
| uint16 | 0 to 65535           | Unsigned 16-bit integer                                 |
| uint32 | 0 to 4 billion+      | Unsigned 32-bit                                         |
| uint64 | বিশাল ধনাত্মক সংখ্যা | Unsigned 64-bit                                         |

### Floating Point Types

| Type    | Description              |
| ------- | ------------------------ |
| float32 | 32-bit decimal           |
| float64 | 64-bit decimal (default) |

### Complex Types

| Type       | Description                |
| ---------- | -------------------------- |
| complex64  | Real + Imaginary (float32) |
| complex128 | Real + Imaginary (float64) |

---

## ২. String Type

- Represents text.

```go
var message string = "Hello, Go!"
```

---

## ৩. Boolean Type

- Holds either `true` or `false`.

```go
var isGoFun bool = true
```

## ✅ Summary Table

| Category | Example Type |
| -------- | ------------ |
| Numeric  | int, float64 |
| Boolean  | bool         |
| String   | string       |

---

## ✅ Valid Examples with Different Data Types

```go
a := 10           // int
a := 40.34        // float64
a := "Hello"      // string
a := true         // bool
a = false         // bool (reassigned)
```

> ⚠️ Note: একই স্কোপে একই ভেরিয়েবলকে বারবার `:=` দিয়ে declare করা যাবে না।

## 🔒 Constant Declaration

```go
const p = 100
```

> `const` দিয়ে declare করা ভেরিয়েবল পরিবর্তন করা যাবে না।

[Author : @shahriar-em0n Date: 2025-06-09 Category: interview-qa/class-wise ]
