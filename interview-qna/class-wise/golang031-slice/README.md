# 📚 Slice Deep Dive in Go

---

# 📌 Class 31: Slice

### 🚀 Key topics

1. What is a Slice?
2. How many parts does a Slice have?
3. How to determine Pointer, Length, and Capacity of a Slice?
4. Creating a Slice from an existing Array
5. Creating a Slice from an existing Slice
6. Slice Literal
7. Creating a Slice with `make()` (length only)
8. Creating a Slice with `make()` (length and capacity)
9. Creating an Empty or Nil Slice
10. Appending elements to a Slice
11. What happens internally when appending (Heap and Underlying Array behavior)
12. How the underlying array increases dynamically
13. Some interesting examples and interview questions
14. Variadic Functions

---

# 🧠 1. What is a Slice?

- A **slice** is a lightweight data structure in Go.
- Think of it like a dynamic view over an **array**.
- Unlike arrays, slices can grow and shrink.

**Key Points:**
- Slices are not arrays.
- Slices are built *on top of* arrays.

---

# 🔥 2. How many parts does a Slice have?

Under the hood, a Slice is a **struct** with three fields:

```go
struct Slice {
    pointer *T // Pointer to the underlying array
    length  int // Current number of elements
    capacity int // Maximum number of elements (until reallocation)
}
```

You can think of a slice as a "window" into an array.

---

# 🕵️‍♂️ 3. How to determine Pointer, Length, and Capacity

Use:
- `len(slice)` ➡️ Length
- `cap(slice)` ➡️ Capacity

Example:

```go
s := arr[1:4] // From index 1 to 3
fmt.Println(len(s)) // 3
fmt.Println(cap(s)) // depends on how much array is left after index 1
```

---

# 🏗 4. Creating a Slice from an existing Array

```go
arr := [6]string{"This", "is", "a", "Go", "interview", "Questions"}
s := arr[1:4] // slice ["is", "a", "Go"]
```

- `pointer`: points to index 1 of `arr`
- `length`: 3 (from index 1 to 3)
- `capacity`: 5 (indexes 1 to 5)

---

# 🔄 5. Creating a Slice from an existing Slice

```go
s1 := s[1:2] // Slice "a"
```

- This slice is again a **view** into the same array!
- Changing `s1` can affect `arr`.

---

# ✍️ 6. Slice Literal

Create a slice without needing an array explicitly.

```go
s2 := []int{3, 4, 7}
```

Here Go automatically creates an underlying array.

---

# 🏗️ 7. Creating a Slice with `make()` (length only)

```go
s3 := make([]int, 3)
```

- Creates a slice of 3 zeroed elements.
- `len = 3`, `cap = 3`

---

# 🏗️🏗️ 8. Creating a Slice with `make()` (length and capacity)

```go
s4 := make([]int, 3, 5)
```

- `len = 3`, but it can grow up to `cap = 5` before reallocating.

---

# 🕳 9. Creating an Empty or Nil Slice

```go
var s5 []int
```

- `len = 0`, `cap = 0`
- Still valid! You can append to it.

---

# ➕ 10. Appending Elements to a Slice

```go
s6 := append(s6, 1)
```

- Go handles growing the underlying array if needed.
- May involve *allocating a bigger array* and copying elements.

---

# 🧬 11. What Happens Internally with Append

When a slice reaches capacity:
- A **new array** (usually double the size) is created.
- Old elements are copied into the new array.

This is why sometimes appending seems "fast" and sometimes causes big memory ops.

---

# 📈 12. How Underlying Array Increases

**Capacity Growth Pattern:** (simplified)
- Cap 1 ➡️ 2 ➡️ 4 ➡️ 8 ➡️ 16 ➡️ ...

This is an optimization trick to ensure appends are amortized O(1).

---


# Go Slice Growth: Understanding the Dynamics of `len` and `cap`

Go slices are a powerful and flexible data structure, providing a dynamic array-like abstraction. One of the key features of slices is their ability to grow automatically when elements are appended. Understanding how and when a slice grows—along with the mechanics of memory allocation—can lead to more efficient use of slices in your programs.

In this document, we'll break down how Go slices grow, covering:
- The doubling of capacity when the slice's `len` and `cap` are less than 1024.
- The 25% growth for slices when the `len` and `cap` exceed 1024.
- Why a slice doesn't grow by a fixed amount, such as increasing from 1024 to 1280, but instead grows by larger, more optimized blocks (e.g., 1536).

