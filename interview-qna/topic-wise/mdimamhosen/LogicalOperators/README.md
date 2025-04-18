[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/logical_operators
**Tags:** [go, logical_operators]
]

# Logical Operators

## Logical operators are used to determine the logic between variables or values.

## 1. Logical and (&&)

### Returns true if both statements are true

## 2. Logical or (||)

### Returns true if one statements is true

## 3. Logical not (!)

### Reverse the result, returns false if the result is true

```go
package main

import "fmt"

func main() {
	fmt.Println(true && true) // true
	fmt.Println(true && false) // false

	fmt.Println(true || true) // true
	fmt.Println(false || false) // false

	fmt.Println(!true) // false
	fmt.Println(!false) // true
}
```

## Frequently Asked Questions

### 1. What is the difference between `&&` and `||` in Go?

**Answer:**

- `&&` (Logical AND) returns true only if both conditions are true.
- `||` (Logical OR) returns true if at least one condition is true.

**Code Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println(true && false) // false
	fmt.Println(true || false) // true
}
```

### 2. How does the `!` operator work in Go?

**Answer:**

- The `!` (Logical NOT) operator reverses the boolean value.

**Code Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println(!true)  // false
	fmt.Println(!false) // true
}
```

### 3. Can logical operators be used with non-boolean values?

**Answer:**

- No, logical operators in Go work only with boolean values.

### 4. How can I combine multiple logical operators in a single expression?

**Answer:**

- You can combine them using parentheses to control precedence.

**Code Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println((true && false) || true) // true
}
```

### 5. What is the precedence of logical operators in Go?

**Answer:**

- `!` has the highest precedence, followed by `&&`, and then `||`.

**Code Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println(!true || false && true) // false
}
```

### 6. How can I use logical operators in conditional statements?

**Answer:**

- Logical operators are often used in `if` statements to combine conditions.

**Code Example:**

```go
package main

import "fmt"

func main() {
	if true && !false {
		fmt.Println("Condition met")
	}
}
```

### 7. Can logical operators short-circuit in Go?

**Answer:**

- Yes, `&&` and `||` short-circuit. For example, `&&` stops evaluating if the first condition is false.

**Code Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println(false && (5 > 3)) // false (5 > 3 is not evaluated)
}
```

### 8. How can I debug logical expressions in Go?

**Answer:**

- Use `fmt.Println` to print intermediate results.

**Code Example:**

```go
package main

import "fmt"

func main() {
	condition1 := true
	condition2 := false
	fmt.Println(condition1 && condition2) // false
}
```

### 9. Can logical operators be used in loops?

**Answer:**

- Yes, they can be used in loop conditions.

**Code Example:**

```go
package main

import "fmt"

func main() {
	for i := 0; i < 10 && i%2 == 0; i++ {
		fmt.Println(i)
	}
}
```

### 10. What happens if I use logical operators with nil values?

**Answer:**

- Logical operators cannot be directly used with `nil`. You need to compare `nil` explicitly.

**Code Example:**

```go
package main

import "fmt"

func main() {
	var ptr *int = nil
	fmt.Println(ptr == nil || true) // true
}
```
