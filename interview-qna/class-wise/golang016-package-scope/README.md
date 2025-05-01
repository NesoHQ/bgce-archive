# 📦 Class 16 — Package Scope

🎥 **Video Title**: *Package scope*

---

## 🧪 Code Written for This Class

### `add.go`
```go
package main

import "fmt"

func add(n1, n2 int) {
	res := n1 + n2
	fmt.Println(res)
}
```
### `main.go`
```go
package main

var (
	a = 20
	b = 30
)

func main() {
	add(4,7)
}
```

### `mathlib/math.go`
```go
package mathlib

import "fmt"

func Add(x int, y int) {
	z := x + y
	fmt.Println(z)
}
```

### `main.go (Modified)`
```go
package main

import (
	"fmt"
	"example.com/mathlib"
)

var (
	a = 20
	b = 30
)

func main() {
	fmt.Println("Showing Custom Package")
	mathlib.Add(4,7)
}
```


# 🔑 Key Concepts

1. **Same Folder = Same Package**
    All `.go` files in the same directory should have the same package name (`main` if you want to run them).

2. **Running Multiple Files**
    You must include all necessary files when using `go run`, like:
    ```bash
    go run main.go add.go
    ```

3. **Initializing a New Module**
    Start with:
    ```bash
    go mod init <module_name>
    ```
    
4. **Managing Dependencies**
    Use:
    ```bash
    go get <package_name>
    go mod tidy
    ```
5. **Package-Level Scope Rules**
    Only **exported** identifiers (functions/variables that start with a **capital letter**) can be accessed from outside the package.

🧠 This class was all about understanding how Go handles packages, visibility, and modular code — crucial stuff for building real-world Go apps!

[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/arrays
]