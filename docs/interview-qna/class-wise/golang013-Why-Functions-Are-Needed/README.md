# 📘 Class 13: Why Functions Are Needed?

## ✅ ১. কেন ফাংশন দরকার?

প্রোগ্রাম লেখার সময় অনেক সময় দেখা যায়  একই ধরণের কাজ বারবার করতে হচ্ছে। যেমন: ইউজারের নাম নেওয়া, সংখ্যা নেওয়া, বা একটা মেসেজ প্রিন্ট করা।

👉 যদি এগুলো আমরা বারবার `main()` ফাংশনের মধ্যে লিখি, তাহলে:
- কোড অনেক বড় ও জটিল হয়ে যায়  
- একই কোড বারবার লিখতে হয় (repetition)  
- কোড মেইনটেইন করা কঠিন হয়

📌 **ফাংশন ব্যবহার করলে:**
- কোড ছোট ছোট অংশে ভাগ করা যায় (Modular Code)
- একবার লিখে বারবার ব্যবহার করা যায় (Reusable)
- বোঝা এবং মেইনটেইন করা সহজ হয়
- বাগ (bug) ধরা ও ঠিক করা সহজ হয়

---

## Example : ফাংশন ব্যবহার করার আগে

এখানে একটি প্রোগ্রাম দেখানো হয়েছে যেখানে কোন ফাংশন ব্যবহার করা হয়নি:

```go
package main

import "fmt"

func main() {
    // Print welcome message
    fmt.Println("Welcome to the application")

    // Get user name as input
    var name string
    fmt.Println("Enter your name - ")
    fmt.Scanln(&name)

    var num1 int
    var num2 int
    fmt.Println("Enter first number - ")
    fmt.Scanln(&num1)
    fmt.Println("Enter second number - ")
    fmt.Scanln(&num2)

    sum := num1 + num2

    // display results
    fmt.Println("Hello, ", name)
    fmt.Println("Summation = ", sum)

    // print a goodbye message
    fmt.Println("Thank you for using the application")
    fmt.Println("Goodbye")
}
```

### 🧠 সমস্যা:
- একই `main()` ফাংশনে সবকিছু একত্রে থাকায় কোডটি বড় ও জটিল হয়ে গেছে
- পুনরায় ব্যবহারযোগ্যতা নেই
- মেইনটেন করা কঠিন

---

## ✅ ফাংশন ব্যবহার করার পরে

একই কাজকে ফাংশনের মাধ্যমে ভাগ করে সহজ করা হয়েছে:

```go
package main

import "fmt"

func printWelcomeMessage() {
    fmt.Println("Welcome to the application")
}

func getUserName() string {
    var name string
    fmt.Println("Enter your name - ")
    fmt.Scanln(&name)
    return name
}

func getTowNumbers() (int, int) {
    var num1 int
    var num2 int
    fmt.Println("Enter first number - ")
    fmt.Scanln(&num1)
    fmt.Println("Enter second number - ")
    fmt.Scanln(&num2)-
    return num1, num2
}

func add(num1 int, num2 int) int {
    sum := num1 + num2
    return sum
}

func display(name string, sum int) {
    fmt.Println("Hello, ", name)
    fmt.Println("Summation = ", sum)
}

func printGoodByeMessage() {
    fmt.Println("Thank you for using the application")
    fmt.Println("Goodbye")
}

func main() {
    printWelcomeMessage()
    name := getUserName()
    num1, num2 := getTowNumbers()
    sum := add(num1, num2)
    display(name, sum)
    printGoodByeMessage()
}
```

### ✅ সুবিধা:
- প্রতিটি কাজ আলাদা ফাংশনে রাখা হয়েছে
- কোড সহজ ও সুন্দর হয়েছে
- বারবার ব্যবহারযোগ্যতা বেড়েছে
- মেইনটেন করা সহজ হয়েছে

---
## ✅ ২. মডুলার কোড কাকে বলে?

**Modular code** মানে হচ্ছে, পুরো প্রোগ্রামকে ছোট ছোট "module" বা অংশে ভাগ করে লেখা। প্রতিটি অংশ একটা নির্দিষ্ট কাজ করে।

📌 উদাহরণ:

| ফাংশনের নাম | কাজ |
|-------------|------|
| `getUserName()` | ইউজারের নাম নেওয়া |
| `getTwoNumbers()` | দুটি সংখ্যা ইনপুট নেওয়া |
| `add()` | যোগফল বের করা |
| `display()` | ফলাফল দেখানো |

এভাবে প্রতিটি কাজের জন্য আলাদা ফাংশন থাকলে:

✅ বুঝতে সহজ  
✅ পুনঃব্যবহারযোগ্য (Reusable)  
✅ টেস্ট/বাগ ফিক্স সহজ  
✅ ভবিষ্যতে বড় সফটওয়্যারে সহজে এক্সটেন্ড করা যায়

---

### ✅ ৩. SOLID এর S – Single Responsibility Principle

**S = Single Responsibility Principle (SRP)**  
👉 এটি বলে: "একটি ফাংশনের **মাত্র একটি কাজ** (responsibility) থাকা উচিত।"

---

### 🧠 কেন SRP গুরুত্বপূর্ণ?

- এতে কোড **সুস্পষ্ট** ও **সহজবোধ্য** হয়
- একটি ফাংশনে পরিবর্তন করলে অন্যগুলো **ভাঙে না**
- **বাগ ফিক্সিং সহজ** হয়
- **টেস্টিং সহজ** হয়

---

📌 উদাহরণ:

**❌ খারাপ ডিজাইন (SRP ভঙ্গ করছে):**
```go
func handleEverything() {
    // ইনপুট নেয়
    // হিসাব করে
    // প্রিন্ট করে
}
```

এই ফাংশন অনেক কাজ করছে একসাথে - যা SRP ভঙ্গ করে।

**✅ ভালো ডিজাইন (SRP মেনে চলছে):**
```go
func getUserName() {}
func add() {}
func display() {}
```

এখানে প্রতিটি ফাংশন একটি মাত্র কাজ করছে - এটিই SRP।

---



## 🎯 ক্লাসের সারাংশ:

| বিষয় | শেখা হয়েছে |
|------|------------|
| ফাংশনের প্রয়োজনীয়তা | ✅ |
| কোড মডুলার করার উপায় | ✅ |
| SOLID এর 'S' – Single Responsibility | ✅ উদাহরণসহ |


[Author : @shahriar-em0n  Date: 2025-06-13 Category: interview-qa/class-wise ]
