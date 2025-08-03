[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-22
**Category:** interview-qa/arrays
**Tags:** [go, clousers, functions]
]

# Closure

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

## ⚙️ Code Execution ধাপসমূহ

### 🧩 ধাপ ১: Compilation

* Compile করে binary তৈরি করুন:

```bash
go build main.go
```

### 🚀 ধাপ ২: Execution

* Binary run করুন:

```bash
./main
```

## 🔒 Go-তে Closures

### ✅ Closure কী?

Closure হলো এমন একটি funtion, **যা অন্য একটি funtion এর ভিতরে define করা হয়** এবং **যা তার নিজের scope ছাড়াও তার outer scope** থাকা **variable গুলোকে** মনে রাখে এবং ব্যবহার করতে পারে, এমনকি সেই outer scope টি execute হওয়া শেষ হয়ে গেলেও।

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

* `money` variable টি inner function দ্বারা capture করা হয়।
* প্রতিবার call করলে `money` update হয়।

### ✅ Multiple Closures

* প্রতিবার `Outer()` call করলে নতুন `money` instance তৈরি হয়, যা অন্যগুলোর থেকে আলাদা।

---

## 🧠 Output ব্যাখ্যা

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

* দুইটি closure তৈরি হয়েছে, প্রতিটির নিজস্ব `money` instance আছে।
* এরা একে অপরকে প্রভাবিত করে না।

---

### 🧱 Memory segment বিশ্লেষণ

| segment      | কী সংরক্ষণ করে                                                                         |
| ------------- | -------------------------------------------------------------------------------------- |
| Code segment  | compile করা নির্দেশাবলী এবং constant (`a`, `main`, `call`, `Outer`, `init`, `show`) |
| Data segment | Global variable `b`                                                                  |
| Stack       | Local variable (`age`), function call frame                                                |
| Heap           | Closer ও Escaping variable (`money`)                                                 |

---

## 🧠 Visualization

### CLI-style Memory বিন্যাস

```
┌──────────────────────────────┐
│        Code segment          │
│------------------------------│
│ const a = 10,                │
│ func main, call, Outer, init │
│ show (anonymous function)    │
└──────────────────────────────┘
          ↓
┌──────────────────────────────┐
│        Data segment         │
│------------------------------│
│ var b = 20                   │
└──────────────────────────────┘
          ↓
┌──────────────────────────────┐
│           Stack              │
│------------------------------│
│ Outer() frame                │
│   age = 20                   │
│   return address             │
└──────────────────────────────┘
          ↓
┌──────────────────────────────┐
│            Heap               │
│------------------------------│
│ money = 100 (inc)            │
│ money = 130 (after inc())    │
│ money = 160 (after inc())    │
│                              │
│ money = 100 (inc1)           │
│ money = 130 (after inc1())   │
│ money = 160 (after inc1())   │
└──────────────────────────────┘
```

---

### 🧠 ব্যাখ্যা:

* `a` ও `b` Global — তাই `a` Code segment (const), আর `b` Data segment এ যায়।
* `age` একটি Local variable, এবং কেবল `Outer` function ব্যবহৃত — Stack থাকে।
* `money` একটি Closer এর অংশ, কারণ `show()` function এর মধ্যে ব্যবহৃত ও return করা হচ্ছে — তাই এটি **Heap এ** সংরক্ষিত।
* প্রতিবার `Outer()` call হলে, নতুন `money` variable Heap তৈরি হয়, আলাদা করে (`inc`, `inc1`)।


---

## 🔍 Types of Closures 

### 1. **Closure with Outer Variable**

**প্রশ্ন:** একটি Go program লিখুন যা দেখায় কীভাবে closure outer function থেকে variable access ও modify করতে পারে।

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

**ব্যাখ্যা:**

* `outer` function একটি closure তৈরি করে যা `x` ভেরিয়েবল capture করে এবং modify করে।
* প্রতিবার call করলে `x` এর মান বাড়ে।

---

### 2. **Multiple Closures with Separate States**

**প্রশ্ন:** দেখান কীভাবে একই function এ তৈরি হওয়া একাধিক closures তাদের নিজস্ব state ধরে রাখে।

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

**ব্যাখ্যা:**

* `counter1` এবং `counter2` প্রতিটিই আলাদা closure, যাদের নিজস্ব `counter` state রয়েছে।
* এরা একে অপরকে প্রভাবিত করে না।

---

### 3. **Closure with Parameters**

**প্রশ্ন:** এমন একটি closure লিখুন যা parameter accept করে এবং দেখায় যে closures কীভাবে arguments ব্যবহার করতে পারে।

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

