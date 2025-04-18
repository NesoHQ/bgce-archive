[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/operators
**Tags:** [go, operators, arithmetic, assignment]
]

# Operators are used to perform operations on variables and values

## Arithmetic Operators

### 1. Addition: The + operator adds two operands. For example, x+y.

### 2. Subtraction: The - operator subtracts two operands. For example, x-y.

### 3. Multiplication: The * operator multiplies two operands. For example, x*y.

### 4. Division: The / operator divides the first operand by the second. For example, x/y.

### 5. Modulus: Returns the division remainder

### 6. Increment: The ++ Increases the value of a variable by 1

### 7. Decrement: The -- Decreases the value of a variable by 1

```go
package main
import "fmt"

func main() {
	fmt.Println(2 + 2) // 4
	fmt.Println(2 - 2) // 0
	fmt.Println(2 * 2) // 4
	fmt.Println(2 / 2) // 1
	fmt.Println(2 % 2) // 0
}
```

### Increment

```go
package main
import ("fmt")

func main() {
  x:= 10
  x++ // Add one new value (increment)
  fmt.Println(x)
}
```

### Decrement

```go
package main
import ("fmt")

func main() {
  x:= 10
  x-- // Remove one new value (decrement)
  fmt.Println(x)
}
```

## Assignment Operators

### Assignment operators are used to assign values to variables.

| Operator | Example | Same As    |
| -------- | ------- | ---------- |
| =        | x = 5   | x = 5      |
| +=       | x += 3  | x = x + 3  |
| -=       | x -= 3  | x = x - 3  |
| \*=      | x \*= 3 | x = x \* 3 |
| /=       | x /= 3  | x = x / 3  |
| %=       | x %= 3  | x = x % 3  |

## Questions and Examples

### 1. Create a variable named `lgNumber`, store 1000 as a value, and perform various operations.

```go
package main
import ("fmt")

func main() {
  lgNumber := 1000

  // Add that variable with itself
  sum := lgNumber + lgNumber
  fmt.Println("Addition:", sum) // 2000

  // Subtract that variable by itself
  difference := lgNumber - lgNumber
  fmt.Println("Subtraction:", difference) // 0

  // Multiply that variable with itself
  product := lgNumber * lgNumber
  fmt.Println("Multiplication:", product) // 1000000

  // Divide that variable with itself
  quotient := lgNumber / lgNumber
  fmt.Println("Division:", quotient) // 1
}
```

## Frequently Asked Questions

### 1. How do you perform addition and subtraction in Go?

**Answer:** Use the `+` operator for addition and `-` for subtraction.

```go
package main
import "fmt"

func main() {
    a, b := 10, 5
    fmt.Println("Addition:", a+b) // 15
    fmt.Println("Subtraction:", a-b) // 5
}
```

### 2. How do you calculate the remainder of a division in Go?

**Answer:** Use the `%` operator for modulus.

```go
package main
import "fmt"

func main() {
    fmt.Println("Remainder:", 10%3) // 1
}
```

### 3. Can you increment a variable in Go?

**Answer:** Yes, use `++` to increment a variable by 1.

```go
package main
import "fmt"

func main() {
    x := 5
    x++
    fmt.Println("Incremented Value:", x) // 6
}
```

### 4. How do you assign and add a value to a variable in Go?

**Answer:** Use the `+=` operator.

```go
package main
import "fmt"

func main() {
    x := 10
    x += 5
    fmt.Println("Updated Value:", x) // 15
}
```

### 5. How do you multiply and assign a value to a variable in Go?

**Answer:** Use the `*=` operator.

```go
package main
import "fmt"

func main() {
    x := 10
    x *= 2
    fmt.Println("Updated Value:", x) // 20
}
```

### 6. How do you divide and assign a value to a variable in Go?

**Answer:** Use the `/=` operator.

```go
package main
import "fmt"

func main() {
    x := 10
    x /= 2
    fmt.Println("Updated Value:", x) // 5
}
```

### 7. How do you decrement a variable in Go?

**Answer:** Use `--` to decrement a variable by 1.

```go
package main
import "fmt"

func main() {
    x := 5
    x--
    fmt.Println("Decremented Value:", x) // 4
}
```

### 8. How do you perform multiple arithmetic operations in one line?

**Answer:** Combine operators in a single expression.

```go
package main
import "fmt"

func main() {
    result := (10 + 5) * 2 - 3
    fmt.Println("Result:", result) // 27
}
```

### 9. How do you check if a number is even or odd in Go?

**Answer:** Use the modulus operator `%`.

```go
package main
import "fmt"

func main() {
    num := 7
    if num%2 == 0 {
        fmt.Println("Even")
    } else {
        fmt.Println("Odd")
    }
}
```

### 10. How do you swap two numbers without using a third variable in Go?

**Answer:** Use arithmetic operations.

```go
package main
import "fmt"

func main() {
    a, b := 5, 10
    a = a + b
    b = a - b
    a = a - b
    fmt.Println("Swapped Values:", a, b) // 10, 5
}
```
