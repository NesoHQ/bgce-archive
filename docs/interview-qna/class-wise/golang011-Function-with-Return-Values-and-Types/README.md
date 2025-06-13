# 📘 Class 11 :  Function with Return Values and Types

Go তে ফাংশনের মাধ্যমে আমরা একটি অথবা একাধিক ভ্যালু রিটার্ন করতে পারি।। ফাংশন শুধু কাজ করেই শেষ নয় আমরা চাইলে ফাংশন থেকে ফলাফলও (result) ফিরে পেতে পারি। একে বলে **Return Value**।

Go-তে ফাংশন থেকে দুই ধরনের রিটার্ন হতে পারে:

- ✅ **Single Return Value (একটি মান ফেরত দেয়)**  
- ✅ **Multiple Return Values (একাধিক মান ফেরত দেয়)**

---

## 🔹 Single Return Value

ফাংশন যখন **একটি মাত্র ফলাফল** ফেরত দেয়, তখন তাকে Single Return Function বলা হয়।

### ✅ উদাহরণঃ

```go
package main

import "fmt"

// একক রিটার্ন ভ্যালু সহ ফাংশন
func add(num1 int, num2 int) int {
	sum := num1 + num2
	fmt.Println("ফাংশনের ভিতরে যোগফল:", sum)
	return sum
}

func main() {
	a := 10
	b := 20

	result := add(a, b) // রিটার্ন মানটি result এ রাখছি
	fmt.Println("main ফাংশনে রিটার্ন মান:", result)
}
```

### 🔎 ব্যাখ্যাঃ

- `add()` ফাংশন দুটি ইনপুট নেয়: `num1` এবং `num2`।
- এটি তাদের যোগফল `sum` হিসেব করে ফেরত দেয় `return sum`।
- `main()` ফাংশনে এই রিটার্ন মানটি `result` ভ্যারিয়েবলে রাখা হয়।

---

## 🔹 Multiple Return Values

ফাংশন যদি **একাধিক ফলাফল একসাথে** ফেরত দেয়, তাহলে সেটাকে Multiple Return Function বলা হয়।

### ✅ উদাহরণঃ

```go
package main

import "fmt"

// একাধিক রিটার্ন ভ্যালু সহ ফাংশন
func getNumbers(num1 int, num2 int) (int, int) {
	sum := num1 + num2
	mul := num1 * num2
	return sum, mul
}

func main() {
	a := 10
	b := 20

	// দুটি রিটার্ন মান আলাদা করে নিচ্ছি
	p, q := getNumbers(a, b)
	
	fmt.Println("যোগফল =", p)
	fmt.Println("গুণফল =", q)
}
```

### 🔎 ব্যাখ্যাঃ

- `getNumbers()` ফাংশন দুটি ইনপুট নেয় এবং দুইটি আউটপুট দেয়: **যোগফল** (`sum`) এবং **গুণফল** (`mul`)।
- আমরা `main()` ফাংশনে `p, q := getNumbers(a, b)` ব্যবহার করে রিটার্ন মানগুলো আলাদা করে নিই।

---

## ✅ সংক্ষেপে মনে রাখুন:

>Go প্রোগ্রামিং ভাষায় ফাংশন থেকে আমরা একটি বা একাধিক মান রিটার্ন করতে পারি।

## ফাংশনের Return Value: Single vs Multiple

| ধরন            | রিটার্ন সংখ্যা | রিটার্ন টাইপ     | কী ফেরত দেয়?       | উদাহরণ ফাংশন        | ডিক্লেয়ার করার ধরন                   |
|----------------|----------------|------------------|---------------------|----------------------|----------------------------------------|
| Single Return  | ১টি মান        | `int`            | একটি পূর্ণসংখ্যা     | `add()`              | `func add() int`                       |
| Single Return  | ১টি মান        | `string`         | একটি স্ট্রিং         | `getName()`          | `func getName() string`               |
| Single Return  | ১টি মান        | `rune`           | একটি ক্যারেক্টার     | `getChar()`          | `func getChar() rune`                 |
| Single Return  | ১টি মান        | `float64`        | একটি ভাসমান সংখ্যা   | `getAverage()`       | `func getAverage() float64`           |
| Multiple Return| একাধিক মান     | `(int, int)`     | দুইটি পূর্ণসংখ্যা    | `getNumbers()`       | `func getNumbers() (int, int)`        |
| Multiple Return| একাধিক মান     | `(string, int)`  | স্ট্রিং ও সংখ্যা      | `getUserInfo()`      | `func getUserInfo() (string, int)`    |

## সাধারণ Return টাইপ ব্যাখ্যা

- `int` - পূর্ণসংখ্যা (যেমন: 5, 100)
- `float64` - দশমিক সংখ্যা (যেমন: 3.14, 9.81)
- `string` - স্ট্রিং বা টেক্সট (যেমন: "Shahriar")
- `rune` - একটি ইউনিকোড ক্যারেক্টার (যেমন: 'A', 'ক')

📝 **নোট:** Go ফাংশনে আমরা দুইটির বেশি মানও রিটার্ন করতে পারি - যেমন ৩টি বা তার বেশি মান। তবে এই টেবিল ও উদাহরণগুলোতে আমরা শুধুমাত্র দুটি মান রিটার্নের উদাহরণ দিয়েছি, যেন বিষয়টি সহজভাবে বোঝানো যায়। প্রয়োজনে ফাংশন থেকে আরও বেশি সংখ্যক মান রিটার্ন করাও সম্ভব এবং এটি পুরোপুরি বৈধ।


এভাবে Go ফাংশন return value এর মাধ্যমে কার্যকরভাবে তথ্য ফেরত দিতে পারে, যা কোডকে modular এবং পরিষ্কার করে তোলে।




---

## Note

Go-তে ফাংশনের মাধ্যমে কোডকে পরিষ্কার ও পুনঃব্যবহারযোগ্য করা যায়। return value ব্যবহার করে আমরা ফাংশনের কাজের ফলাফল main() ফাংশনে এনে ব্যবহার করতে পারি। একাধিক মান ফেরত দেওয়ার ক্ষমতা Go ভাষাকে আরও শক্তিশালী করে তোলে।

[Author : @shahriar-em0n  Date: 2025-06-13 Category: interview-qa/class-wise ]
