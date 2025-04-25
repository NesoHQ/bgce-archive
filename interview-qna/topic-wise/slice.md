[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/slices
**Tags:** [go, slices, arrays, make]

# Slices

Slices are also used to store multiple values of the same type in a single variable, however unlike arrays, the length of a slice can grow and shrink as you see fit.

There are several ways to create a slice 👇

1. Using the `[]datatype{values}` format
2. Create a slice from an array
3. Using the `make()` function

```go
// name := []datatype{values}
// name := []int{}
package main
import ("fmt")

func main() {
  myslice1 := []int{}
  fmt.Println(len(myslice1))
  fmt.Println(cap(myslice1))
  fmt.Println(myslice1)

  myslice2 := []string{"Go", "Slices", "Are", "Powerful"}
  fmt.Println(len(myslice2))
  fmt.Println(cap(myslice2))
  fmt.Println(myslice2)
}
```

## Make() Method

The `make` function will create a zeroed array and return a slice referencing an array. This is a great way to create a dynamically sized array. To create a slice using the `make` function, we need to specify three arguments: type, length, and capacity.

```go
package main
import "fmt"

func main() {
    slice := make([]string, 3, 5)
    fmt.Println("Length", len(slice))
    fmt.Println("Capacity", cap(slice))
    fmt.Println(slice)
}
```

## Frequently Asked Questions

### 1. How do you create an empty slice in Go?

**Answer:** Use `[]datatype{}` to create an empty slice.

```go
package main
import "fmt"

func main() {
    myslice := []int{}
    fmt.Println("Empty Slice:", myslice) // []
}
```

### 2. How do you create a slice with initial values?

**Answer:** Use `[]datatype{values}`.

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    fmt.Println("Slice with Values:", myslice) // [1 2 3]
}
```

### 3. How do you create a slice from an array?

**Answer:** Use slicing syntax `array[start:end]`.

```go
package main
import "fmt"

func main() {
    arr := [5]int{1, 2, 3, 4, 5}
    myslice := arr[1:4]
    fmt.Println("Slice from Array:", myslice) // [2 3 4]
}
```

### 4. How do you use the `make` function to create a slice?

**Answer:** Use `make(type, length, capacity)`.

```go
package main
import "fmt"

func main() {
    myslice := make([]int, 3, 5)
    fmt.Println("Slice with Make:", myslice) // [0 0 0]
}
```

### 5. How do you append elements to a slice?

**Answer:** Use the `append` function.

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    myslice = append(myslice, 4, 5)
    fmt.Println("Appended Slice:", myslice) // [1 2 3 4 5]
}
```

### 6. How do you copy one slice to another?

**Answer:** Use the `copy` function.

```go
package main
import "fmt"

func main() {
    src := []int{1, 2, 3}
    dest := make([]int, len(src))
    copy(dest, src)
    fmt.Println("Copied Slice:", dest) // [1 2 3]
}
```

### 7. How do you find the length and capacity of a slice?

**Answer:** Use `len(slice)` and `cap(slice)`.

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    fmt.Println("Length:", len(myslice)) // 3
    fmt.Println("Capacity:", cap(myslice)) // 3
}
```

### 8. How do you create a multidimensional slice?

**Answer:** Use slices of slices.

```go
package main
import "fmt"

func main() {
    matrix := [][]int{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    }
    fmt.Println("Multidimensional Slice:", matrix)
}
```

### 9. How do you remove an element from a slice?

**Answer:** Use slicing to exclude the element.

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3, 4, 5}
    myslice = append(myslice[:2], myslice[3:]...)
    fmt.Println("Slice after Removal:", myslice) // [1 2 4 5]
}
```

### 10. How do you iterate over a slice in Go?

**Answer:** Use a `for` loop or `range`.

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    for i, v := range myslice {
        fmt.Printf("Index: %d, Value: %d\n", i, v)
    }
}
```

## Array vs Slice

- ongbhongchong vugichugi