[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-20
**Category:** interview-qa/internal_memory
**Tags:** [go, internal_memory]
]


# 🧠 Internal Memory in Go (গো-তে ইন্টারনাল মেমোরি)

Go প্রোগ্রামে মেমোরি ব্যবস্থাপনা খুবই গুরুত্বপূর্ণ একটি বিষয়। এতে বুঝতে সহজ হয় যে Go রানটাইম কিভাবে মেমোরি অ্যালোকে করে এবং কোড এক্সিকিউট করে। মূলত এই মেমোরি ব্যবস্থাপনা চারটি ভাগে বিভক্ত: **Code Segment**, **Data Segment**, **Stack**, এবং **Heap**।

---

## 📦 মেমোরি সেগমেন্টগুলো

### 1. **Code Segment**

* এখানে প্রোগ্রামের সব কম্পাইল করা ইনস্ট্রাকশন থাকে (যেমন ফাংশন, মেথড কল ইত্যাদি)।
* এটি শুধুমাত্র-পাঠযোগ্য (read-only), এবং প্রোগ্রাম শুরু হওয়ার সময় মেমোরিতে লোড হয়।
* রানটাইমে এটিকে পরিবর্তন করা যায় না।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

এই উদাহরণে `main` ফাংশন এবং `fmt.Println` ফাংশন—এই দুইটাই code segment-এ থাকে।

---

### 2. **Data Segment**

* এখানে প্রোগ্রামের সব গ্লোবাল এবং স্ট্যাটিক ভেরিয়েবল থাকে।
* এই ভেরিয়েবলগুলো প্রোগ্রাম শুরু হওয়ার আগেই ইনিশিয়ালাইজ হয় এবং প্রোগ্রাম চলাকালীন পর্যন্ত মেমোরিতে থাকে।

**উদাহরণ:**

```go
package main

import "fmt"

var globalVar = "I am a global variable"

func main() {
    fmt.Println(globalVar)
}
```

এখানে `globalVar` data segment-এ সংরক্ষিত থাকে।

---

### 3. **Stack Segment**

* Stack ব্যবহার হয় ফাংশনের লোকাল ভেরিয়েবল, ফাংশন কল ও কন্ট্রোল ফ্লো হ্যান্ডেল করার জন্য।
* যখনই একটি ফাংশন কল করা হয়, তখন stack segment-এ একটি stack frame তৈরি হয়।
* প্রতিটি frame এ সেই ফাংশনের লোকাল ভেরিয়েবল ও রিটার্ন ঠিকানা (return address) থাকে।
* Stack LIFO (Last In, First Out) পদ্ধতিতে কাজ করে।

**উদাহরণ:**

```go
package main

import "fmt"

func add(a int, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println("Result:", result)
}
```

এখানে যখন `add` ফাংশন কল করা হয়, তখন তার জন্য একটি stack frame তৈরি হয় যাতে `a` এবং `b` ভেরিয়েবল থাকে।

---

### 4. **Heap Segment**

* Heap ব্যবহার হয় ডাইনামিক মেমোরি অ্যলোকেশনের জন্য।
* যে মেমোরি heap-এ থাকে, তা গারবেজ কালেক্টর দ্বারা ম্যানেজ করা হয়।
* Stack ভেরিয়েবলের তুলনায় heap ভেরিয়েবলের লাইফটাইম বেশি হয়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
    ptr := new(int) // Heap-এ মেমোরি অ্যলোকেট করে
    *ptr = 42
    fmt.Println("Value:", *ptr)
}
```

এখানে `ptr` যেটি `new(int)` দ্বারা তৈরি, সেটা heap-এ মেমোরি অ্যলোকেট করে এবং `42` সংরক্ষণ করে।

---

## 🚀 Init Function এবং Execution Flow

Go প্রোগ্রাম শুরু হলে প্রথমে `init` ফাংশনগুলো এক্সিকিউট হয়। এগুলো `main` ফাংশনের আগেই চলে এবং সাধারণত গ্লোবাল ভেরিয়েবল ইনিশিয়ালাইজ করার জন্য ব্যবহৃত হয়।

**উদাহরণ:**

```go
package main

import "fmt"

var globalVar string