## Slice Growth Overview

In Go, slices are backed by arrays. When you append elements to a slice, Go may allocate a new, larger array and copy the old elements into it. The key to this resizing is how Go determines the new capacity and allocates memory. 

### 1. Doubling the Capacity for Small Slices (`len(cap) < 1024`)

When the slice is relatively small (i.e., when the `len` and `cap` of the slice are both smaller than 1024), the growth strategy Go uses is to **double** the capacity. This means that when you append an element to the slice and the slice needs to resize, it will allocate a new array that is twice the size of the current capacity. The `len` of the slice will increase by one, but the `cap` will double.

#### Example:

```go
s := []int{1, 2, 3}
fmt.Println(len(s), cap(s)) // len: 3, cap: 3

s = append(s, 4)
fmt.Println(len(s), cap(s)) // len: 4, cap: 6

s = append(s, 5)
fmt.Println(len(s), cap(s)) // len: 5, cap: 12
```

- Initially, the slice has a length of 3 and a capacity of 3.
- When we append the fourth element, the slice grows to a capacity of 6 (doubling from 3).
- The next append results in the slice growing to a capacity of 12 (doubling from 6).

### 2. Growth by 25% for Larger Slices (`len(cap) >= 1024`)

Once the slice grows to a size where its `len` and `cap` exceed or are equal to 1024, Go switches from doubling the capacity to increasing the capacity by **25%** of the current capacity. This growth strategy helps to strike a balance between minimizing frequent reallocations and not wasting too much memory.

#### Example:

```go
s := make([]int, 1024)  // len: 1024, cap: 1024
fmt.Println(len(s), cap(s))

s = append(s, 1025) // len: 1025, cap: 1280 (1024 + 25% of 1024)
fmt.Println(len(s), cap(s))

s = append(s, 1300) // len: 1300, cap: 1600 (1280 + 25% of 1280)
fmt.Println(len(s), cap(s))
```

- Initially, we create a slice with a length and capacity of 1024.
- When appending the next element, the slice grows to a capacity of 1280, which is 1024 plus 25% of 1024.
- Another append results in a capacity of 1600 (1280 plus 25% of 1280).

### 3. The Role of Memory Blocks (e.g., 1536 for a Slice)

When the slice's `len` and `cap` are near the threshold of 1024 (and higher), Go doesn't always allocate memory blocks in neat, predictable sizes like 1280. Instead, it aligns to **optimal memory blocks** that align better with system memory allocation patterns.

For example, if a slice's capacity is nearing 1024, the next allocation might not simply be an increment by 256 (i.e., from 1024 to 1280). Instead, Go will allocate memory in larger chunks to optimize memory usage and alignment. A common result of this optimization is the slice's capacity growing to **1536**, which is a more "perfect" memory block for larger sizes.

#### Why 1536 Instead of 1280?

This behavior is largely based on **hardware memory alignment**. The number 1536 is chosen because it fits better with memory block sizes that are typically aligned in powers of 2 and optimized for modern CPUs and memory systems. Memory allocations are often made in chunks that align with the system’s memory page size or cache line, resulting in a more efficient memory access pattern.

#### Example (Memory Alignment):

```go
s := make([]int, 1024) // len: 1024, cap: 1024
fmt.Println(len(s), cap(s)) // 1024, 1024

s = append(s, 1025) // len: 1025, cap: 1536 (next optimal block size)
fmt.Println(len(s), cap(s)) // 1025, 1536
```

- The capacity grows from 1024 to 1536 rather than 1280, as 1536 is a better memory block that optimizes system memory allocation.

### 4. Why Does This Happen?

The reason Go doesn't strictly grow the slice by 256 (as one might expect, like going from 1024 to 1280) is due to **efficiency considerations**. The allocation strategy aims to reduce the number of reallocations while not wasting memory. By allocating a larger chunk (1536 in this case), the Go runtime ensures that the slice has enough room to accommodate several more appends without needing to resize again too soon.

This leads to better performance, especially in cases where slices grow rapidly.

## Conclusion

