[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** e.g., interview-qa/for-loop
**Tags:** [go, loops, for-loop]
]

# For Loop

## A "For" Loop is used to repeat a specific block of code a known number of times.

## For example, if we want to check the grade of every student in the class, we loop from 1 to that number. When the number of times is not known before hand, we use a "While" loop.

```go
// Sudo Syntax
for initialExpression; condition; increment { <code> }
```

```go
package main
import ("fmt")

func main() {
  for i:=0; i < 5; i++ {
    fmt.Println(i)
  }
}
```

# The continue Statement

## The continue statement is used to skip one or more iterations in the loop. It then continues with the next iteration in the loop.

```go
package main
import ("fmt")

func main() {
  for i:=0; i < 5; i++ {
    if i == 3 {
      continue
    }
   fmt.Println(i)
  }
}
```

# The break Statement

## The break statement is used to break/terminate the loop execution.

```go
package main
import ("fmt")

func main() {
  for i:=0; i < 5; i++ {
    if i == 3 {
      break
    }
   fmt.Println(i)
  }
}
```

# Nested Loops

## Loop inside other loop is known as Nested Loop.

```go
package main

import (
	"fmt"
)

func main() {
	for i := 0; i < 20; i++ {
		fmt.Println("-----OUTER------", i)
		for j := 0; j < 10; j++ {
			fmt.Println("-----INNER------", j)
		}
	}
}
```

# Frequently Asked Questions

## 1. How to iterate over an array using a for loop?

### Answer:

You can use a for loop to iterate over an array by using the index to access each element.

```go
package main
import ("fmt")

func main() {
  arr := [5]int{1, 2, 3, 4, 5}
  for i := 0; i < len(arr); i++ {
    fmt.Println(arr[i])
  }
}
```

## 2. How to use a for loop with a range?

### Answer:

The `range` keyword can be used to iterate over elements of an array, slice, or map.

```go
package main
import ("fmt")

func main() {
  arr := []int{1, 2, 3, 4, 5}
  for index, value := range arr {
    fmt.Printf("Index: %d, Value: %d\n", index, value)
  }
}
```

## 3. How to create an infinite loop in Go?

### Answer:

An infinite loop can be created by omitting all three components of the for loop.

```go
package main
import ("fmt")

func main() {
  for {
    fmt.Println("Infinite Loop")
  }
}
```

## 4. How to break out of a nested loop?

### Answer:

You can use a label to break out of a nested loop.

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
      fmt.Printf("i: %d, j: %d\n", i, j)
    }
  }
}
```

## 5. How to skip even numbers in a loop?

### Answer:

Use the `continue` statement to skip even numbers.

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

## 6. How to iterate over a map using a for loop?

### Answer:

Use the `range` keyword to iterate over key-value pairs in a map.

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

## 7. How to use a for loop to calculate the factorial of a number?

### Answer:

You can use a for loop to calculate the factorial of a number.

```go
package main
import ("fmt")

func main() {
  num := 5
  factorial := 1
  for i := 1; i <= num; i++ {
    factorial *= i
  }
  fmt.Printf("Factorial of %d is %d\n", num, factorial)
}
```

## 8. How to iterate over a string character by character?

### Answer:

Use the `range` keyword to iterate over a string.

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

## 9. How to reverse a slice using a for loop?

### Answer:

You can use a for loop to reverse a slice in place.

```go
package main
import ("fmt")

func main() {
  slice := []int{1, 2, 3, 4, 5}
  for i, j := 0, len(slice)-1; i < j; i, j = i+1, j-1 {
    slice[i], slice[j] = slice[j], slice[i]
  }
  fmt.Println(slice)
}
```

## 10. How to sum elements of a slice using a for loop?

### Answer:

Use a for loop to iterate over the slice and calculate the sum.

```go
package main
import ("fmt")

func main() {
  slice := []int{1, 2, 3, 4, 5}
  sum := 0
  for _, value := range slice {
    sum += value
  }
  fmt.Printf("Sum of elements: %d\n", sum)
}
```
