[**Author:** @mdimamhosen
**Date:** 2025-04-22
**Category:** interview-qa/Argument vs Parameter
**Tags:** [go, Parameter, Argument]
]

## Difference between Parameter and Argument

### Parameter

A **parameter** is a variable in the declaration of a function. It defines what kind of input a function will accept when it is called. It acts as a placeholder for the values that will be passed into the function.

### Argument

An **argument** is the actual value that is passed into the function when it is called. Arguments correspond to the parameters defined in the function signature. These are the real values provided to the function when executing the code.

### Example Code

```go
package main

import "fmt"

// Function with parameters 'a' and 'b'
func add(a int, b int) int {
    return a + b
}

func main() {
    // Calling the function with arguments 5 and 3
    result := add(5, 3)
    fmt.Println("Result:", result) // Output: Result: 8
}
```

In the above example:

- `a` and `b` are **parameters** of the `add` function.
- `5` and `3` are **arguments** passed to the `add` function when it is called in the `main` function.

---

### Further Explanation

**Parameters** are declared within the function's signature. They provide the function with input values that can be used within the function's body.

**Arguments** are provided when the function is called. The values of these arguments are assigned to the corresponding parameters, allowing the function to perform its operation based on those values.

### Types of Parameters

- **Formal Parameters**: These are parameters that appear in the function definition. They are used to represent the expected values inside the function.
- **Actual Parameters**: These are arguments that are passed during the function call.

---

### Interview Questions and Answers

#### 1. What is the difference between pass-by-value and pass-by-reference in function arguments?

**Answer:**

- **Pass-by-value**: The function gets a copy of the argument's value. Changes made to the parameter do not affect the original argument.
- **Pass-by-reference**: The function gets a reference (memory address) to the argument, so any changes made to the parameter directly affect the original argument.

**Code Example**:

```go
package main

import "fmt"

// Pass-by-value
func modifyValue(x int) {
    x = 20
}

// Pass-by-reference
func modifyReference(x *int) {
    *x = 20
}

func main() {
    a := 10
    modifyValue(a)
    fmt.Println("After modifyValue:", a) // Output: 10 (no change)

    modifyReference(&a)
    fmt.Println("After modifyReference:", a) // Output: 20 (value changed)
}
```

#### 2. How do you handle default arguments in Go?

**Answer:**
Go does not support default arguments directly. Instead, you can achieve default values using variadic functions or by explicitly checking if a value is provided.

**Code Example**:

```go
package main

import "fmt"

func greet(name string, message string) {
    if message == "" {
        message = "Hello" // default message
    }
    fmt.Println(message, name)
}

func main() {
    greet("John", "")  // Output: Hello John
    greet("Jane", "Hi") // Output: Hi Jane
}
```

#### 3. What is a variadic function, and how is it used?

**Answer:**
A **variadic function** is a function that takes a variable number of arguments. It is defined using `...` in the parameter list. This allows you to pass any number of arguments.

**Code Example**:

```go
package main

import "fmt"

func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3)) // Output: 6
    fmt.Println(sum(10, 20, 30, 40)) // Output: 100
}
```

#### 4. What will happen if a function is called with more arguments than its parameters?

**Answer:**
In Go, if the number of arguments passed to a function exceeds the number of parameters declared, the code will result in a compile-time error. Go checks the number of arguments and parameters at compile-time, and any mismatch in the number of arguments will cause an error.

**Code Example**:

```go
package main

import "fmt"

func greet(name string) {
    fmt.Println("Hello, ", name)
}

func main() {
    greet("John", "Doe") // Compile-time error: too many arguments
}
```

#### 5. Can you return multiple values from a function in Go?

**Answer:**
Yes, Go allows a function to return multiple values. You can return multiple values of different types from a function.

**Code Example**:

```go
package main

import "fmt"

// Function returning two values
func divide(a, b int) (int, int) {
    return a / b, a % b
}

func main() {
    quotient, remainder := divide(10, 3)
    fmt.Println("Quotient:", quotient)   // Output: Quotient: 3
    fmt.Println("Remainder:", remainder) // Output: Remainder: 1
}
```
