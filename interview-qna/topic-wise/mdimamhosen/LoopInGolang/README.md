[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** e.g., interview-qa/topic_name
**Tags:** [go, concurrency, channels]
]

# While Loop

## Unlike other programming languages, Go doesn't have a dedicated keyword for a while loop. However, we can use the for loop to perform the functionality of a while loop.

```go
// Program to print numbers between 0 and 10
package main
import ("fmt")

func main() {
  number := 0

  for number <= 10 {
    fmt.Println(number)
    number++
  }
}
```

## Frequently Asked Questions

### 1. How can we implement an infinite loop in Go?

**Answer:** In Go, an infinite loop can be implemented using the `for` loop without any condition.

```go
package main
import ("fmt")

func main() {
  for {
    fmt.Println("This is an infinite loop")
  }
}
```

### 2. How do you break out of a loop in Go?

**Answer:** Use the `break` statement to exit a loop prematurely.

```go
package main
import ("fmt")

func main() {
  for i := 0; i < 10; i++ {
    if i == 5 {
      break
    }
    fmt.Println(i)
  }
}
```

### 3. How do you skip an iteration in a loop in Go?

**Answer:** Use the `continue` statement to skip the current iteration and move to the next one.

```go
package main
import ("fmt")

func main() {
  for i := 0; i < 10; i++ {
    if i%2 == 0 {
      continue
    }
    fmt.Println(i)
  }
}
```

### 4. Can we use labels with loops in Go?

**Answer:** Yes, labels can be used to control nested loops.

```go
package main
import ("fmt")

func main() {
OuterLoop:
  for i := 0; i < 3; i++ {
    for j := 0; j < 3; j++ {
      if i == 1 && j == 1 {
        break OuterLoop
      }
      fmt.Println(i, j)
    }
  }
}
```

### 5. How do you implement a do-while loop in Go?

**Answer:** Go does not have a `do-while` loop, but it can be simulated using a `for` loop.

```go
package main
import ("fmt")

func main() {
  number := 0
  for {
    fmt.Println(number)
    number++
    if number > 5 {
      break
    }
  }
}
```

### 6. How can you iterate over a slice in Go?

**Answer:** Use the `range` keyword to iterate over a slice.

```go
package main
import ("fmt")

func main() {
  numbers := []int{1, 2, 3, 4, 5}
  for index, value := range numbers {
    fmt.Printf("Index: %d, Value: %d\n", index, value)
  }
}
```

### 7. How do you iterate over a map in Go?

**Answer:** Use the `range` keyword to iterate over a map.

```go
package main
import ("fmt")

func main() {
  myMap := map[string]int{"a": 1, "b": 2, "c": 3}
  for key, value := range myMap {
    fmt.Printf("Key: %s, Value: %d\n", key, value)
  }
}
```

### 8. How do you iterate over a string in Go?

**Answer:** Use the `range` keyword to iterate over a string.

```go
package main
import ("fmt")

func main() {
  str := "hello"
  for index, char := range str {
    fmt.Printf("Index: %d, Character: %c\n", index, char)
  }
}
```

### 9. How do you use a loop to calculate the factorial of a number in Go?

**Answer:** Use a `for` loop to calculate the factorial.

```go
package main
import ("fmt")

func main() {
  number := 5
  factorial := 1
  for i := 1; i <= number; i++ {
    factorial *= i
  }
  fmt.Println("Factorial:", factorial)
}
```

### 10. How do you use a loop to reverse a slice in Go?

**Answer:** Use a `for` loop to swap elements in the slice.

```go
package main
import ("fmt")

func main() {
  numbers := []int{1, 2, 3, 4, 5}
  for i, j := 0, len(numbers)-1; i < j; i, j = i+1, j-1 {
    numbers[i], numbers[j] = numbers[j], numbers[i]
  }
  fmt.Println("Reversed Slice:", numbers)
}
```