**ব্যাখ্যা:**

* `multiplier` নামের closure `factor` parameter accept করে এবং একটি function return করে যা `n` কে `factor` দিয়ে গুণ করে।
* `double` এবং `triple` আলাদা আলাদা factor ব্যবহার করে।

---

### 4. **Closures with Deferred Execution**

**প্রশ্ন:** Go-তে closures কীভাবে deferred execution এর সঙ্গে ব্যবহার করা যায় এবং outer function শেষ হওয়ার পর variable access করলে কী ঘটে?

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

**ব্যাখ্যা:**

* যদিও `main` এ `a` পরিবর্তিত হয়েছে, deferred closure-এ `a` এর যে মান পাঠানো হয়েছে সেটাই print হবে।
* কারণ `a` parameter হিসেবে capture করা হয়েছে, reference নয়।

---

### 5. **Closure Capturing Loop Variable**

**প্রশ্ন:** একটি Go program লিখুন যা দেখায় কীভাবে closure loop variable ভুলভাবে capture করে।

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

**ব্যাখ্যা:**

* সব closures একই `i` variable capture করে।
* loop শেষ হওয়ার পরে `i` এর মান হয় 3, তাই সব output হয় 3।
* এটা ঠিক করার জন্য এর `i` মান parameter হিসাবে closures এ পাঠাতে হবে।

**সঠিক code:**

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

**প্রশ্ন:** এমন একটি closure তৈরি করুন যা দুটি সংখ্যা যোগ করে এবং দেখায় কীভাবে closures argument capture করে।

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

**ব্যাখ্যা:**

* `adder` function `a` কে capture করে এবং `b` এর সাথে যোগ করে।
* `add5` closure `a = 5` মনে রাখে এবং তার সাথে নতুন `b` যোগ করে।

---

### 7. **Closures with a Function Factory**

**প্রশ্ন:** একটি closure তৈরি করুন যা function factory হিসেবে কাজ করে এবং pass করা argument অনুসারে বিভিন্ন mathematical operation return করে।

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

**ব্যাখ্যা:**

* `operationFactory` pass করা operator অনুযায়ী একটি closure return করে।
* প্রতিটি closure নির্দিষ্ট operation সম্পাদন করে।

---

### 8. **Closures with State Preservation**

**প্রশ্ন:** এমন একটি closure লিখুন যা বারবার call করার পরও তার state সংরক্ষণ করে (যেমন একটি simple counter) 

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

**ব্যাখ্যা:**

* প্রতিটি `counter()` call একটি নতুন `count` variable সহ closure তৈরি করে।
* `c1` এবং `c2` আলাদা আলাদা state সংরক্ষণ করে।

---

### 9. **Closure with Function Composition**

**প্রশ্ন:** একটি Go প্রোগ্রাম তৈরি করুন যা closures ব্যবহার করে function composition demonstrate করে।

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

**ব্যাখ্যা:**

* `compose` function দুটি function `f` এবং `g` accept করে এবং একটি নতুন function return করে যা `g(x)` এর ওপর `f()` apply করে।
* এখানে `double(addFive(3))` => `double(8)` => `16`

---
# Go Closures - code উদাহরণ ও ব্যাখ্যাসহ ২০টি প্রশ্ন

এই document Go-এর closures নিয়ে ২০টি প্রশ্ন, code উদাহরণ এবং বিস্তারিত ব্যাখ্যা রয়েছে।

---

### 1. **Go-তে closure কী?**

**প্রশ্ন:** Go-এ closure কী তা ব্যাখ্যা করুন একটি উদাহরণসহ।

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

**ব্যাখ্যা:**  
একটি closure এমন একটি function যা তার চারপাশের scope থেকে variable ধরে রাখতে পারে। উপরের উদাহরণে `outer` function যেটি return করছে সেটি একটি closure, কারণ এটি তার তৈরি হওয়া environment-এর context access করতে পারে।

---

### 2. **একটি closure কীভাবে outer function-এর variable access করে?**

**প্রশ্ন:** দেখান কিভাবে একটি closure outer variable access ও modify করতে পারে।

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

**ব্যাখ্যা:**  
এই closure outer `x` variable ধরে রাখে এবং প্রতিবার call করার সময় তাকে modify করে।

---

### 3. **closure যখন loop-এর variable access করে তখন কী হয়?**

**প্রশ্ন:** closure দ্বারা loop variable capture করার সময় কী ধরনের ভুল হতে পারে তা দেখান।

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

