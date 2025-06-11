# Class 10 : Introduction to Functions

## 🔍 Function কী?

`Function` (ফাংশন) হল কোডের একটি পুনঃব্যবহারযোগ্য ব্লক যা নির্দিষ্ট একটি কাজ করে।  
যখন আমাদের একই কোড বারবার লেখা লাগে, তখন আমরা সেটাকে একটা ফাংশনের মধ্যে রেখে দিই।  
এতে করে কোড clean হয়, readable হয় এবং বারবার ব্যবহার করা যায়।

---

## 🧠 Function কেন ব্যবহার করি?

- ✅ Reusability (একই কোড বারবার ব্যবহার করা যায়)
- ✅ Readability (কোড আরও পরিষ্কার হয়)
- ✅ Maintainability (বাগ ফিক্স করা বা পরিবর্তন সহজ হয়)
- ✅ Logic কে ছোট ছোট অংশে ভাগ করে বুঝতে সুবিধা হয়

---

## 🧪 উদাহরণ: দুটি সংখ্যার যোগফল বের করা

```go
package main

import "fmt"

// এই ফাংশনটি দুটি সংখ্যা নেয় এবং তাদের যোগফল প্রিন্ট করে
func add(num1 int, num2 int){ 
    sum := num1 + num2
    fmt.Println(sum)
}

func main() {
    a := 10
    b := 20

    add(a, b)     // Output: 30
    add(5, 7)     // Output: 12
}
```

---

## ব্যাখ্যা:

- `func add(num1 int, num2 int)` - এটি একটি function definition, যেখানে `num1` এবং `num2` হল parameters।
- `sum := num1 + num2` - এখানে দুই সংখ্যার যোগফল বের করা হচ্ছে।
- `fmt.Println(sum)` - যোগফল প্রিন্ট করা হচ্ছে।
- `main()` ফাংশনের মধ্যে `add(a, b)` ব্যবহার করে আমরা ফাংশনটি কল করেছি।


[Author : @shahriar-em0n  Date: 2025-06-11 Category: interview-qa/class-wise ]
