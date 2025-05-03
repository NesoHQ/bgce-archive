**Author:** @jahidprog  
**Date:** 2025-04-30  
**Category:** `interview-qa/slice`  
**Tags:** `go`, `slice`, `interview questions`

# Understanding Go Slices: Behavior, Expansion, and Subslice

## Example 1: Reference Type Behavior Explained

This note explains how Go slices work as reference types using a step-by-step breakdown of the following example.

### Example Code

```go
package main

import "fmt"

func main() {
  var x []int
  x = append(x, 1)
  x = append(x, 2)
  x = append(x, 3)
  y := x
  x = append(x, 4)
  y = append(y, 5)
  x[0] = 0

  fmt.Println(x) // ?
  fmt.Println(y) // ?
}
```

**Question:**
What will the following lines output?

```go
fmt.Println(x)
fmt.Println(y)
```

---

### Understanding Slices in Go

A slice in Go is a reference type and has three main components:

- **Pointer**: Points to the underlying array.
- **Length**: Number of elements in the slice (`len(slice)`).
- **Capacity**: Total number of elements that can be held (`cap(slice)`).

These characteristics allow slices to share memory and be efficiently resized.

---

### Step-by-Step Breakdown

#### Step 1: Declare an Empty Slice

```go
var x []int
```

- `x = []`
- `len = 0`
- `cap = 0`

Slice is `nil`, no memory allocated.

---

#### Step 2: Append `1`

```go
x = append(x, 1)
```

- `x = [1]`
- `len = 1`
- `cap = 1`

A new array is created under the hood.

---

#### Step 3: Append `2`

```go
x = append(x, 2)
```

- Current `cap = 1`, insufficient.
- New capacity = `2`
- `x = [1, 2]`
- `len = 2`
- `cap = 2`

Slice resized with double capacity.

---

#### Step 4: Append `3`

```go
x = append(x, 3)
```

- Current `cap = 2`, insufficient.
- New capacity = `4`
- `x = [1, 2, 3]`
- `len = 3`
- `cap = 4`

Another reallocation with doubled capacity.

---

#### Step 5: Copy Slice

```go
y := x
```

- `y = [1, 2, 3]`
- `len = 3`
- `cap = 4`

Both `x` and `y` now share the same underlying array.

---

#### Step 6: Append `4` to `x`

```go
x = append(x, 4)
```

- `x = [1, 2, 3, 4]`
- `len = 4`
- `cap = 4`

No reallocation, fits existing capacity.

---

#### Step 7: Append `5` to `y`

```go
y = append(y, 5)
```

- `y = [1, 2, 3, 5]`
- `len = 4`
- `cap = 4`

Overwrites index 3 (value `4`) with `5`.

---

#### Step 8: Modify `x[0]`

```go
x[0] = 0
```

- Since `x` and `y` still share memory, both get updated.
- Final `x = [0, 2, 3, 5]`
- Final `y = [0, 2, 3, 5]`

---

### Final Output

```go
fmt.Println(x) // [0, 2, 3, 5]
fmt.Println(y) // [0, 2, 3, 5]
```

---

### Recap of `len` and `cap` Changes

```go
func main() {
  var x []int      // x=[], len=0, cap=0
  x = append(x, 1) // x=[1], len=1, cap=1
  x = append(x, 2) // x=[1, 2], len=2, cap=2
  x = append(x, 3) // x=[1, 2, 3], len=3, cap=4
  y := x           // y=[1, 2, 3], len=3, cap=4
  x = append(x, 4) // x=[1, 2, 3, 4], len=4, cap=4
  y = append(y, 5) // x=[1, 2, 3, 5], len=4, cap=4
  x[0] = 0         // x=[0, 2, 3, 5], len=4, cap=4

  fmt.Println(x)   // [0, 2, 3, 5]
  fmt.Println(y)   // [0, 2, 3, 5]
}
```

---

## Example 2: Expansion and Memory Separation

This note explains how slice expansion in Go can result in two slices no longer sharing the same underlying array.

---

### Example Code

