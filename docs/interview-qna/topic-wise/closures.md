[**Author:** @mdimamhosen
**Date:** 2025-04-22
**Category:** interview-qa/arrays
**Tags:** [go, clousers, functions]
]

## 🔁 Program Code Example

```go
package main

import "fmt"

const a = 10
var b = 20

func Outer() func() {
	// Outer function variables
	money := 100
	age := 20

	fmt.Println("Outer function")
	fmt.Println("Age:", age)

	show := func() {
		money += a + b
		fmt.Println("Money:", money)
	}

	return show
}

func call() {
	inc := Outer()
	inc()
	inc()
	fmt.Println("=========================")
	inc1 := Outer()
	inc1()
	inc1()
}

func main() {
	call()
}

func init() {
	fmt.Print("============ Begin ============\n")
}
```

---

## ⚙️ Code Execution Phases

### 🧩 Phase 1: Compilation

- Compile and generate the binary:

```bash
go build main.go
```

### 🚀 Phase 2: Execution

- Run the binary:

```bash
./main
```

## 🔒 Closures in Go

### ✅ What is a Closure?

A closure is a function **defined within another function** and **has access to the outer function's variables** even after the outer function has finished executing.

```go
func Outer() func() {
    money := 100
    show := func() {
        money += 10
        fmt.Println("Money:", money)
    }
    return show
}
```

- `money` is captured by the inner function.
- On each call to the returned function, `money` is updated.

### ✅ Multiple Closures

- Each call to `Outer()` creates a new instance of `money`, isolated from others.

---

## 🧠 Output Explanation

```go
init() runs first: ============ Begin ============

Outer function
Age: 20
Money: 130
Money: 160
=========================
Outer function
Age: 20
Money: 130
Money: 160
```

- Two closures are created, each with its own instance of `money`.
- They do not interfere with each other.

---

## 🔍 Types of Closures

### 1. **Closure with Outer Variable**

**Question:** Write a Go program that demonstrates how a closure can access and modify a variable from the outer function.

**Code:**

```go
package main

import "fmt"

func outer() func() {
    x := 10
    return func() {
        x++
        fmt.Println(x)
    }
}

func main() {
    closure := outer()
    closure() // Output: 11
    closure() // Output: 12
}
```

**Explanation:**

- The `outer` function creates a closure that captures and modifies the `x` variable.
- Every time the closure is called, the value of `x` is incremented.

---

### 2. **Multiple Closures with Separate States**

**Question:** Demonstrate how multiple closures created in the same function each maintain their own state.

**Code:**

```go
package main

import "fmt"

func createCounter() func() int {
    counter := 0
    return func() int {
        counter++
        return counter
    }
}

func main() {
    counter1 := createCounter()
    counter2 := createCounter()

    fmt.Println(counter1()) // Output: 1
    fmt.Println(counter1()) // Output: 2
    fmt.Println(counter2()) // Output: 1
    fmt.Println(counter2()) // Output: 2
}
```

**Explanation:**

- `counter1` and `counter2` each maintain their own state because they are independent closures.
- Each counter starts at 0 and increments on each call.

---

### 3. **Closure with Parameters**

**Question:** Write a closure that accepts parameters and demonstrates how closures can be passed arguments.

**Code:**

```go
package main

import "fmt"

func multiplier(factor int) func(int) int {
    return func(n int) int {
        return n * factor
    }
}

func main() {
    double := multiplier(2)
    triple := multiplier(3)

    fmt.Println(double(5))  // Output: 10
    fmt.Println(triple(5))  // Output: 15
}
```

**Explanation:**

- The closure `multiplier` takes a `factor` argument and returns a function that multiplies a number by that factor.
- Each closure (`double`, `triple`) uses its own `factor` value to perform the operation.

---

### 4. **Closures with Deferred Execution**

**Question:** How can closures be used in Go with deferred execution, and what happens when the closure accesses variables after the outer function returns?

**Code:**

```go
package main

import "fmt"

func main() {
    a := 10
    defer func(a int) { // Pass 'a' as a parameter to the deferred function
        fmt.Println("Deferred closure:", a)
    }(a) // Pass the current value of 'a' here
    a = 20
    fmt.Println("Inside main:", a)
}
```

**Explanation:**

- Even though `a` is modified inside `main`, the deferred closure captures the value of `a` at the time the defer statement was encountered by passing it as a parameter.
- The closure prints the value of `a` that was captured before it was modified.