func init() {
    globalVar = "Initialized in init function"
    fmt.Println("Init function executed")
}

func main() {
    fmt.Println(globalVar)
}
```

এখানে `init` ফাংশন `globalVar` ইনিশিয়ালাইজ করে, তারপর `main` ফাংশন এক্সিকিউট হয়।

---

## 📑 সারাংশ

| সেগমেন্ট          | কী থাকে                                  |
| ----------------- | ---------------------------------------- |
| **Code Segment**  | প্রোগ্রামের সব ফাংশন ও ইনস্ট্রাকশন       |
| **Data Segment**  | গ্লোবাল এবং স্ট্যাটিক ভেরিয়েবল           |
| **Stack Segment** | ফাংশন কল এবং লোকাল ভেরিয়েবল              |
| **Heap Segment**  | ডাইনামিক মেমোরি (runtime এ অ্যলোকেট হয়)  |
| **Init Function** | main-এর আগে রান হয় এবং ইনিশিয়াল কাজ করে |

---

## ⚙️ Code Execution-এর ধাপ

1. কোড কম্পাইল করে বাইনারি তৈরি করুন:

   ```bash
   go build main.go
   ```
2. বাইনারি ফাইল রান করুন:

   ```bash
   ./main
   ```

---

## Internal Memory Execution (ইন্টারনাল মেমোরি এক্সিকিউশন)

### Code Segment

* এটি প্রোগ্রামের কম্পাইল করা কোড ধারণ করে।
* Code segment শুধুমাত্র read-only; রানটাইমে এটি পরিবর্তন করা যায় না।
* Program execute হলে code segment মেমোরিতে লোড হয়।
* Code segment দুইটি অংশে বিভক্ত:

  1. Text segment: প্রোগ্রামের কম্পাইল করা কোড ধারণ করে।
  2. Data segment: প্রোগ্রামের initialized এবং uninitialized ডেটা ধারণ করে।
* Code segment একটি static memory allocation।
* এটি compile time-এ allocate হয় এবং এর সাইজ নির্দিষ্ট (fixed)।
* এটি program code এবং constants সংরক্ষণের জন্য ব্যবহৃত হয়।
* Code segment সকল প্রক্রিয়ার (processes) মধ্যে শেয়ার করা হয়।
* Code segment writable নয় এবং রানটাইমে পরিবর্তনযোগ্য নয়।

### Data Segment

* এটি global variables এবং constants সংরক্ষণ করে।
* Data segment দুইটি অংশে বিভক্ত:

  1. Initialized data segment: Initialized global variables এবং constants ধারণ করে।
  2. Uninitialized data segment: Uninitialized global variables এবং constants ধারণ করে।
* Data segment একটি static memory allocation।
* Compile time-এ এটি allocate হয় এবং এর সাইজ নির্দিষ্ট থাকে।
* এটি global variables এবং constants এর জন্য ব্যবহৃত হয়।

### Stack Segment

* এটি local variables এবং function calls ধারণ করে।
* প্রত্যেকটি function call একটি নতুন stack frame তৈরি করে।
* একটি function call শেষ হলে, তার stack frame stack থেকে সরিয়ে ফেলা হয়।
* Stack function call এবং return এর সময় grow এবং shrink করে।
* Stack হলো একটি LIFO (Last In First Out) data structure।
* Stack ব্যবহৃত হয় function calls, local variables এবং control flow এর জন্য।
* এটি একটি dynamic memory allocation।
* Stack runtime-এ allocate হয় এবং প্রয়োজনে grow এবং shrink করতে পারে।
* Stack processes-এর মধ্যে শেয়ার করা হয় না।
* এটি writable এবং runtime-এ পরিবর্তন করা যায়।
* Stack মূলত local variables এবং function calls এর জন্য ব্যবহৃত হয়।

### Heap Segment

* এটি dynamically allocated memory ধারণ করে।
* Heap একটি dynamic memory allocation।
* এটি runtime-এ allocate হয় এবং প্রয়োজনে grow এবং shrink করতে পারে।
* Heap processes-এর মধ্যে শেয়ার করা যায়।
* Heap writable এবং runtime-এ পরিবর্তন করা যায়।
* Heap ব্যবহার করা হয় dynamically allocated memory এর জন্য।
---

### 🧮 Escape Analysis

Go এর কম্পাইলার নির্ধারণ করে যে কোন ভেরিয়েবল **stack** এ থাকবে আর কোনটা **heap** এ যাবে।

| অবস্থা                                                | কোথায় সংরক্ষণ হবে |
| ----------------------------------------------------- | ------------------ |
| ফাংশনের ভেতর ডিক্লেয়ার্ড → ফাংশনের বাইরে না পাঠানো   | **Stack**          |
| ফাংশনের বাইরে ডিক্লেয়ার্ড                            | **Data Segment**   |
| ফাংশনের ভেতরে ডিক্লেয়ার্ড → রিটার্ন করে বাইরে পাঠানো | **Heap**           |
| ফাংশনের ভেতরে ডিক্লেয়ার্ড → রিটার্ন করে বাইরে পাঠানো নয় | **Stack**           |

**উদাহরণ:**

```go
package main

