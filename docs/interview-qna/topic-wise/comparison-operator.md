[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-19
**Category:** e.g., interview-qa/topic_name
**Tags:** [go, concurrency, channels]
]

# Comparison Operators

## ভূমিকা

Go programming ভাষায় **comparison operators** ব্যবহার করা হয় দুটি মানের মধ্যে তুলনা করতে। এই অপারেটরগুলো দুইটি মানের মধ্যে সম্পর্ক যাচাই করে এবং **boolean** ফলাফল দেয় — `true` অথবা `false`।

এগুলো সাধারণত ব্যবহৃত হয়:

* শর্ত (conditions) চেক করার জন্য `if`, `for`, বা `switch` এর ভিতরে
* মান যাচাইয়ের জন্য (যেমন, একটি সংখ্যা আরেকটি সংখ্যার চেয়ে বড় কিনা)
* equality বা inequality নির্ধারণ করতে

Go-তে comparison operators কাজ করে যেসব টাইপে:

* Numbers (int, float)
* Strings
* Arrays
* Structs (যদি সব ফিল্ড comparable হয়)
* Pointers
* Custom types (যাদের underlying type comparable হয়)

কিছু টাইপ, যেমন **slice, map, function**, এই অপারেটর দিয়ে সরাসরি তুলনা করা যায় না, তাই compile-time এ error হয়ে থাকে যদি চেষ্টা করা হয়।


---

## Comparison operators ব্যবহার হয় দুটি মানের মধ্যে তুলনা করতে

| Operator | নাম                              | উদাহরণ |
| -------- | -------------------------------- | ------ |
| ==       | সমান (Equal to)                  | x == y |
| !=       | অসমান (Not equal)                | x != y |
| >        | বড় (Greater than)                | x > y  |
| <        | ছোট (Less than)                  | x < y  |
| >=       | বড় বা সমান (Greater or equal to) | x >= y |
| <=       | ছোট বা সমান (Less or equal to)   | x <= y |

```go
package main

import "fmt"

func main() {
	fmt.Println(2 > 2) // false
	fmt.Println(2 < 2) // false
	fmt.Println(2 >= 2) // true
	fmt.Println(2 <= 2) // true
	fmt.Println(2 == 2) // true
	fmt.Println(2 != 2) // false
}
```
---

## Frequently Asked Questions

### 1. Go-তে comparison operators কেনো ব্যবহার করা হয়?

**উত্তর:** Comparison operators ব্যবহার করা হয় দুটি মানের তুলনা করে boolean মান (true অথবা false) return করার জন্য।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	x := 10
	y := 20
	fmt.Println(x > y) // false
	fmt.Println(x < y) // true
}
```

---

### 2. Go-তে কি string এর সাথে comparison operators ব্যবহার করা যায়?

**উত্তর:** হ্যাঁ, string-এর lexicographical (dictionary) order অনুযায়ী তুলনা করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	fmt.Println("apple" > "banana") // false
	fmt.Println("apple" < "banana") // true
}
```

---

### 3. Struct-এর ক্ষেত্রে `==` operator কিভাবে কাজ করে?

**উত্তর:** যদি struct-এর সব ফিল্ডই comparable হয়, তাহলে struct একে অপরের সাথে `==` দিয়ে তুলনা করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

type Point struct {
	x, y int
}

func main() {
	p1 := Point{1, 2}
	p2 := Point{1, 2}
	fmt.Println(p1 == p2) // true
}
```

---

### 4. যদি দুইটা আলাদা টাইপ compare করা হয় তাহলে কী হবে?

**উত্তর:** দুইটি ভিন্ন টাইপ compare করলে compile-time এ error দিবে।

**উদাহরণ:**

```go
package main

func main() {
	// Uncommenting the following line will cause a compile-time error
	// fmt.Println(10 == "10")
}
```

---

### 5. Pointer এর ক্ষেত্রে comparison operators ব্যবহার করা যায় কি?

**উত্তর:** হ্যাঁ, pointer এর মধ্যে `==` এবং `!=` ব্যবহার করে তাদের equality বা inequality চেক করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	a := 10
	b := 10
	pa := &a
	pb := &b
	fmt.Println(pa == pb) // false
}
```

---

### 6. `!=` operator কিভাবে কাজ করে?

**উত্তর:** `!=` operator চেক করে দুটি মান সমান না হলে `true` return করে।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	x := 5
	y := 10
	fmt.Println(x != y) // true
}
```

---

### 7. Go-তে কি array এর মধ্যে তুলনা করা যায়?

**উত্তর:** হ্যাঁ, যদি array-র সব elements comparable হয়, তাহলে `==` এবং `!=` দিয়ে array তুলনা করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	a1 := [3]int{1, 2, 3}
	a2 := [3]int{1, 2, 3}
	fmt.Println(a1 == a2) // true
}
```

---

### 8. দুটি slice তুলনা করলে কী হবে?

**উত্তর:** Go-তে slice `==` দিয়ে compare করা যায় না, শুধুমাত্র `nil` এর সাথে compare করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	s1 := []int{1, 2, 3}
	s2 := []int{1, 2, 3}
	fmt.Println(s1 == nil) // false
	// Uncommenting the following line will cause a compile-time error
	// fmt.Println(s1 == s2)
}
```

---

### 9. Floating-point মান compare করলে Go কীভাবে handle করে?

**উত্তর:** Floating-point সংখ্যা তুলনা করা গেলেও, precision সংক্রান্ত সমস্যা থাকতে পারে। তাই সাবধান থাকতে হয়।

**উদাহরণ:**

```go
package main

import "fmt"

func main() {
	x := 0.1 + 0.2
	y := 0.3
	fmt.Println(x == y) // false due to precision issues
}
```

---

### 10. Custom type এর মধ্যে কি comparison operators ব্যবহার করা যায়?

**উত্তর:** যদি custom type-এর underlying type comparable হয়, তাহলে comparison operators ব্যবহার করা যায়।

**উদাহরণ:**

```go
package main

import "fmt"

type Age int

func main() {
	var a1 Age = 30
	var a2 Age = 25
	fmt.Println(a1 > a2) // true
}
```