**ব্যাখ্যা:**  
এখানে সবগুলো closure একই `i` variable ধরে রাখে, তাই প্রত্যেকটা closure call করার সময় `3` print হয়। কারণ loop শেষ হবার পর `i` এর final value 3 হয়ে যায়, এবং closure সেই reference-টাই ধরে রাখে।

---

### 4. **loop closure সমস্যা কীভাবে সমাধান করবেন?**

**প্রশ্ন:** loop-এর প্রতিটি iteration-এ আলাদা variable কিভাবে capture করবেন?

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

**ব্যাখ্যা:**  
`i := i` দিয়ে প্রতি iteration-এ নতুন `i` তৈরি হওয়ায়, closure গুলো ভিন্ন ভিন্ন value ধরে রাখে এবং আলাদা আলাদা output দেয়: `0`, `1`, `2`।

---

### 5. **Function parameter হিসেবে closure**

**প্রশ্ন:** কিভাবে closure-কে অন্য function-এ argument হিসেবে pass করবেন?

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

**ব্যাখ্যা:**  
closure-কে কোনো function-এর argument হিসেবে pass করা যায়। এখানে `applyClosure` function-টি একটি closure নেয় এবং তাকে execute করে।

---

### 6. **parameter সহ closure**

**প্রশ্ন:** একটি closure লিখুন যেটি একটি parameter নেয় ?

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

**ব্যাখ্যা:**  
এই closure `factor` ধরে রাখে এবং return করা function `n` এর সাথে তাকে গুণ করে। এইভাবে `double(4)` output দেয় `8`।

---

### 7. **closure যখন value return করে**

**প্রশ্ন:** দেখান কিভাবে closure return value দেয়।

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

**ব্যাখ্যা:**  
এই closure `a` ধরে রাখে এবং প্রতিবার নতুন input `b` এর সাথে তা যোগ করে result return করে।

---

### 8. **একটি function থেকে closure return করা**

**প্রশ্ন:** দেখান কিভাবে একটি function closure return করতে পারে।

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

**ব্যাখ্যা:**  
`createCounter` প্রত্যেকবার call করলে নতুন একটি closure return করে যার নিজস্ব `counter` থাকে।

---

### 9. **closure যেটি তার পূর্ববর্তী state মনে রাখে**

**প্রশ্ন:** এমন একটি closure লিখুন যা আগের state ধরে রাখতে পারে।

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

**ব্যাখ্যা:**  
প্রতিটি closure আলাদা `count` ধরে রাখে। তাই `c1` এবং `c2` এর মধ্যে একে অপরের সাথে কোনো সম্পর্ক নেই।

---

### 10. **closure এবং anonymous function**

**প্রশ্ন:** কিভাবে anonymous function ব্যবহার করে closure তৈরি করা যায়?

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

**ব্যাখ্যা:**  
anonymous function closure হিসেবে কাজ করতে পারে। এখানে `a` variable টি capture করে রেখেছে function টা।

---
---

### 11. **Closure দিয়ে lazy evaluation**

**প্রশ্ন:** কিভাবে closure ব্যবহার করে lazy evaluation করা যায়?

**Code:**

```go
package main

import "fmt"

func lazySum(a, b int) func() int {
    return func() int {
        return a + b
    }
}

func main() {
    sum := lazySum(3, 4)
    fmt.Println("Doing something else...")
    fmt.Println("Now evaluating sum:", sum())
}
```

**ব্যাখ্যা:**  
এই উদাহরণে, `lazySum` function টি actual calculation defer করে রাখে যতক্ষণ না `sum()` call করা হয়।

---

### 12. **Closure ব্যবহার করে filter function তৈরি করা**

**প্রশ্ন:** কিভাবে closure ব্যবহার করে একটি filter function তৈরি করা যায়?

**Code:**

```go
package main

import "fmt"

func filter(data []int, predicate func(int) bool) []int {
    result := []int{}
    for _, v := range data {
        if predicate(v) {
            result = append(result, v)
        }
    }
    return result
}

func main() {
    nums := []int{1, 2, 3, 4, 5}
    even := func(n int) bool {
        return n%2 == 0
    }
    fmt.Println(filter(nums, even)) // Output: [2 4]
}
```

**ব্যাখ্যা:**  
`filter` function টি একটি closure নেয় যেটি প্রতিটি item evaluate করে। এখানে, `even` একটি closure যা শুধু জোড় সংখ্যা বেছে নেয়।

---

### 13. **Closure দিয়ে memoization**

**প্রশ্ন:** কিভাবে closure ব্যবহার করে memoization implement করা যায়?

