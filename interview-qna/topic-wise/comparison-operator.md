[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** e.g., interview-qa/topic_name
**Tags:** [go, concurrency, channels]
]

# Comparison Operators

## Comparison operators are used to compare two values

| Operator | Name                     | Example |
| -------- | ------------------------ | ------- |
| ==       | Equal to                 | x == y  |
| !=       | Not equal                | x != y  |
| >        | Greater than             | x > y   |
| <        | Less than                | x < y   |
| >=       | Greater than or equal to | x >= y  |
| <=       | Less than or equal to    | x <= y  |

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

## Frequently Asked Questions

### 1. What is the purpose of comparison operators in Go?

**Answer:** Comparison operators are used to compare two values and return a boolean result (true or false).

**Example:**

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

### 2. Can comparison operators be used with strings in Go?

**Answer:** Yes, comparison operators can be used with strings to compare their lexicographical order.

**Example:**

```go
package main

import "fmt"

func main() {
	fmt.Println("apple" > "banana") // false
	fmt.Println("apple" < "banana") // true
}
```

### 3. How does the `==` operator work with structs in Go?

**Answer:** The `==` operator can be used to compare structs if all their fields are comparable.

**Example:**

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

### 4. What happens if you compare two different types in Go?

**Answer:** Comparing two different types will result in a compile-time error.

**Example:**

```go
package main

func main() {
	// Uncommenting the following line will cause a compile-time error
	// fmt.Println(10 == "10")
}
```

### 5. Can comparison operators be used with pointers?

**Answer:** Yes, comparison operators can be used to compare pointers for equality or inequality.

**Example:**

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

### 6. How does the `!=` operator work?

**Answer:** The `!=` operator checks if two values are not equal.

**Example:**

```go
package main

import "fmt"

func main() {
	x := 5
	y := 10
	fmt.Println(x != y) // true
}
```

### 7. Can comparison operators be used with arrays?

**Answer:** Yes, arrays can be compared using `==` and `!=` if their elements are comparable.

**Example:**

```go
package main

import "fmt"

func main() {
	a1 := [3]int{1, 2, 3}
	a2 := [3]int{1, 2, 3}
	fmt.Println(a1 == a2) // true
}
```

### 8. What is the result of comparing two slices using `==`?

**Answer:** Slices cannot be compared using `==` except for comparison with `nil`.

**Example:**

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

### 9. How does Go handle floating-point comparison?

**Answer:** Floating-point numbers can be compared using comparison operators, but be cautious of precision issues.

**Example:**

```go
package main

import "fmt"

func main() {
	x := 0.1 + 0.2
	y := 0.3
	fmt.Println(x == y) // false due to precision issues
}
```

### 10. Can you compare custom types using comparison operators?

**Answer:** Custom types can be compared if their underlying types support comparison.

**Example:**

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
