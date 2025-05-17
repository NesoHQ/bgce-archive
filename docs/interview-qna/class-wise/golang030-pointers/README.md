# ক্লাস ৩০: Go পয়েন্টার

## পয়েন্টার কি?

**পয়েন্টার** হলো এমন একটি ভেরিয়েবল যা আরেকটি ভেরিয়েবলের মেমোরি এড্রেস সংরক্ষণ করে।

Go তে মেমোরি কয়েকটি ভাগে বিভক্ত থাকে। যেমন:

- **কোড সেগমেন্ট**: কম্পাইল করা প্রোগ্রামের নির্দেশনা (ফাংশন) সংরক্ষণ করে।
- **ডেটা সেগমেন্ট**: গ্লোবাল/স্ট্যাটিক ভেরিয়েবল এবং কনস্ট্যান্ট সংরক্ষণ করে।
- **স্ট্যাক**: লোকাল ভেরিয়েবল এবং ফাংশন কলের তথ্য সংরক্ষণ করে।
- **হিপ**: ডায়নামিকালি অ্যালোকেট করা মেমোরি সংরক্ষণ করে।

পয়েন্টারের মাধ্যমে সরাসরি মেমোরি এড্রেসের সাথে কাজ করা যায়।

---

## গুরুত্বপূর্ণ চিহ্নগুলো:

- `&` (Ampersand): **ভেরিয়েবলের এড্রেস** পেতে ব্যবহার হয়।
- `*` (Star/Dereference operator): **মেমোরি এড্রেসে থাকা মান** পেতে ব্যবহার হয়।

উদাহরণ:

```go
x := 20
p := &x // p ভেরিয়েবল, x এর এড্রেস রাখে

*p = 30 // এড্রেস p তে থাকা মান (x) পরিবর্তন করে

fmt.Println(x)  // 30
fmt.Println(p)  // x এর এড্রেস
fmt.Println(*p) // 30 (এড্রেসে থাকা মান)
```

---

## পয়েন্টার কেন ব্যবহার করবেন?

- **ইফিসিয়েন্সি (Efficiency)**: বড় স্ট্রাকচার (যেমন অ্যারে) কপি না করে শুধুমাত্র তাদের মেমোরি এড্রেস পাস করা যায়।
- **শেয়ারড মডিফিকেশন (Shared Modification)**: যখন একাধিক ফাংশনকে একই ডেটা পরিবর্তন করতে হয়।
- **মেমোরি ম্যানেজমেন্ট (Memory Management)**: লো-লেভেল বা হাই-পারফরম্যান্স প্রোগ্রামিংয়ে বিশেষভাবে গুরুত্বপূর্ণ।

পয়েন্টার ছাড়া, প্রতিটি ফাংশন কলের সময় পুরো অবজেক্ট কপি করতে হতো। এটা ধীর গতির এবং মেমোরি অপচয় করে!

---

## পাস বাই ভ্যালু (Pass by Value) vs পাস বাই রেফারেন্স (Pass by Reference)

**পাস বাই ভ্যালু (Pass by Value)**:

- ভেরিয়েবলের একটি কপি পাস করা হয়।
- ফাংশনের ভেতরে পরিবর্তন অরিজিনাল ভেরিয়েবলকে প্রভাবিত করে না।

```go
func print(numbers [3]int) {
	fmt.Println(numbers)
}

arr := [3]int{1, 2, 3}
print(arr) // একটি কপি পাস
```

**পাস বাই রেফারেন্স (Pass by Reference)**:

- কপি না করে ভেরিয়েবলের এড্রেস পাস করা হয়।
- ফাংশনের ভেতরে করা পরিবর্তন অরিজিনাল ভেরিয়েবলকে প্রভাবিত করে।

```go
func print2(numbers *[3]int) {
	fmt.Println(numbers)
}

arr := [3]int{1, 2, 3}
print2(&arr) // একটি পয়েন্টার পাস
```

---

## স্ট্রাক্ট পয়েন্টার (and why Go is chill with them)