```go
package main

import "fmt"

func main() {
  x := []int{1, 2, 3, 4}
  y := x
  x = append(x, 5)
  y = append(y, 6)
  x[0] = 0

  fmt.Println(x) // ?
  fmt.Println(y) // ?
}
```

**Question:**
What will be printed by the following?

```go
fmt.Println(x)
fmt.Println(y)
```

---

### Answer

```
x = [0, 2, 3, 4, 5]
y = [1, 2, 3, 4, 6]
```

---

### Why Are the Outputs Different?

The key point in this example is **slice expansion**.

#### Initial Setup

```go
x := []int{1, 2, 3, 4}
y := x
```

- Both `x` and `y` reference the **same** underlying array.
- `len = 4`
- `cap = 4`

---

#### Append to `x`

```go
x = append(x, 5)
```

- Capacity `cap = 4` is **not sufficient**.
- A **new memory area** is allocated.
- `x = [1, 2, 3, 4, 5]`
- `len = 5`
- `cap = 8`

Now, `x` and `y` **no longer share** the same underlying memory.

---

#### Append to `y`

```go
y = append(y, 6)
```

- `y` also expands into a **new memory area**.
- `y = [1, 2, 3, 4, 6]`
- `len = 5`
- `cap = 8`

---

#### Modify `x[0]`

```go
x[0] = 0
```

- Only affects `x`.

---

### Final Output

```go
fmt.Println(x) // [0, 2, 3, 4, 5]
fmt.Println(y) // [1, 2, 3, 4, 6]
```

---

### Recap of `len` and `cap` Changes

```go
func main() {
  x := []int{1,2,3,4} // x=[1,2,3,4], len=4, cap=4
  y := x              // y=[1,2,3,4], len=4, cap=4
  x = append(x, 5)    // x=[1,2,3,4,5], len=5, cap=8 (new memory)
  y = append(y, 6)    // y=[1,2,3,4,6], len=5, cap=8 (different new memory)
  x[0] = 0            // x=[0,2,3,4,5], y unchanged

  fmt.Println(x)      // [0,2,3,4,5]
  fmt.Println(y)      // [1,2,3,4,6]
}
```

---

## Example 3: Subslices

Let’s consider another example:

```go
package main

import "fmt"

func main() {
  x := []int{1, 2, 3, 4, 5}
  x = append(x, 6)
  x = append(x, 7)
  a := x[4:]
  y := alterSlice(a)
  fmt.Println(x)
  fmt.Println(y)
}

func alterSlice(a []int) []int {
  a[0] = 10
  a = append(a, 11)
  return a
}
```

What will `fmt.Println(x)` and `fmt.Println(y)` print?

---

### Step-by-Step Breakdown

```go
x := []int{1, 2, 3, 4, 5} // x = [1,2,3,4,5], len=5, cap=5
x = append(x, 6)          // x = [1,2,3,4,5,6], len=6, cap=10
x = append(x, 7)          // x = [1,2,3,4,5,6,7], len=7, cap=10
a := x[4:]                // a = [5,6,7], len=3, cap=6
```

Inside `alterSlice`:

```go
a[0] = 10                 // a = [10,6,7]
a = append(a, 11)         // a = [10,6,7,11]
```

Now:

- `x = [1,2,3,4,10,6,7]`
- `y = [10,6,7,11]`

---

### Code Recap

```go
import "fmt"

func main() {
  x := []int{1, 2, 3, 4, 5}
  x = append(x, 6)
  x = append(x, 7)
  a := x[4:]
  y := alterSlice(a)

  fmt.Println(x) // [1,2,3,4,10,6,7]
  fmt.Println(y) // [10,6,7,11]
}

func alterSlice(a []int) []int {
  a[0] = 10
  a = append(a, 11)
  return a
}
```

---

### Bonus Question

What will happen if you try to print `fmt.Println(x[0:8])` at the end of the code?
Try it on you'r own

---

## Summary to Remember in Order to Crack These Interview Questions

- A **slice is a reference data type**.
- A slice has a **length** and **capacity**.
- If `len + 1 > cap`, slice expands into a new memory area.
- Passing a slice copies the **header**, not the underlying array.
- Memory sharing depends on capacity and operations like `append`.