import "fmt"

func createPointer() *int {
    num := 42
    return &num // Heap-এ যায় কারণ এটা রিটার্ন হচ্ছে
}

func main() {
    ptr := createPointer()
    fmt.Println(*ptr)
}
```

---

## ❓ Common Interview Questions (FAQs)

### 1. **Stack আর Heap-এর মধ্যে পার্থক্য কী?**

**উত্তর:**
Stack ফাংশন কল ও লোকাল ভেরিয়েবলের জন্য ব্যবহৃত হয়, খুব দ্রুত কাজ করে কিন্তু মেমোরি সীমিত। Heap ডাইনামিক অ্যলোকেশনের জন্য, তুলনামূলক ধীর কিন্তু বেশি মেমোরি দেয়।

---

### 2. **Go কিভাবে মেমোরি ম্যানেজ করে?**

**উত্তর:**
Go-এর গারবেজ কালেক্টর এমন ভেরিয়েবলগুলো অপসারণ করে যেগুলো আর দরকার নেই।

---

### 3. **Escape Analysis কী?**

**উত্তর:**
Escape analysis নির্ধারণ করে কোন ভেরিয়েবল Stack-এ থাকবে, আর কোনটা Heap-এ যাবে।

---

### 4. **init ফাংশনের কাজ কী?**

**উত্তর:**
`init` ফাংশন গ্লোবাল ভেরিয়েবল ইনিশিয়ালাইজ করে এবং `main` ফাংশনের আগে রান হয়।

---

### 5. **Code Segment runtime এ পরিবর্তন করা যায় কি?**

**উত্তর:**
না, code segment শুধুমাত্র read-only এবং runtime এ পরিবর্তনযোগ্য নয়।

---

### 6. **Stack memory বেশি হলে কী হয়?**

**উত্তর:**
Stack overflow এরর দেখা যায়।

---

### 7. **Go-তে ডাইনামিক মেমোরি অ্যলোকেশন কিভাবে হয়?**

**উত্তর:**
`new` এবং `make` ফাংশনের মাধ্যমে হয়, এবং গারবেজ কালেক্টর তা ম্যানেজ করে।

---

### 8. **new আর make-এর পার্থক্য কী?**

**উত্তর:**

* `new`: শুধুমাত্র মেমোরি অ্যলোকেট করে, পয়েন্টার রিটার্ন করে।
* `make`: slice, map, channel ইনিশিয়ালাইজ করে।

---


### 9. **গ্লোবাল ভেরিয়েবল কোথায় থাকে?**

**উত্তর:**
Data Segment-এ।

---

### 10. **Garbage Collector-এর ভূমিকা কী?**

**উত্তর:**
যে মেমোরিগুলো আর দরকার নেই, সেগুলো স্বয়ংক্রিয়ভাবে রিমুভ করে দেয়, মেমোরি লিক প্রতিরোধ করে।

### Escape Analysis এর উদাহরণ

```go
package main

import "fmt"

func createPointer() *int {
    num := 42
    return &num // Escapes to heap
}

func main() {
    ptr := createPointer()
    fmt.Println(*ptr)
}
```
এখানে `num` ভেরিয়েবল heap এ escape করে কারন এটা `createPointer` এ রিটার্ন করে