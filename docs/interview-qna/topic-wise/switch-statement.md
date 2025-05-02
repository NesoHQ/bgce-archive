[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** e.g., interview-qa/topic_name
**Tags:** [go, concurrency, channels]
]

# The switch Statement

## The switch statement allows us to execute one code block among many alternatives.

```go
package main
import ("fmt")

func main() {
  day := 8

  switch day {
  case 1:
    fmt.Println("Monday")
  case 2:
    fmt.Println("Tuesday")
  case 3:
    fmt.Println("Wednesday")
  case 4:
    fmt.Println("Thursday")
  case 5:
    fmt.Println("Friday")
  case 6:
    fmt.Println("Saturday")
  case 7:
    fmt.Println("Sunday")
  default:
    fmt.Println("Not a weekday")
  }
}
```

## Frequently Asked Questions

### 1. What is a `switch` statement in Go?

**Answer:** A `switch` statement is used to select one of many code blocks to execute. It is an alternative to using multiple `if-else` statements.

**Example:**

```go
package main
import "fmt"

func main() {
    num := 2
    switch num {
    case 1:
        fmt.Println("One")
    case 2:
        fmt.Println("Two")
    case 3:
        fmt.Println("Three")
    default:
        fmt.Println("Other number")
    }
}
```

### 2. Can we use multiple values in a single `case`?

**Answer:** Yes, multiple values can be grouped in a single `case`.

**Example:**

```go
package main
import "fmt"

func main() {
    char := 'a'
    switch char {
    case 'a', 'e', 'i', 'o', 'u':
        fmt.Println("Vowel")
    default:
        fmt.Println("Consonant")
    }
}
```

### 3. Is `break` required in Go's `switch` statement?

**Answer:** No, `break` is not required as Go automatically breaks out of the `switch` after executing a `case`.

### 4. How to use `fallthrough` in a `switch` statement?

**Answer:** The `fallthrough` keyword forces the execution of the next `case` even if the condition does not match.

**Example:**

```go
package main
import "fmt"

func main() {
    num := 1
    switch num {
    case 1:
        fmt.Println("One")
        fallthrough
    case 2:
        fmt.Println("Two")
    default:
        fmt.Println("Default")
    }
}
```

### 5. Can `switch` work without an expression?

**Answer:** Yes, a `switch` can work without an expression, making it similar to a series of `if-else` statements.

**Example:**

```go
package main
import "fmt"

func main() {
    num := 10
    switch {
    case num < 0:
        fmt.Println("Negative")
    case num == 0:
        fmt.Println("Zero")
    case num > 0:
        fmt.Println("Positive")
    }
}
```

### 6. Can we use a `switch` statement with strings?

**Answer:** Yes, `switch` can be used with strings.

**Example:**

```go
package main
import "fmt"

func main() {
    color := "red"
    switch color {
    case "red":
        fmt.Println("Stop")
    case "yellow":
        fmt.Println("Caution")
    case "green":
        fmt.Println("Go")
    default:
        fmt.Println("Unknown color")
    }
}
```

### 7. Can `switch` handle type assertions?

**Answer:** Yes, `switch` can be used to handle type assertions.

**Example:**

```go
package main
import "fmt"

func main() {
    var x interface{} = 42
    switch v := x.(type) {
    case int:
        fmt.Printf("%d is an int\n", v)
    case string:
        fmt.Printf("%s is a string\n", v)
    default:
        fmt.Println("Unknown type")
    }
}
```

### 8. Can `switch` be used with functions?

**Answer:** Yes, you can use a function's return value in a `switch` statement.

**Example:**

```go
package main
import "fmt"

func getNumber() int {
    return 3
}

func main() {
    switch getNumber() {
    case 1:
        fmt.Println("One")
    case 2:
        fmt.Println("Two")
    case 3:
        fmt.Println("Three")
    default:
        fmt.Println("Other number")
    }
}
```

### 9. Can `switch` be nested?

**Answer:** Yes, `switch` statements can be nested.

**Example:**

```go
package main
import "fmt"

func main() {
    num := 2
    switch num {
    case 1:
        fmt.Println("One")
    case 2:
        fmt.Println("Two")
        switch num {
        case 2:
            fmt.Println("Nested switch")
        }
    default:
        fmt.Println("Other number")
    }
}
```

### 10. What happens if no `case` matches and there is no `default`?

**Answer:** If no `case` matches and there is no `default`, the `switch` statement does nothing.

**Example:**

```go
package main
import "fmt"

func main() {
    num := 5
    switch num {
    case 1:
        fmt.Println("One")
    case 2:
        fmt.Println("Two")
    }
    // No output
}
```
