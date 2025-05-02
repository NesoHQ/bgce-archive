# Callback Functions

If a function is passed as an argument to another function, then such types of functions are known as a Higher-Order function. This passing function as an argument is also known as a callback function or first-class function in the Go language.

```go
package main
import "fmt"

func addName(name string, callback func(string)) {
    callback(name)
}

func main() {
    addName("HuXn", func(nm string) {
        fmt.Printf("Hi, my name is %v\n", nm)
    })
}
```
