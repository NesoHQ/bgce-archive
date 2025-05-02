# Defer Keyword

The `defer` keyword is used to delay the execution of a function or a statement until the nearby function returns. In simple words, `defer` will move the execution of the statement to the very end inside a function.

```go
package main
import "fmt"

func greet() {
    defer fmt.Println("World")
    fmt.Println("Hello")
}

func main() {
    greet()
}
```