**Code:**

```go
package main

import "fmt"

func memoize() func(int) int {
    cache := map[int]int{}
    return func(n int) int {
        if val, ok := cache[n]; ok {
            return val
        }
        result := n * n
        cache[n] = result
        return result
    }
}

func main() {
    square := memoize()
    fmt.Println(square(4)) // Output: 16
    fmt.Println(square(4)) // Cached output: 16
}
```

**ব্যাখ্যা:**  
এই closure একটি map-এর মাধ্যমে আগে হিসাব করা ফলাফল মনে রাখে। একই input দিলে সে পুরোনো result ব্যবহার করে।

---

### 14. **Closure দিয়ে callback implement করা**

**প্রশ্ন:** কিভাবে closure ব্যবহার করে callback তৈরি করা যায়?

**Code:**

```go
package main

import "fmt"

func doSomething(callback func(string)) {
    callback("Hello from callback")
}

func main() {
    doSomething(func(msg string) {
        fmt.Println(msg)
    })
}
```

**ব্যাখ্যা:**  
closure callback হিসেবে কাজ করছে যা `doSomething` function থেকে invoke হচ্ছে।

---

### 15. **Closure এবং goroutine**

**প্রশ্ন:** closure কিভাবে goroutine এর মধ্যে ব্যবহার করা যায়?

**Code:**

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    for i := 0; i < 3; i++ {
        i := i
        go func() {
            fmt.Println(i)
        }()
    }
    time.Sleep(1 * time.Second)
}
```

**ব্যাখ্যা:**  
closure গুলো goroutine এর মধ্যে চলেছে। `i := i` দিয়ে প্রতি iteration-এ আলাদা value ensure করা হয়েছে।

---

### 16. **Closure scope এর প্রভাব**

**প্রশ্ন:** একটি closure কিভাবে ভিন্ন scope এ ভিন্ন আচরণ করে?

**Code:**

```go
package main

import "fmt"

func main() {
    x := 5
    {
        x := 10
        closure := func() {
            fmt.Println(x)
        }
        closure() // Output: 10
    }
}
```

**ব্যাখ্যা:**  
closure সেই scope-এর variable ধরে যেখানে এটি define হয়েছে। এখানে closure `x := 10` এর value ধরে রেখেছে।

---

### 17. **Closure-এ pointer capture করা**

**প্রশ্ন:** কিভাবে closure pointer capture করে ?

**Code:**

```go
package main

import "fmt"

func main() {
    x := 10
    ptr := &x

    closure := func() {
        fmt.Println(*ptr)
    }

    x = 20
    closure() // Output: 20
}
```

**ব্যাখ্যা:**  
closure একটি pointer ধরে রাখলে, variable-এর যে কোনো পরিবর্তন সে reflect করবে কারণ address ধরেই access হয়।

---

### 18. **Closure reference vs value capture**

**প্রশ্ন:** Go-তে closure variable কে reference না value হিসাবে ধরে রাখে?

**Code:**

```go
package main

import "fmt"

func main() {
    x := 10
    closure := func(val int) {
        fmt.Println(val)
    }

    x = 20
    closure(x) // Output: 20
}
```

**ব্যাখ্যা:**  
যখন আপনি closure-এ variable pass করেন (যেমন `val int`), তখন সেটি value হিসাবে যায়। তবে যদি variable capture করা হয় closure scope-এ, সেটা reference এর মতো behave করে।

---

### 19. **Closure এবং defer**

**প্রশ্ন:** closure কিভাবে defer statement এর সঙ্গে কাজ করে?

**Code:**

```go
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        i := i
        defer func() {
            fmt.Println(i)
        }()
    }
}
```

**ব্যাখ্যা:**  
সব `defer` statement পরে একসাথে execute হয় (LIFO)। এখানে `i := i` দিয়ে প্রতিটি closure আলাদা value capture করে।

---

### 20. **Closure debugging এর টিপস**

**প্রশ্ন:** closure ব্যবহার করার সময় common debugging সমস্যা ও সমাধান কী?

**Explanation (no code):**  
- loop variable capture করলে সব closure একই variable reference ধরে রাখতে পারে (সমস্যা)। সমাধান: নতুন variable declare করে capture করা।
- closure asynchronous context (যেমন goroutine) এ ব্যবহার করলে, race condition তৈরি হতে পারে। সমাধান: value copy করে capture করা।
- closure capturing unexpected state? সরাসরি log print করুন বা debugger দিয়ে scoped variable inspect করুন।

---
