[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/constants
**Tags:** [go, constants, beginner]
]

# The const keyword declares the variable as "constant", which means that it is unchangeable and read-only.

```go
package main
import ("fmt")

const user = "admin" // cannot be changed

func main() {
  fmt.Println("admin")
}
```

# Constant Rules

### 1. Constant names follow the same naming rules as variables

### 2. Constant names are usually written in uppercase letters

### 3. Constants can be declared both inside and outside of a function

# Frequently Asked Questions

### 1. **What is a constant in Go?**

**Answer:** A constant is a variable whose value cannot be changed once it is assigned. Constants are declared using the `const` keyword.

**Code Example:**

```go
package main
import "fmt"

const PI = 3.14

func main() {
    fmt.Println("The value of PI is:", PI)
}
```

---

### 2. **Can constants be declared inside a function?**

**Answer:** Yes, constants can be declared both inside and outside of a function.

**Code Example:**

```go
package main
import "fmt"

func main() {
    const GREETING = "Hello, World!"
    fmt.Println(GREETING)
}
```

---

### 3. **Can constants hold values other than numbers?**

**Answer:** Yes, constants can hold string, boolean, or even character values.

**Code Example:**

```go
package main
import "fmt"

const IS_ACTIVE = true
const MESSAGE = "Welcome to Go!"

func main() {
    fmt.Println("Is Active:", IS_ACTIVE)
    fmt.Println("Message:", MESSAGE)
}
```

---

### 4. **Can constants be computed at runtime?**

**Answer:** No, constants must be assigned a value that can be determined at compile time.

**Code Example:**

```go
package main
import "fmt"

const VALUE = 10 * 2 // Valid

func main() {
    fmt.Println("Value:", VALUE)
}
```

---

### 5. **What happens if you try to change a constant's value?**

**Answer:** The compiler will throw an error if you try to change the value of a constant.

**Code Example:**

```go
package main
import "fmt"

const NAME = "John"

func main() {
    // NAME = "Doe" // Uncommenting this line will cause a compilation error
    fmt.Println(NAME)
}
```

---

### 6. **Can constants be used in expressions?**

**Answer:** Yes, constants can be used in expressions to compute other constants.

**Code Example:**

```go
package main
import "fmt"

const A = 5
const B = 10
const SUM = A + B

func main() {
    fmt.Println("Sum:", SUM)
}
```

---

### 7. **What is the difference between `const` and `var` in Go?**

**Answer:** `const` is used for values that do not change, while `var` is used for variables whose values can change.

**Code Example:**

```go
package main
import "fmt"

const FIXED = 100
var changeable = 200

func main() {
    fmt.Println("Fixed:", FIXED)
    fmt.Println("Changeable:", changeable)
    changeable = 300
    fmt.Println("Updated Changeable:", changeable)
}
```

---

### 8. **Can constants be of type array or slice?**

**Answer:** No, constants cannot be of type array, slice, or map.

**Code Example:**

```go
package main
import "fmt"

func main() {
    // const ARR = [3]int{1, 2, 3} // This will cause a compilation error
    fmt.Println("Constants cannot be arrays or slices.")
}
```

---

### 9. **Can constants be exported in Go?**

**Answer:** Yes, constants can be exported if their names start with an uppercase letter.

**Code Example:**

```go
package main
import "fmt"

const ExportedConstant = "I am exported!"

func main() {
    fmt.Println(ExportedConstant)
}
```

---

### 10. **What are untyped constants in Go?**

**Answer:** Untyped constants do not have a specific type until they are assigned to a variable.

**Code Example:**

```go
package main
import "fmt"

const VALUE = 42

func main() {
    var x int = VALUE
    var y float64 = VALUE
    fmt.Println("x:", x, "y:", y)
}
```
