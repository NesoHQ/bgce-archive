[**Author:** @mdimamhosen
**Date:** 2025-04-22
**Category:** interview-qa/Higher-Order
**Tags:** [go, First-Order, Higher-Order]
]

## First-Order Function and Higher-Order Function

### First-Order Function

A **first-order function** is a function that operates on basic data types (integers, strings, etc.) and does not take other functions as arguments nor returns a function as its result.

### Higher-Order Function

A **higher-order function** is a function that can accept other functions as arguments and/or return a function as its result. Higher-order functions are key in functional programming paradigms.

### Example Code

#### First-Order Function

```go
package main

import "fmt"

// First-order function: does not take or return another function
func add(a int, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println("Result:", result) // Output: Result: 8
}
```

#### Higher-Order Function

```go
package main

import "fmt"

// Higher-order function: takes a function as an argument
func applyOperation(a int, b int, operation func(int, int) int) int {
    return operation(a, b)
}

// Function to be passed as an argument
func multiply(a int, b int) int {
    return a * b
}

func main() {
    result := applyOperation(5, 3, multiply)
    fmt.Println("Result:", result) // Output: Result: 15
}
```

### Logic in Mathematics

In discrete mathematics, logic is used to define and analyze the properties and relationships of objects.

1. **Object**: An entity that has a physical existence (e.g., people, animals).
2. **Property**: Characteristics or attributes of objects (e.g., color, height).
3. **Relation**: Describes how objects are related to each other (e.g., "all customers must pay their pizza bills").

Example:

- **Object**: Customer
- **Property**: Has a bill
- **Relation**: Must pay the bill

- **First-Order Logic**: Works with objects, properties, and relations.
- **Higher-Order Logic**: Works with relations between functions and operations.

In the context of functions:

- **First-Order Function**: Operates directly on objects and their properties.
- **Higher-Order Function**: Operates on relations between functions, allowing for more abstract and flexible operations.

### Functional Paradigms

Functional programming is a programming paradigm where programs are constructed by applying and composing functions. It emphasizes **pure functions**, **immutability**, and **higher-order functions**.

- **Pure Functions**: Functions that always produce the same output for the same input and have no side effects.
- **Immutability**: Data cannot be changed once it is created. New data structures are created with updated values.
- **First-Class Functions**: Functions are treated as first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions.
- **Higher-Order Functions**: Functions that take other functions as arguments or return them as results.

Functional programming languages like **Haskell**, **Racket**, and **Lisp** provide powerful abstractions for working with functions.

### Additional Example Code

#### Higher-Order Function Returning Another Function

```go
package main

import "fmt"

// Higher-order function: returns another function
func call() func(int, int) {
    return add
}

func add(a, b int) {
    z := a + b
    fmt.Println(z)
}

func main() {
    // call() is a higher-order function which returns the function add.
    // The returned function is assigned to a variable f, then f is called with arguments 10, 20.
    f := call()
    f(10, 20) // Output: 30
}
```

#### Higher-Order Function with First-Class Functions

```go
package main

import "fmt"

// Higher-order function: accepts another function as an argument
func applyAndReturn(fn func(int, int) int, x int, y int) int {
    return fn(x, y)
}

// Function to be passed as an argument
func subtract(a int, b int) int {
    return a - b
}

func main() {
    result := applyAndReturn(subtract, 10, 5)
    fmt.Println("Result:", result) // Output: Result: 5
}
```

### Interview Q&A (Code Examples)

#### 1. **What is a higher-order function?**

**Question**: What is a higher-order function, and how does it work in Go?

**Answer**:
A higher-order function is a function that either accepts other functions as parameters or returns a function.

Example:

```go
package main

import "fmt"

func applyOperation(a int, b int, operation func(int, int) int) int {
    return operation(a, b)
}

func add(a, b int) int {
    return a + b
}

func main() {
    result := applyOperation(3, 4, add)
    fmt.Println("Result:", result) // Output: Result: 7
}
```

#### 2. **What is a first-order function?**

**Question**: Explain a first-order function in Go.

**Answer**:
A first-order function operates on basic data types and does not take other functions as parameters nor return functions.

Example:

```go
package main

import "fmt"

func add(a int, b int) int {
    return a + b
}

func main() {
    result := add(3, 5)
    fmt.Println("Result:", result) // Output: Result: 8
}
```

#### 3. **Can you create a function that returns another function?**

**Question**: Write a function that returns another function and demonstrates its usage.

**Answer**:
Yes, you can create a higher-order function that returns another function. Here's an example:

```go
package main

import "fmt"

func multiply(a int) func(int) int {
    return func(b int) int {
        return a * b
    }
}

func main() {
    multiplyBy2 := multiply(2)
    fmt.Println("Result:", multiplyBy2(5)) // Output: Result: 10
}
```

#### 4. **What is an anonymous function in Go?**

**Question**: Show an example of an anonymous function in Go.

**Answer**:
An anonymous function is a function defined without a name, often used for short-lived operations.

Example:

```go
package main

import "fmt"

func main() {
    func(a int, b int) {
        fmt.Println("Sum:", a+b)
    }(3, 4) // Output: Sum: 7
}
```

#### 5. **What is an Immediately Invoked Function Expression (IIFE) in Go?**

**Question**: Write a code example for an Immediately Invoked Function Expression (IIFE) in Go.

**Answer**:
An IIFE is a function that is defined and immediately invoked.

Example:

```go
package main

import "fmt"

func main() {
    result := func(a int, b int) int {
        return a + b
    }(3, 4)

    fmt.Println("Result:", result) // Output: Result: 7
}
```