---

### 5. **Closure Capturing Loop Variable**

**Question:** Write a Go program that demonstrates a common pitfall when using closures inside loops. The closure captures the loop variable incorrectly.

**Code:**

```go
package main

import "fmt"

func main() {
    funcs := []func(){}

    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() {
            fmt.Println(i) // Output: 3, 3, 3
        })
    }

    for _, f := range funcs {
        f()
    }
}
```

**Explanation:**

- All closures capture the same `i` variable. At the time of closure execution, `i` is 3 (the value after the loop ends).
- To fix this, you need to pass `i` as a parameter to the closure:

**Fixed Code:**

```go
package main

import "fmt"

func main() {
    funcs := []func(){}

    for i := 0; i < 3; i++ {
        i := i // Create a new variable inside the loop
        funcs = append(funcs, func() {
            fmt.Println(i) // Output: 0, 1, 2
        })
    }

    for _, f := range funcs {
        f()
    }
}
```

---

### 6. **Closures with Function Arguments**

**Question:** Create a closure that adds two numbers and demonstrates how closures can capture arguments passed to the inner function.

**Code:**

```go
package main

import "fmt"

func adder(a int) func(int) int {
    return func(b int) int {
        return a + b
    }
}

func main() {
    add5 := adder(5)
    fmt.Println(add5(3))  // Output: 8
    fmt.Println(add5(10)) // Output: 15
}
```

**Explanation:**

- The outer function `adder` captures `a` and returns a closure that adds `a` to the argument `b`.
- The closure `add5` remembers `a = 5` and adds it to the argument passed to it.

---

### 7. **Closures with a Function Factory**

**Question:** Implement a closure that acts as a function factory, returning different mathematical operations based on the argument passed to the factory.

**Code:**

```go
package main

import "fmt"

func operationFactory(operator string) func(int, int) int {
    switch operator {
    case "add":
        return func(a, b int) int {
            return a + b
        }
    case "subtract":
        return func(a, b int) int {
            return a - b
        }
    case "multiply":
        return func(a, b int) int {
            return a * b
        }
    }
    return nil
}

func main() {
    add := operationFactory("add")
    subtract := operationFactory("subtract")
    multiply := operationFactory("multiply")

    fmt.Println(add(3, 4))       // Output: 7
    fmt.Println(subtract(9, 4))  // Output: 5
    fmt.Println(multiply(3, 4))  // Output: 12
}
```

**Explanation:**

- The `operationFactory` returns different closures based on the operator passed.
- Each closure performs a corresponding mathematical operation.

---

### 8. **Closures with State Preservation**

**Question:** Write a closure that preserves state across multiple invocations (like a simple counter) and explain its working.

**Code:**

```go
package main

import "fmt"

func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    c1 := counter()
    c2 := counter()

    fmt.Println(c1()) // Output: 1
    fmt.Println(c1()) // Output: 2
    fmt.Println(c2()) // Output: 1
}
```

**Explanation:**

- Each call to `counter` returns a closure that maintains a unique `count` variable, preserving state across invocations.

---

### 9. **Closure with Function Composition**

**Question:** Create a Go program that demonstrates function composition using closures.

**Code:**

```go
package main

import "fmt"

func compose(f, g func(int) int) func(int) int {
    return func(x int) int {
        return f(g(x))
    }
}

func double(x int) int {
    return x * 2
}

func addFive(x int) int {
    return x + 5
}

func main() {
    composed := compose(double, addFive)
    fmt.Println(composed(3)) // Output: 16 (3 + 5 = 8, 8 * 2 = 16)
}
```

**Explanation:**

- The `compose` function takes two functions (`f` and `g`) and returns a new function that applies `g` first, then applies `f` to the result.
- The result is a composition of `double` and `addFive`.

---

````markdown
# Go Closures - 20 Questions with Code Examples and Explanations

This document contains 20 questions related to closures in Go, along with code examples and detailed explanations.

---

### 1. **What is a closure in Go?**

**Question:** Define what a closure is in Go with an example.

**Code:**

```go
package main

import "fmt"

func outer() func() {
    return func() {
        fmt.Println("This is a closure")
    }
}

func main() {
    closure := outer()
    closure()
}
```
````

**Explanation:**  
A closure is a function that captures the variables from its surrounding context. In the example, the inner function returned by `outer` is a closure, as it can access the environment in which it was created.

