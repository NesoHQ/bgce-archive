[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-19
**Category:** interview-qa/conditional-statements
**Tags:** [go, conditional-statements, if-else]
]

## Go Conditions

### Conditional statements আমাদের program এর structure নিয়ন্ত্রণ করতে সাহায্য করে।

### আমাদের program এর flow নিয়ন্ত্রণ করার বিভিন্ন উপায় রয়েছে, যার মধ্যে (if, else if, else) অন্যতম।

### (if, else if, else) statement ব্যবহার করে আমরা প্রোগ্রাম চলাকালীন সময়ে সিদ্ধান্ত (decision) নিতে পারি। এজন্য এগুলোকে প্রোগ্রামিংয়ে **conditional statements** বলা হয়।

```go
    // Sudo Syntax
     if condition { <code> }
     else if condition { <code> }
     else { <code> }
```

```go
// Actual Code
package main
import "fmt"

func main() {
	password := "12345678"
	if len(password) > 7 {
		fmt.Println("Valid Password")
	} else {
		fmt.Println("Invalid Password")
	}
}
```

---

## Frequently Asked Questions (FAQs)

### 1. **Go-তে if-else statement এর syntax কেমন হয়?**

**উত্তর:**
Go-তে if-else statement এর syntax নিচের মতো:

```go
if condition {
    // condition true 
} else {
    // condition false 
}
```

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	number := 10
	if number%2 == 0 {
		fmt.Println("Even Number")
	} else {
		fmt.Println("Odd Number")
	}
}
```

---

### 2. **if statement কি else ছাড়া ব্যবহার করা যায়?**

**উত্তর:**
হ্যাঁ, if statement আপনি একাই ব্যবহার করতে পারেন, else block না দিয়েও কাজ করবে।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	number := 5
	if number > 0 {
		fmt.Println("Positive Number")
	}
}
```

---

### 3. **else-if ladder বলতে কী বোঝায়?**

**উত্তর:**
else-if ladder ব্যবহার করে একাধিক condition ধারাবাহিকভাবে যাচাই করা যায়।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	score := 85
	if score >= 90 {
		fmt.Println("Grade: A")
	} else if score >= 75 {
		fmt.Println("Grade: B")
	} else {
		fmt.Println("Grade: C")
	}
}
```

---

### 4. **if condition-এ short statement কীভাবে ব্যবহার করা যায়?**

**উত্তর:**
short statement দিয়ে আপনি কোনো variable initialize করে সরাসরি condition check করতে পারেন।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	if num := 10; num%2 == 0 {
		fmt.Println("Even Number")
	}
}
```

---

### 5. **Go-তে nested if-else statement ব্যবহার করা যায় কি?**

**উত্তর:**
হ্যাঁ, Go-তে if-else statementকে nested অর্থাৎ একটির ভিতরে আরেকটি লিখে ব্যবহার করা যায়।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	number := 15
	if number > 0 {
		if number%2 == 0 {
			fmt.Println("Positive Even Number")
		} else {
			fmt.Println("Positive Odd Number")
		}
	} else {
		fmt.Println("Non-Positive Number")
	}
}
```

---

### 6. **if-else এবং switch statement এর মধ্যে পার্থক্য কী?**

**উত্তর:**
if-else মূলত বিভিন্ন condition অনুযায়ী branching করতে ব্যবহৃত হয়, আর switch ব্যবহার করা হয় একাধিক নির্দিষ্ট মানের মধ্যে একটিকে বাছাই করতে।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	day := 3
	switch day {
	case 1:
		fmt.Println("Monday")
	case 2:
		fmt.Println("Tuesday")
	case 3:
		fmt.Println("Wednesday")
	default:
		fmt.Println("Invalid Day")
	}
}
```

---

### 7. **একই if statement একাধিক condition কীভাবে check করবেন?**

**উত্তর:**
একাধিক condition check করতে `&&` (AND) এবং `||` (OR) এর মতো logical operators ব্যবহার করা হয়।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	number := 15
	if number > 0 && number%3 == 0 {
		fmt.Println("Positive and Divisible by 3")
	}
}
```

---

### 8. **if statement যদি condition boolean না হয় তাহলে কী হবে?**

**উত্তর:**
Go-তে if এর condition অবশ্যই boolean হতে হবে। নাহলে compile-time error হবে।

**উদাহরণ:**

```go
// this code will give compile time error
// if 10 {
//     fmt.Println("Invalid Condition")
// }
```

---

### 9. **if condition-এর মধ্যে function call ব্যবহার করা যায় কি?**

**উত্তর:**
হ্যাঁ, আপনি function call ব্যবহার করে return হওয়া boolean মানের ওপর ভিত্তি করে condition check করতে পারেন।

**উদাহরণ:**

```go
package main
import "fmt"

func isEven(num int) bool {
	return num%2 == 0
}

func main() {
	if isEven(10) {
		fmt.Println("Even Number")
	}
}
```

---

### 10. **User input নিয়ে কীভাবে if-else ব্যবহার করবেন?**

**উত্তর:**
`fmt.Scan` ব্যবহার করে user থেকে input নিয়ে তারপর সেই input-এর ওপর ভিত্তি করে if-else ব্যবহার করা যায়।

**উদাহরণ:**

```go
package main
import "fmt"

func main() {
	var age int
	fmt.Print("Enter your age: ")
	fmt.Scan(&age)
	if age >= 18 {
		fmt.Println("You are eligible to vote.")
	} else {
		fmt.Println("You are not eligible to vote.")
	}
}
```