যখন স্ট্রাক্ট এ পয়েন্টার থাকে, Go বার বার \* (dereference) করার পরিবর্তে নিজেই বুঝে নিয়ে field access দেয়।

```go
user1 := User{
	Name: "Ruhin",
	Age: 21,
	Salary: 0,
}
p2 := &user1
fmt.Println(p2.Age) // no need to write (*p2).Age
```

Go নিজে থেকে pointer কে dereference করে field টা দেয়। অসাধারণ, তাই না?

---

## Full Code Example from Class:

```go
package main

import "fmt"

type User struct {
	Name   string
	Age    int
	Salary float64
}

func print(numbers [3]int) {
	fmt.Println(numbers)
}

func print2(numbers *[3]int) {
	fmt.Println(numbers)
}

func main() {
	x := 20
	p := &x
	*p = 30

	fmt.Println(x)           // 30
	fmt.Println("Address:", p)
	fmt.Println("Value:", *p)

	arr := [3]int{1, 2, 3}
	print(arr)   // pass by value
	print2(&arr) // pass by reference

	user1 := User{
		Name:   "Ruhin",
		Age:    21,
		Salary: 0,
	}
	p2 := &user1
	fmt.Println(p2.Age)
}
```

---

# মেমরি লেআউটের ভিজ্যুয়ালাইজেশন (CLI)

```
+--------------------+----------------------------------+
| সেগমেন্ট             |  কি আছে                 |
+--------------------+----------------------------------+
| Code Segment       | main(), print(), print2()        |
| Data Segment       | (এখানে কোনো গ্লোবাল ভ্যারিয়েবল নেই)       |
| Stack              | arr [3]int {1,2,3}, x=30         |
|                    | p (pointer to x)                 |
|                    | user1 (User struct)              |
|                    | p2 (pointer to user1)            |
| Heap               | (এই প্রোগ্রামে ব্যবহার হয়নি) |
+--------------------+----------------------------------+
```

### বিস্তারিত মেমরি ভিজ্যুয়ালাইজেশন (এড্রেস এবং মানসহ)

```
Stack Memory:

[ Address 0x1000 ] x = 30
[ Address 0x1004 ] p -> 0x1000 (address of x)
[ Address 0x1008 ] arr = [1, 2, 3]
[ Address 0x1010 ] user1 = {"Ruhin", 21, 0.0}
[ Address 0x1018 ] p2 -> 0x1010 (address of user1)

Code Segment:
- Compiled code of main, print, print2

Data Segment:
-  খালি (কোন গ্লোবাল ভ্যারিয়েবল নেই)

Heap:
- এই প্রোগ্রামে ব্যবহার হয়নি
```

---

# আরও উদাহরণ: পয়েন্টার ব্যবহার করে দুইটি নম্বর বিনিময় (Swap) করা

**পয়েন্টার ছাড়া (FAIL)**:

```go
func swap(x, y int) {
	temp := x
	x = y
	y = temp
}

func main() {
	a, b := 1, 2
	swap(a, b)
	fmt.Println(a, b) // still 1 2
}
```

**পয়েন্টার ব্যবহার করে (WIN)**:

```go
func swap(x, y *int) {
	temp := *x
	*x = *y
	*y = temp
}

func main() {
	a, b := 1, 2
	swap(&a, &b)
	fmt.Println(a, b) // 2 1
}
```

---

# সংক্ষিপ্ত সারাংশ

- `&` দিয়ে ভেরিয়েবলের ঠিকানা পাওয়া যায়।
- `*` দিয়ে ঠিকানায় থাকা মান পাওয়া যায়।
- Pointers = efficient + powerful
- struct pointer থাকলে Go নিজে থেকে field access দেয়, আলাদা dereference করার দরকার নেই।
- বড় ডেটা (array, struct) পাস করার সময় পয়েন্টার ব্যবহার করে মেমোরি সেভ করা যায়।

---

**Bro Tip**:

> When in doubt, think: "Am I copying a whole dang castle, or just giving a map to it?"

Pointers = the map. ✅

[**Author:** @ifrunruhin12, @nazma98
**Date:** 2025-05-01 - 2025-05-17
**Category:** interview-qa/class-wise
]
