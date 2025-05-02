[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/conditional-statements
**Tags:** [go, conditional-statements, if-else]
]

## Go Conditions

### Conditional statements allow us to control the structure of our program.

### There are different ways by which we can control the flow of our program, (If, else if, else) are one of them.

### (If, else if, else) statments allow us to make "decisions" while our program is running, They're also called (conditional statments) in programming.

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

## Frequently Asked Questions (FAQs)

### 1. **What is the syntax of an if-else statement in Go?**

**Answer:**
The syntax of an if-else statement in Go is as follows:

```go
if condition {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}
```

**Example:**

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

### 2. **Can we use an if statement without an else block?**

**Answer:**
Yes, an if statement can be used without an else block.
**Example:**

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

### 3. **What is an else-if ladder in Go?**

**Answer:**
An else-if ladder is used to check multiple conditions sequentially.
**Example:**

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

### 4. **How do you use a short statement in an if condition?**

**Answer:**
A short statement can be used to initialize a variable within an if condition.
**Example:**

```go
package main
import "fmt"

func main() {
	if num := 10; num%2 == 0 {
		fmt.Println("Even Number")
	}
}
```

### 5. **Can we nest if-else statements in Go?**

**Answer:**
Yes, if-else statements can be nested.
**Example:**

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

### 6. **What is the difference between if-else and switch statements?**

**Answer:**
If-else is used for conditional branching, while switch is used for selecting one of many blocks of code.
**Example:**

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

### 7. **How do you handle multiple conditions in a single if statement?**

**Answer:**
Logical operators like `&&` (AND) and `||` (OR) can be used to handle multiple conditions.
**Example:**

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

### 8. **What happens if the condition in an if statement is not a boolean?**

**Answer:**
In Go, the condition in an if statement must evaluate to a boolean. Otherwise, it will result in a compilation error.
**Example:**

```go
// This will cause a compilation error
// if 10 {
//     fmt.Println("Invalid Condition")
// }
```

### 9. **Can we use a function call in an if condition?**

**Answer:**
Yes, a function call can be used in an if condition.
**Example:**

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

### 10. **How do you use if-else with user input?**

**Answer:**
You can use the `fmt.Scan` function to take user input and use it in an if-else statement.
**Example:**

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
