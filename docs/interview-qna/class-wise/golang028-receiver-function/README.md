# ক্লাস ২৮: Go তে রিসিভার ফাংশন (Receiver Functions)

## 🔑 মূল ধারণা: : রিসিভার ফাংশন

Go তে, একটি **রিসিভার ফাংশন (receiver function)** (যাকে **method** ও বলা হয়) হলো এমন একটি ফাংশন যা কোনো নির্দিষ্ট টাইপ **(সাধারণত struct)** এর সাথে জুড়ে থাকে। এটা আমাদের ডেটাটাইপের কোনো কাজ বা ব্যবহার যুক্ত করার সুযোগ দেয়, যেমন অন্য প্রোগ্রামিং ভাষায় অবজেক্টের method থাকে।

---

## 🧠 রিসিভার ফাংশন কি?

একটা **রিসিভার ফাংশন** দেখতে সাধারণ ফাংশনের মতোই, কিন্তু `func` কী-ওয়ার্ড এবং ফাংশনের নামের মাঝে একটা বিশেষ receiver parameter থাকে।

```go
func (r ReceiverType) FunctionName(params) returnType {
    // function body
}
```

রিসিভার টাইপটি হতে পারে:

- একটি **ভ্যালু রিসিভার (value receiver)**: `(t Type)` → একটি কপি রিসিভ করে
- একটি **পয়েন্টার রিসিভার (pointer receiver)**: `(t *Type)` → একটি রেফারেন্স রিসিভ করে (অরিজিনাল ডেটা পরিবর্তন করতে পারে)

---

## 🏗️ প্রোজেক্টের কোড থেকে দেখতে পাই

```go
func (todos *Todos) add(title string) {
    todo := Todo{
        Title: title,
        Completed: false,
        CompletedAt: nil,
        CreatedAt: time.Now(),
    }
    *todos = append(*todos, todo)
}
```

হলো রিসিভার
এই মেথড টি এর সাথে এটাচড

- `todos *Todos` হলো **রিসিভার**
- এই method টি `Todos` এর সাথে যুক্ত (`[]Todo`: একটি কাস্টম টাইপ)
- `*Todos` পয়েন্টারটি অরিজিনাল স্লাইসকে পরিবর্তন করতে দেয়

`main.go` এ ব্যবহারের উদাহরণ:

```go
todos.add("Buy milk")
```

---

## 🔁 রিসিভার ফাংশন কেন ব্যবহার করব?

- ডেটার সাথে সম্পর্কিত লজিক গুছিয়ে রাখা ✅
- Go-তে OOP-এর মতো আচরণ পাওয়া ✅
- কোডকে আরও পরিষ্কার ও মডুলার রাখা ✅

---

## 💡 আরও সহজ উদাহরণ

```go
type User struct {
    Name string
}

// Value receiver (no change to original)
func (u User) SayHi() {
    fmt.Println("Hi, I am", u.Name)
}

// Pointer receiver (can change original)
func (u *User) ChangeName(newName string) {
    u.Name = newName
}

func main() {
    user := User{Name: "Ruhin"}
    user.SayHi() // Hi, I am Ruhin
    user.ChangeName("Mukim")
    user.SayHi() // Hi, I am Mukim
}
```

---

## ⚙️ ⚙️ সারাংশ

| টার্ম            | অর্থ                                              |
| ---------------- | ------------------------------------------------- |
| Receiver         | যে টাইপের সাথে মেথড যুক্ত থাকে (যেমন, `*Todos`)   |
| Value Receiver   | ডেটার কপি পায়; আসল ডেটা পরিবর্তন করতে পারে না    |
| Pointer Receiver | ডেটার রেফারেন্স পায়; আসল ডেটা পরিবর্তন করতে পারে |

---

## 📘 ভিজ্যুয়ালাইজেশন

`todos.add()`কে অবজেক্টের কোনো কাজ বা আচরণ কল করার মতো ভাবা যেতে পারে:

```go
object.method()
```

এই প্যাটার্নটি `Todos` কে কাস্টম লজিক যোগ করার সুযোগ দেয়, যেমন `add`, `delete`, `toggle`, `print` ইত্যাদি, ঠিক Python বা Java-এর ক্লাস মেথডের মতো।

---

[**Author:** @ifrunruhin12, @nazma98
**Date:** 2025-05-01 - 2025-05-17
**Category:** interview-qa/class-wise
]