Understanding slice growth behavior can help you write more efficient Go code. When the slice is smaller, Go doubles its capacity to handle more elements with fewer reallocations. When the slice reaches a certain size (1024 and beyond), it increases capacity by 25%, and occasionally, it aligns the slice's capacity with optimal memory block sizes for better efficiency. This approach leads to smoother and more performant memory handling, ensuring that slices are both memory-efficient and fast to work with.


___

# 🤯 13. Interesting Interview Question Examples

### ⚡ Same Underlying Array Trick

```go
var x []int
x = append(x, 1)
x = append(x, 2)
x = append(x, 3)

y := x
x = append(x, 4)
y = append(y, 5)

x[0] = 10
fmt.Println(x)
fmt.Println(y)
```

- `x` and `y` were sharing the same backing array.
- Mutating one could affect both.

After appending past the cap, they might split into their own arrays.

---

# 🛠 14. Variadic Functions

Functions can accept an arbitrary number of arguments with `...`.

```go
func variadic(numbers ...int) {
    fmt.Println(numbers)
}

variadic(2, 3, 4, 6, 8, 10)
```

Internally, `numbers` is just a **slice**!

---

# 🧠 Visualizing Slice in RAM (for `arr` and `s`)

```
Array arr (indexes):
[0] "This"
[1] "is"  <- s.ptr points here
[2] "a"
[3] "Go"
[4] "interview"
[5] "Questions"

Slice s:
- ptr = &arr[1]
- len = 3 ("is", "a", "Go")
- cap = 5 (from "is" to "Questions")
```

Memory Visualization:

```
+---+---+---+---+---+---+
|This|is|a|Go|interview|Questions|
+---+---+---+---+---+---+
     ^   ^   ^
     s[0] s[1] s[2]
```

---

# 📄 Full Code with Detailed Comments

```go
package main

import "fmt"

func main() {
	// Create an array of strings
	arr := [6]string{"This", "is", "a", "Go", "interview", "Questions"}
	fmt.Println(arr)

	// Create a slice from array indexes 1 to 3 (exclusive of 4)
	s := arr[1:4]
	fmt.Println(s) // [is a Go]

	// Create a slice from a slice
	s1 := s[1:2]
	fmt.Println(s1) // [a]
	fmt.Println(len(s1)) // 1
	fmt.Println(cap(s1)) // 4 (capacity depends on the underlying array)

	// Slice literal
	s2 := []int{3, 4, 7}
	fmt.Println("slice", s2, "lenght:", len(s2), "capacity:", cap(s2))

	// make() function with length only
	s3 := make([]int, 3)
	s3[0] = 5
	fmt.Println(s3)
	fmt.Println(len(s3))
	fmt.Println(cap(s3))

	// make() function with length and capacity
	s4 := make([]int, 3, 5)
	s4[0] = 5
	fmt.Println(s4)
	fmt.Println(len(s4))
	fmt.Println(cap(s4))

	// Empty slice
	var s5 []int
	fmt.Println(s5) // []

	// Appending elements to empty slice
	var s6 []int
	s6 = append(s6, 1)
	fmt.Println(s6) // [1]

	var s7 []int
	s7 = append(s7, 1, 2, 3)
	fmt.Println(s7, len(s7), cap(s7)) // [1 2 3] 3 3

	// Interview question: Sharing underlying array
	var x []int
	x = append(x, 1)
	x = append(x, 2)
	x = append(x, 3)

	y := x
	x = append(x, 4)
	y = append(y, 5)

	x[0] = 10

	fmt.Println(x) // [10 2 3 5]
	fmt.Println(y) // [10 2 3 5]

	// Another interview question
	slc := []int{1, 2, 3, 4, 5}
	slc = append(slc, 6)
	slc = append(slc, 7)

	slcA := slc[4:]

	slcY := changeSlice(slcA)

	fmt.Println(slc)  // [1 2 3 4 10 6 7]
	fmt.Println(slcY) // [10 6 7 11]
	fmt.Println(slc[0:8]) // [1 2 3 4 10 6 7 11]

	// Variadic function call
	variadic(2, 3, 4, 6, 8, 10)
}

// Function that changes the slice passed
func changeSlice(a []int) []int {
	a[0] = 10
	a = append(a, 11)
	return a
}

// Variadic function that takes multiple integers
func variadic(numbers ...int) {
	fmt.Println(numbers)
	fmt.Println(len(numbers))
	fmt.Println(cap(numbers))
}
```


[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/arrays
]