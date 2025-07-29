[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-22
**Category:** interview-qa/Function Expressions
**Tags:** [go, Function Expressions, Anonymous Functions ]
]

## Go-তে Function Expressions এবং Anonymous Functions

Go ভাষায় ফাংশনগুলোকে **first-class citizens** হিসেবে বিবেচনা করা হয়। অর্থাৎ, একটি ফাংশনকে:

* ভেরিয়েবলে সংরক্ষণ করা যায়,
* আর্গুমেন্ট হিসেবে অন্য ফাংশনে পাঠানো যায়,
* অন্য ফাংশন থেকে রিটার্ন করা যায়।

এগুলো প্রোগ্রামে গতিশীল (dynamic) আচরণকে সহজ করে তোলে।

---

### 🔸 Function Expressions

**Function Expression** হলো এমন একটি ফাংশন যা একটি ভেরিয়েবলে অ্যাসাইন করা হয়। এরপর সেই ভেরিয়েবল দিয়েই ফাংশনটি কল করা যায়।

```go
package main
import "fmt"

func main() {
    // ফাংশনকে ভেরিয়েবলে সংরক্ষণ করা
    add := func(a int, b int) int {
        return a + b
    }

    // ফাংশন কল করা ভেরিয়েবলের মাধ্যমে
    result := add(3, 4)
    fmt.Println("Sum:", result) // Output: Sum: 7
}
```

---

### 🔸 Anonymous Functions

**Anonymous Function** হলো এমন একটি ফাংশন যার কোনো নাম নেই। এটি সাধারণত অস্থায়ী (short-lived) কাজের জন্য ব্যবহৃত হয়।

```go
package main
import "fmt"

func main() {
    // নামহীন (anonymous) ফাংশন, সঙ্গে সঙ্গে কল করা হচ্ছে
    func(message string) {
        fmt.Println(message)
    }("Hello, Go!") // Output: Hello, Go!
}
```

---

### 🔸 Immediately Invoked Function Expression (IIFE)

IIFE হলো এমন একটি ফাংশন যা ডিফাইন করেই সঙ্গে সঙ্গে কল করা হয়। এটি সাধারণত ইনিশিয়ালাইজেশন বা একবারের কাজের জন্য ব্যবহৃত হয়।

```go
package main
import "fmt"

func main() {
    result := func(a int, b int) int {
        return a + b
    }(3, 4) // ফাংশন সঙ্গে সঙ্গে কল হচ্ছে

    fmt.Println("Sum:", result) // Output: Sum: 7
}
```

---

## ✅ আরও উদাহরণ

### 1. ফাংশন রিটার্ন করে এমন ফাংশন

```go
package main
import "fmt"

// multiply একটি ফাংশন রিটার্ন করে
func multiply(factor int) func(int) int {
    return func(x int) int {
        return x * factor
    }
}

func main() {
    multiplyByTwo := multiply(2)
    result := multiplyByTwo(5)
    fmt.Println("Multiplication Result:", result) // Output: 10
}
```

---

### 2. Function Expressions দিয়ে map-এর মতো অপারেশন

```go
package main
import "fmt"

func main() {
    numbers := []int{1, 2, 3, 4, 5}

    // প্রতিটি আইটেমে অপারেশন করার জন্য function expression ব্যবহার
    doubledNumbers := mapFunc(numbers, func(x int) int {
        return x * 2
    })

    fmt.Println("Doubled Numbers:", doubledNumbers) // Output: [2 4 6 8 10]
}

func mapFunc(numbers []int, f func(int) int) []int {
    var result []int
    for _, number := range numbers {
        result = append(result, f(number))
    }
    return result
}
```

---

## 💬 ইন্টারভিউ প্রশ্ন ও উত্তর

### 1. **Go-তে Function Expression কী এবং এটি কী কাজে লাগে?**

**উত্তর:**
Function expression মানে হলো ফাংশনকে কোনো ভেরিয়েবলে সংরক্ষণ করা। এটি ফাংশনকে ভ্যালুর মতো ব্যবহার করার সুযোগ দেয়, যাতে আমরা ফাংশনকে প্যারামিটার হিসেবে পাঠাতে, রিটার্ন করতে এবং প্রয়োজনে সংরক্ষণ করতে পারি।

---

### 2. **Anonymous Function কী? উদাহরণ দাও।**

**উত্তর:**
Anonymous function হচ্ছে এমন ফাংশন যার কোনো নাম নেই। সাধারণত কমপ্লেক্স না এমন, অস্থায়ী কাজের জন্য ব্যবহার করা হয়।

**উদাহরণ:**

```go
func main() {
    func(message string) {
        fmt.Println(message)
    }("Hello, Go!")
}
```

---

### 3. **Function Expression আর Named Function-এর মধ্যে পার্থক্য কী?**

**উত্তর:**

* **Named Function**: একটি নির্দিষ্ট নাম দিয়ে ডিফাইন করা হয়, যেটা ফাংশন কল করতে ব্যবহৃত হয়।
* **Function Expression**: নামবিহীন ফাংশনকে একটি ভেরিয়েবলে অ্যাসাইন করে কল করা হয়।

Function expressions বেশি flexible কারণ এগুলোকে ডাইনামিকভাবে পাস/রিটার্ন করা যায়।

---

### 4. **IIFE (Immediately Invoked Function Expression) কী?**

**উত্তর:**
IIFE এমন একটি ফাংশন যা ডিফাইন করেই সঙ্গে সঙ্গে এক্সিকিউট করা হয়। এটি একবারের কাজ বা প্রাথমিক কোনো ক্যালকুলেশনের জন্য খুব কার্যকর।

**উদাহরণ:**

```go
result := func(a int, b int) int {
    return a + b
}(3, 4)
fmt.Println("Sum:", result)
```

---

### 5. **Go-তে কীভাবে ফাংশনকে আর্গুমেন্ট হিসেবে পাঠানো যায়?**

**উত্তর:**
Go-তে ফাংশনকে আর্গুমেন্ট হিসেবে পাঠানোর জন্য সেই ফাংশনের signature অনুযায়ী ফাংশন টাইপ ডিফাইন করতে হয়।

**উদাহরণ:**

```go
func applyOperation(a int, b int, operation func(int, int) int) int {
    return operation(a, b)
}

func main() {
    add := func(a int, b int) int {
        return a + b
    }

    result := applyOperation(3, 4, add)
    fmt.Println("Sum:", result)
}
```

