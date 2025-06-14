# Class 15 - Local Scope and Block

## 🧠 Scope types

Scope ৩ টাইপের।

- Global scope
- Local scope
- Package scope

## 1️⃣ Global Scope

🔹 যে variable বা function, `main()` এর বাইরে declare করা হয়

🔹 সব ফাংশন থেকে access করা যায়

```go
var x = 100

func main() {
	fmt.Println(x)
}
```

এখানে `x` একটি global variable, তাই `main()` function একে access করতে পারছে।

## 🧱 Block Scope

Go তে যেকোনো `{}` curly brace কে `Block` বলে।

Block এর ভিতরে যদি variable declare করা হয়, তাহলে সেটা সেই block এর local scope এ পরে এবং একে ওই Block এর local variable বলে।

### ✨ Code Example

```go

func main() {
	x := 18

	if x >= 18 {
		p := 10
		fmt.Println("I'm matured boy")
		fmt.Println("I've ", p, " girlfriends")
	}
}
```

### ✨ Code Explanation

**🔹 main() ফাংশন শুরু**

```go
func main() {
	x := 18
```

- এখানে `x` variable টি `main()` ফাংশনের ভিতরে declare করা হয়েছে।
- `x` এর scope পুরো `main()` ফাংশনের ভিতর - একে বলে local variable to `main()`

**🔹 if Block**

```go
if x >= 18 {
	p := 10
	fmt.Println("I'm matured boy")
	fmt.Println("I've ", p, " girlfriends")
}
```

- `if` block শুরু হয়েছে `{` দিয়ে এবং শেষ হয়েছে `}` দিয়ে - এটি হলো একটা Block।
- block এর ভিতরে `p := 10` - তাই `p` এর scope কেবল `if` block এর ভিতরেই সীমাবদ্ধ।
- `p` কে `main()` ফাংশনের বাইরে বা `if` block এর বাইরে ব্যবহার করা যাবে না

### 🧠 RAM Visualization (Scope অনুযায়ী)

```plaintext

                      RAM
+------------------------------+
| x = 18       ← main() scope  |
+------------------------------+

        ⬇ if block executed

+------------------------------+
| x = 18                       |
| p = 10   ← if block scope    |
+------------------------------+

        ⛔ if block শেষ হওয়ার পর

+------------------------------+
| x = 18                       |
| p = ❌ (not accessible)      |
+------------------------------+
```

---

### 🚫 Scope এর বাইরে variable access

#### 📄Code Example - 01

```go

func main() {
	x := 18

	if x >= 18 {
		p := 10
		fmt.Println("I'm matured boy")
		fmt.Println("I've ", q, " girlfriends")
	}
}

```

#### 💬 Code Explanation

**🔹`main()` ফাংশন**

```go
func main() {
	x := 18

```

`x` হল একটি local variable to `main()` তাই `main()` ফাংশনের যেকোনো জায়গা থেকে access করা যাবে।

**🔹 if block**

```go
p := 10
```

`if` block এর ভেতরে declare করা হয়েছে, তাই block scope অনুযায়ী `p` শুধু `if` block এর ভিতরে accessible

```go
fmt.Println("I've ", q, " girlfriends")
```

- এখানে `q` কোথাও declare করা হয়নি
- Go এখন `main()` বা global scope এ খুঁজে দেখবে - কিন্তু সেখানে নেই
- তাই Go কম্পাইলার `"undefined: q" error` দিবে

### 🧠 RAM Visualization (Scope অনুযায়ী)

```plaintext

             RAM (Execution Time)
+-------------------------------+
| x = 18         ← main() scope |
+-------------------------------+
        ↓ if block executed
+-------------------------------+
| x = 18                        |
| p = 10     ← if block scope   |
| q = ??? ❌  (not found!)       |
+-------------------------------+
```

---

#### 📄 Code Example - 02

```go

func main() {
	x := 18

	if x >= 18 {
		p := 10
		fmt.Println("I'm matured boy")
		fmt.Println("I've ", p, " girlfriends")
	}

		fmt.Println("I've ", p, " girlfriends")

}

```

#### 🧱 Scope বিশ্লেষণ

**🔹 `x := 18`**

- `main()` ফাংশনের ভিতরে declare করা হয়েছে → তাই `x` এর scope হলো পুরো `main()` ফাংশনের ভিতর।

**🔹 `if x >= 18 { ... }`**

- এই block এর ভিতরে `p := 10` declare করা হয়েছে।
- তাই `p` এর scope শুধুমাত্র এই `if` block এর ভিতরে।

**🔹 `fmt.Println("I've ", p, " girlfriends")`**

- এখানে `p` কে use করা হয়েছে তার নিজের scope এর মধ্যেই

**🔹 if block এর বাহিরের `fmt.Println("I've ", p, " girlfriends")`**

- `p`, `if` block এর ভিতরে declare হয়েছে → তাই বাইরে access করা যাবে না
- ❌ এখানে `p` এর scope এর বাইরে চলে গেছে
- তাই Go কম্পাইলার error দিবে: `undefined: p`

### 💾 RAM Visualization (Scope অনুযায়ী)

```plaintext

                   RAM
+-----------------------------+
| x = 18        ← main scope  |
+-----------------------------+
        ⬇ if block শুরু হলে
+-----------------------------+
| x = 18                      |
| p = 10     ← if block only  |
+-----------------------------+
        ⬇ if block শেষ
+-----------------------------+
| x = 18                      |
| p = ❌ (Not Found!)         |
+-----------------------------+


```

## 🧠 Block Scope এর মূল পয়েন্টগুলো

✅ Block আসলে memory তে নতুন জায়গা দখল করে।

- প্রতিবার কোনো block (যেমন: `if`, f`or`, `switch`, f`unction`) চালু হলে RAM এ সেই block এর জন্য অস্থায়ী জায়গা (temporary memory space) তৈরি হয়।

✅ Block এর ভিতরে declare করা variable বাইরে থেকে access করা যাবে না।

- Variable শুধুমাত্র সেই block এর local scope এর ভিতরে কাজ করে।

✅ Block শেষ হলেই সেই variable RAM থেকে মুছে যায় বা আর access করা যায় না।

- কারণ Go এর compiler বুঝে - variable টি তার scope এর বাইরে চলে গেছে।

[**Author:** @nazma98
**Date:** 2025-06-14
**Category:** interview-qa/class-wise
]
