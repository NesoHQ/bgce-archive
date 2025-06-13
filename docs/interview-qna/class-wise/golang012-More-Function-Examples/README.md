# 📘 Class 12 : More Function Examples 

এখানে আরও কিছু ফাংশনের উদাহরণ দেওয়া হলো।

---

## ✅ Function 1: `printSomething()`

এই ফাংশনটি কোন আর্গুমেন্ট নেয় না এবং কোন রিটার্ন ভ্যালুও দেয় না। শুধুমাত্র একটি লাইন প্রিন্ট করে।

### 📄 Code:
```go
func printSomething(){
    fmt.Println("Education must be free!")
}
```

### 🧠 ব্যাখ্যা:
- `printSomething()` ফাংশনটি কোন ইনপুট নেয় না।
- এটি `fmt.Println()` ফাংশনের মাধ্যমে একটি মেসেজ প্রিন্ট করে দেয়।

---

## ✅ Function 2: `sayHello(name string)`

এই ফাংশনটি একটি প্যারামিটার (string টাইপের `name`) নেয় এবং একটি স্বাগত বার্তা প্রিন্ট করে।

### 📄 Code:
```go
func sayHello(name string){
    fmt.Println("Welcome to the golang course, ", name)
}
```

### 🧠 ব্যাখ্যা:
- `sayHello` ফাংশনটি একটি `name` ইনপুট নেয়, যা `string` টাইপের।
- এরপর `fmt.Println()` ব্যবহার করে সেই নামসহ একটি মেসেজ প্রিন্ট করে।

---

## 🔁 Main Function

### 📄 Code:
```go
func main() {
    printSomething()
    sayHello("Shahriar")
}
```

### 🧠 ব্যাখ্যা:
- `main()` ফাংশন হচ্ছে Go প্রোগ্রামের এন্ট্রি পয়েন্ট।
- এখানে প্রথমে `printSomething()` কল করা হয়েছে, তাই এটি `"Education must be free!"` প্রিন্ট করবে।
- তারপর `sayHello("Shahriar")` কল করা হয়েছে, তাই এটি `"Welcome to the golang course, Shahriar"` প্রিন্ট 
func showPrice(price float64){

    fmt.Println("The product price is: $", price)

}করবে।

---

## 🧾 সংক্ষেপে

| ফাংশনের নাম | প্যারামিটার | কাজ | রিটার্ন |
|-------------|-------------|------|----------|
| `printSomething()` | নাই | একটি মেসেজ প্রিন্ট করে | নাই |
| `sayHello(name string)` | একটি স্ট্রিং | নামসহ মেসেজ প্রিন্ট করে | নাই |


[Author : @shahriar-em0n Date: 2025-06-13 Category: interview-qa/class-wise ]

