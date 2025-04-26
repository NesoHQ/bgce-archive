[**Author:** @mdimamhosen
**Date:** 2025-04-22
**Category:** interview-qa/Function Expressions
**Tags:** [go, Function Expressions, Anonymous Functions ]
]

### Function Expressions and Anonymous Functions in Go

In Go, functions can be treated as first-class citizens, meaning they can be assigned to variables, passed as arguments, or returned from other functions. These capabilities make Go flexible in terms of handling operations that require dynamic behavior.

### Function Expressions

A **function expression** is when you assign a function to a variable. This allows you to treat the function like any other value in Go, and invoke it using the variable name.

```go
package main
import "fmt"

func main() {
    // Assigning a function to a variable
    add := func(a int, b int) int {
        return a + b
    }

    // Using the variable to call the function
    result := add(3, 4)
    fmt.Println("Sum:", result) // Output: Sum: 7
}
```

### Anonymous Functions

An **anonymous function** is a function that is defined without a name. These are often used for one-off tasks, such as callbacks or short-lived operations.

```go
package main
import "fmt"

func main() {
    // Anonymous function without a name
    func(message string) {
        fmt.Println(message)
    }("Hello, Go!") // Output: Hello, Go!
}
```

### Immediately Invoked Function Expressions (IIFE)

In Go, you can also define an anonymous function and immediately invoke it. This is useful for initializing values, performing a quick operation, or executing code that does not need to be reused.

```go
package main
import "fmt"

func main() {
    // Immediately Invoked Function Expression (IIFE)
    result := func(a int, b int) int {
        return a + b
    }(3, 4) // Function is invoked immediately with the arguments

    fmt.Println("Sum:", result) // Output: Sum: 7
}
```

### More Examples

#### 1. Returning a Function from Another Function

You can return a function from another function, which can then be used later.

```go
package main
import "fmt"

func multiply(factor int) func(int) int {
    return func(x int) int {
        return x * factor
    }
}

func main() {
    // Creating a multiplier function with factor 2
    multiplyByTwo := multiply(2)
    result := multiplyByTwo(5)
    fmt.Println("Multiplication Result:", result) // Output: 10
}
```

#### 2. Using Function Expressions with Map Operations

Function expressions can be used with map functions to process elements in collections.

```go
package main
import "fmt"

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    // Using a function expression to map each element
    doubledNumbers := mapFunc(numbers, func(x int) int {
        return x * 2
    })

    fmt.Println("Doubled Numbers:", doubledNumbers) // Output: [2 4 6 8 10]
}

func mapFunc(numbers []int, f func(int) int) []int {
    var result []int
    for _, number := range numbers {
        result = append(result, f(number))
    }
    return result
}
```

### Interview Questions and Answers

#### 1. What are function expressions in Go, and how are they useful?

**Answer:**
A function expression is when a function is assigned to a variable. This allows you to treat functions as values and pass them around like other types, enabling dynamic behavior. For instance, you can pass functions as arguments, return them from other functions, and store them in data structures.

#### 2. What is an anonymous function in Go? Give an example.

**Answer:**
An anonymous function is a function without a name. It can be used for quick, short-lived tasks where the function's name is not necessary. Here's an example of an anonymous function:

```go
package main
import "fmt"

func main() {
    // Anonymous function used to print a message
    func(message string) {
        fmt.Println(message)
    }("Hello, Go!") // Output: Hello, Go!
}
```

#### 3. What is the difference between a function expression and a named function?

**Answer:**
A named function has a specific name and can be called by that name. A function expression is an unnamed function assigned to a variable, and the function can be called using that variable. Function expressions offer more flexibility, as you can assign them to variables, pass them around, and invoke them in different contexts.

#### 4. What is an Immediately Invoked Function Expression (IIFE) in Go?

**Answer:**
An Immediately Invoked Function Expression (IIFE) is a function that is defined and called immediately in one expression. This is useful for scenarios where you need to perform a quick operation without the need for a function name or reuse. Example:

```go
package main
import "fmt"

func main() {
    // IIFE to perform an immediate calculation
    result := func(a int, b int) int {
        return a + b
    }(3, 4) // Function is invoked immediately

    fmt.Println("Sum:", result) // Output: Sum: 7
}
```

#### 5. How can you pass a function as an argument to another function in Go?

**Answer:**
In Go, you can pass a function as an argument to another function by defining the function signature in the argument list. This allows you to treat the passed function as a value and invoke it within the receiving function.

**Example:**

```go
package main
import "fmt"

func applyOperation(a int, b int, operation func(int, int) int) int {
    return operation(a, b)
}

func main() {
    add := func(a int, b int) int {
        return a + b
    }

    result := applyOperation(3, 4, add) // Passing function as argument
    fmt.Println("Sum:", result) // Output: Sum: 7
}
```
