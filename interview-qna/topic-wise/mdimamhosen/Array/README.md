[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/arrays
**Tags:** [go, arrays, functions]
]

# Arrays in Go

## Declaring Arrays

You can declare an array in Go using the following syntax:

```go
var arrayName [size]elementType
```

Example:

```go
var numbers [5]int
```

## Initializing Arrays

Arrays can be initialized at the time of declaration:

```go
var numbers = [5]int{1, 2, 3, 4, 5}
```

Or you can use the shorthand notation:

```go
numbers := [5]int{1, 2, 3, 4, 5}
```

## Accessing Array Elements

Array elements are accessed using the index, which starts from 0:

```go
fmt.Println(numbers[0]) // Output: 1
```

## Iterating Over Arrays

You can iterate over arrays using a `for` loop:

```go
for i := 0; i < len(numbers); i++ {
    fmt.Println(numbers[i])
}
```

Or using the `range` keyword:

```go
for index, value := range numbers {
    fmt.Println(index, value)
}
```

## Multidimensional Arrays

Go supports multidimensional arrays. A two-dimensional array is declared as follows:

```go
var matrix [3][3]int
```

Example:

```go
matrix := [3][3]int{
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
}
```

## Array of Arrays

You can also create an array of arrays:

```go
var arrayOfArrays [2][3]int
```

Example:

```go
arrayOfArrays := [2][3]int{
    {1, 2, 3},
    {4, 5, 6},
}
```

## Passing Arrays to Functions

Arrays can be passed to functions by value, meaning the function receives a copy of the array:

```go
func printArray(arr [5]int) {
    for i := 0; i < len(arr); i++ {
        fmt.Println(arr[i])
    }
}
```

To modify the original array, you can pass a pointer to the array:

```go
func modifyArray(arr *[5]int) {
    arr[0] = 100
}
```

## Frequently Asked Questions

### Q1: How can I find the length of an array in Go?

You can use the built-in `len()` function to find the length of an array.

Example:

```go
package main

import "fmt"

func main() {
    arr := [5]int{1, 2, 3, 4, 5}
    fmt.Println("Length of the array:", len(arr)) // Output: 5
}
```

### Q2: How do I copy an array in Go?

In Go, you can copy an array by simply assigning it to another array of the same type and size.

Example:

```go
package main

import "fmt"

func main() {
    original := [3]int{1, 2, 3}
    copy := original
    fmt.Println("Original:", original) // Output: [1 2 3]
    fmt.Println("Copy:", copy)         // Output: [1 2 3]
}
```

### Q3: How can I pass an array to a function without copying it?

To avoid copying, you can pass a pointer to the array.

Example:

```go
package main

import "fmt"

func modifyArray(arr *[3]int) {
    arr[0] = 42
}

func main() {
    arr := [3]int{1, 2, 3}
    modifyArray(&arr)
    fmt.Println("Modified array:", arr) // Output: [42 2 3]
}
```
