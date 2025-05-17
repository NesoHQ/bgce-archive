# 🧠 Class 19: Function Types in Go

## 1️⃣ Standard Function (নির্ধারিত function)
একটি সাধারণভাবে নামযুক্ত function যা `func` কীওয়ার্ড দিয়ে তৈরি করা হয়।

```go
func add() {
    fmt.Println("Hello!")
}
```

## 2️⃣ Anonymous Function (নামহীন function)
এই ফাংশনের কোনো নাম থাকে না। একে ইনলাইন বা তৎক্ষণাৎ ব্যবহার করা যায়।

```go
func() {
    fmt.Println("I have no name!")
}()
```

## 3️⃣ Function Expression (ভেরিয়েবলে function সংরক্ষণ)
ফাংশনটিকে একটি ভেরিয়েবলে সংরক্ষণ করে পরে ব্যবহার করা হয়।

```go
hello := func() {
    fmt.Println("Hi there!")
}
hello()
```

## 4️⃣ Higher-Order Function / First-Class Function
যে function অন্য ফাংশনকে প্যারামিটার হিসেবে গ্রহণ করে অথবা function রিটার্ন করে।

```go
func operate(a int, b int, fn func(int, int) int) int {
    return fn(a, b)
}
```

## 5️⃣ Callback Function (পুনরায় কল করা হয় এমন function)
একটি function যা আরেকটি ফাংশনে প্যারামিটার হিসেবে পাঠানো হয় এবং নির্দিষ্ট সময়ে কল করা হয়।

```go
func process(callback func()) {
    callback()
}
```

## 6️⃣ Variadic Function (বহু সংখ্যক প্যারামিটার গ্রহণ করে)
একটি function যা পরিবর্তনশীল সংখ্যক আর্গুমেন্ট গ্রহণ করতে পারে।

```go
func sum(nums ...int) {
    total := 0
    for _, num := range nums {
        total += num
    }
    fmt.Println(total)
}
```

## 7️⃣ Init Function (Go নিজে থেকে কল করে)
Go প্রোগ্রাম রান করার সময় `main()` এর আগেই `init()` ফাংশনটি কল হয়। এটি ম্যানুয়ালি কল করা যায় না।

```go
func init() {
    fmt.Println("Initializing...")
}
```

## 8️⃣ Closure (বাইরের স্কোপের ভেরিয়েবল বন্ধ করে ফেলে)
একটি function যা বাইরের স্কোপের ভেরিয়েবল "বন্ধ" বা retain করে রাখে।

```go
func outer() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}
```

## 9️⃣ Defer Function (শেষে কল হয় Stack এর Last In First Out নিয়মে)
`defer` কীওয়ার্ড ব্যবহারে ফাংশনটি পরে কল হয়, সাধারণত function শেষ হওয়ার আগে।

```go
func test() {
    defer fmt.Println("Three")
    defer fmt.Println("Two")
    fmt.Println("One")
}
```

🟢 output:
```
One
Two
Three
```

## 🔟 Receiver Function / Method (struct এর সাথে যুক্ত function)
Go তে struct এর সাথে method সংযুক্ত করা যায়।

```go
type Person struct {
    name string
}

func (p Person) add() {
    fmt.Println("Hello", p.name)
}
```

## 1️⃣1️⃣ IIFE - Immediately Invoked Function Expression
একটি function যা একসাথে define এবং invoke করা হয়।

```go
func(msg string) {
    fmt.Println(msg)
}("IIFE Example")
```

[Author: @ifrunruhin12 @shahriar-em0n  Date: 2025-05-01 Category: interview-qa/class-wise ]
