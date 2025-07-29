[
**Author:** @mahabubulhasibshawon
**Date:** 2025-07-29
**Category:** interview-qa/topic-wise/defer
**Tags:** [go, defer, channels]
]

# 🔁 `defer` কী? (What is `defer` in Go)

Go-তে `defer` এমন একটি স্টেটমেন্ট যা নির্দিষ্ট কোনো ফাংশন/স্টেটমেন্টের এক্সিকিউশনকে বিলম্বিত (delay) করে যতক্ষণ না আশেপাশের (enclosing) ফাংশনটি return করে বা শেষ হয়।

📌 সহজভাবে বললে:

> `defer` মানে: "এই কাজটা পরে করো, ফাংশনের একেবারে শেষে গিয়ে করো।"

---

## 📦 উদাহরণ (Basic Example)

```go
package main
import "fmt"

func greet() {
	defer fmt.Println("World") // পরে চালাবে
	fmt.Println("Hello")       // আগে চালাবে
}

func main() {
	greet()
}
```

**Output:**

```
Hello
World
```

> `fmt.Println("World")` একেবারে শেষে execute হয়েছে, কারণ সেটি `defer` করা হয়েছে।

---

## ⚙️ আভ্যন্তরীণভাবে কী ঘটে? (What happens under the hood)

* যখন `defer` কোনো ফাংশনের ভেতরে ব্যবহার করা হয়, তখন Go কম্পাইলার defer স্টেটমেন্টগুলোকে compile time এ detect করে এবং Go runtime সেই স্টেটমেন্ট বা ফাংশন কলটি একটি **stack**-এ রেখে দেয়।
* যখন ফাংশনটি শেষ হয় (return, panic বা শেষ লাইনে পৌঁছায়), তখন stack-এ রাখা `defer` গুলো **LIFO (Last In First Out)** অর্ডারে execute হয়।

### উদাহরণ:

```go
func example() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
}
```

**Output হবে:**

```
3
2
1
```

👉 কারণ সব `defer` স্টেটমেন্ট stack-এ ঢুকেছে এইভাবে:

```
push "1"
push "2"
push "3"
```

আর execute হচ্ছে LIFO অর্ডারে:

```
pop "3"
pop "2"
pop "1"
```

---

## 🧠 Defer এর কিছু সাধারণ ব্যবহার

| প্রয়োগ          | ব্যাখ্যা                                           |
| --------------- | -------------------------------------------------- |
| ফাইল বন্ধ করা   | `defer file.Close()` I/O operation শেষে            |
| মেমরি মুক্ত করা | `defer free(ptr)` বা resource release              |
| unlock করা      | `defer mu.Unlock()` mutex বা lock handle করার সময় |
| recover()       | panic হলে graceful error handle করতে               |

---

## ✅ FAQs (Frequently Asked Questions)

### 1. **একাধিক `defer` ব্যবহার করলে কোনটা আগে চালাবে?**

👉 শেষ যেটা `defer` হয়েছে, সেটাই আগে চালাবে (LIFO order)।

```go
defer fmt.Println("first")
defer fmt.Println("second")
```

**Output:**

```
second
first
```

---

### 2. **defer কীভাবে stack এ কাজ করে?**

Go runtime `defer` স্টেটমেন্টগুলোকে একটা internal stack-এ রাখে। যতবার তুমি `defer` লেখো, সেটি সেই stack-এ push হয়। ফাংশন return করার সময়, stack থেকে pop করে একে একে চালানো হয়।

---

### 3. **defer ফাংশনে যদি আর্গুমেন্ট থাকে, তাহলে কখন সেটি evaluate হয়?**

👉 `defer` এর ফাংশন **call time এ evaluate হয়, execute time এ নয়**।

```go
func main() {
	x := 10
	defer fmt.Println("x =", x)
	x = 20
}
```

**Output:**

```
x = 10
```

📌 কারণ `x` এর মান `defer` লাইনের সময়ই ক্যাপচার হয়েছে, পরে `x = 20` হলেও তা প্রভাব ফেলে না।

---

### 4. **defer ফাংশনে anonymous function ব্যবহার করা যায়?**

হ্যাঁ, যায়:

```go
defer func() {
	fmt.Println("Deferred anonymous function")
}()
```

---

### 5. **performance impact আছে কি?**

হালকা performance overhead আছে কারণ `defer` স্টেটমেন্ট stack এ যায়। তাই performance-critical কোডে হাজার হাজার `defer` ব্যবহার না করাই ভালো।

---

### 6. **panic হলে কি `defer` ফাংশন execute হয়?**

হ্যাঁ! panic হলেও `defer` ফাংশনগুলো execute হয়। এটিই `defer` এর একটি বড় সুবিধা।

```go
func test() {
	defer fmt.Println("Deferred cleanup")
	panic("Something went wrong")
}
```

**Output:**

```
Deferred cleanup
panic: Something went wrong
```

---

### 7. **defer return value-কে modify করতে পারে কি?**

হ্যাঁ, যদি named return variable ব্যবহার করা হয়।

```go
func example() (result int) {
	defer func() {
		result += 1
	}()
	return 10
}
```

**Output:**

```
11
```

---

## 🏁 উপসংহার (Conclusion)

* `defer` ফাংশনের শেষ মুহূর্তে clean-up বা final task করার জন্য খুব উপকারী।
* এটি stack-এর মতো কাজ করে (LIFO order)।
* অধিকাংশ ক্ষেত্রে এটি কোডকে পরিষ্কার, কম bug-প্রবণ ও predictable করে তোলে।

