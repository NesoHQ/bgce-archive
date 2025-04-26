# Class 29 - Go Arrays and Memory Layout
📅 *Date: April 24, 2025*

## 🔑 Key Concepts

### ✅ What is an Array?
- An **array** is a fixed-size collection of elements of the same type.
- In Go, arrays are **value types**, meaning they are copied when passed around.

### 🧠 Array in Go
```go
var arr [2]int       // Declares an array of 2 integers. Default values: [0, 0]
arr[0] = 3           // Assigning values using index
arr[1] = 6

// Short way of declaring an array with values
arr := [2]int{3, 6}
```

### 💡 Indexing
- Arrays in Go are **zero-indexed**, meaning the first element is accessed with `array[0]`.

### ⚙️ Default Values
- If you declare an array without initializing it, Go assigns default values:
  - For `int`, `float`, etc: `0`
  - For `string`: `""` (empty string)
  - For `bool`: `false`
  - For pointers/interfaces: `nil`

### 🔍 Memory Layout Visualization

Example:
```go
arr := [2]int{3, 6}
```

**Memory Layout**

| Address   | Value | Meaning   |
|-----------|-------|-----------|
| 0x1000    | 3     | arr[0]    |
| 0x1004    | 6     | arr[1]    |

Note: The actual address is abstract. The concept is: array elements are stored **contiguously** in memory.

Another example:
```go
arr2 := [3]string{"I", "love", "you"}
```

| Index | Value  |
|-------|--------|
| 0     | "I"    |
| 1     | "love" |
| 2     | "you"  |

Accessing `arr2[1]` returns `"love"`.

---

## 🧪 Full Code Example (From Class)
```go
package main

import "fmt"

var arr2 = [3]string{"I", "love", "you"}

func main() {
    arr := [2]int{3,6}
    fmt.Println(arr)
    fmt.Println(arr2)
    fmt.Println(arr2[1])
}
```

---

## 📦 Summary
- Arrays are great for working with fixed-size collections.
- Be aware of default values.
- They're stored contiguously in memory.
- Go makes it easy to work with arrays, and it's a good base before moving to slices!