---

### 2. **How does a closure access variables from its outer function?**

**Question:** Show how a closure can access and modify variables in the outer function.

**Code:**

```go
package main

import "fmt"

func outer() func() {
    x := 10
    return func() {
        x++
        fmt.Println(x)
    }
}

func main() {
    closure := outer()
    closure() // Output: 11
    closure() // Output: 12
}
```

**Explanation:**  
The closure captures the `x` variable from the `outer` function and modifies it each time it is invoked.

---

### 3. **What happens when closures access variables from a loop?**

**Question:** Demonstrate the common mistake with closures capturing loop variables.

**Code:**

```go
package main

import "fmt"

func main() {
    funcs := []func(){}

    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() {
            fmt.Println(i)
        })
    }

    for _, f := range funcs {
        f()
    }
}
```

**Explanation:**  
All closures capture the same `i` variable, and when executed, they all print `3`. This happens because the closure captures a reference to the variable `i`, not its value at the time of closure creation.

---

### 4. **How can you fix the loop closure problem?**

**Question:** How can you avoid closures capturing the same variable in a loop?

**Code:**

```go
package main

import "fmt"

func main() {
    funcs := []func(){}

    for i := 0; i < 3; i++ {
        i := i // New variable for each iteration
        funcs = append(funcs, func() {
            fmt.Println(i)
        })
    }

    for _, f := range funcs {
        f()
    }
}
```

**Explanation:**  
By introducing a new variable `i` in the loop, each closure captures a separate value of `i`, resulting in `0`, `1`, and `2` being printed.

---

### 5. **Closures as Function Parameters**

**Question:** How do you pass a closure as an argument to another function?

**Code:**

```go
package main

import "fmt"

func applyClosure(f func()) {
    f()
}

func main() {
    closure := func() {
        fmt.Println("Closure passed as argument")
    }
    applyClosure(closure)
}
```

**Explanation:**  
You can pass a closure as an argument to another function. In this example, `applyClosure` accepts a closure and invokes it.

---

### 6. **Closures with Parameters**

**Question:** Write a closure that accepts a parameter and demonstrates how closures work with arguments.

**Code:**

```go
package main

import "fmt"

func multiplier(factor int) func(int) int {
    return func(n int) int {
        return n * factor
    }
}

func main() {
    double := multiplier(2)
    fmt.Println(double(4)) // Output: 8
}
```

**Explanation:**  
The closure `multiplier` takes a parameter `factor` and returns a function that multiplies the given number `n` by `factor`.

---

### 7. **Closures with Function Return Values**

**Question:** How do closures work when they return values?

**Code:**

```go
package main

import "fmt"

func adder(a int) func(int) int {
    return func(b int) int {
        return a + b
    }
}

func main() {
    addFive := adder(5)
    fmt.Println(addFive(3)) // Output: 8
}
```

**Explanation:**  
The closure captures the `a` variable and uses it when adding `b` in the returned function.

---

### 8. **Returning a Closure from a Function**

**Question:** Demonstrate how to return a closure from a function.

**Code:**

```go
package main

import "fmt"

func createCounter() func() int {
    counter := 0
    return func() int {
        counter++
        return counter
    }
}

func main() {
    counter1 := createCounter()
    counter2 := createCounter()

    fmt.Println(counter1()) // Output: 1
    fmt.Println(counter2()) // Output: 1
}
```

**Explanation:**  
Each call to `createCounter` creates a new closure, which maintains its own counter state.

---

### 9. **Closure with State Preservation**

**Question:** Write a closure that remembers its previous state across calls.

**Code:**

```go
package main

import "fmt"

func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    c1 := counter()
    c2 := counter()

    fmt.Println(c1()) // Output: 1
    fmt.Println(c1()) // Output: 2
    fmt.Println(c2()) // Output: 1
}
```

**Explanation:**  
A closure retains its own state, meaning each call to `counter` results in separate states for `c1` and `c2`.

---

### 10. **Closures and Anonymous Functions**

**Question:** How can closures be used with anonymous functions?

**Code:**

```go
package main

import "fmt"

func main() {
    a := 5
    closure := func() {
        fmt.Println("Captured value:", a)
    }
    closure() // Output: Captured value: 5
}
```

**Explanation:**  
Anonymous functions can be used as closures. In this case, the anonymous function captures the variable `a`.
