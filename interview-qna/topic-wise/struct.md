[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** e.g., interview-qa/topic_name
**Tags:** [go, concurrency, channels]
]

# Structs (Structures)

A struct is used to create a collection of members of different data types, into a single variable.

```go
package main
import ("fmt")

type Person struct {
  name string
  age int
  job string
  salary int
}

func main() {
  var userOne Person

  userOne.name = "HuXn"
  userOne.age = 18
  userOne.job = "Programmer"
  userOne.salary = 40000

  fmt.Println(userOne)
  fmt.Println("My name is", userOne.name, "I'm", userOne.age, "Years old", "My Profession is", userOne.job, "My salary is", userOne.salary)
}
```

## Frequently Asked Questions (FAQ)

### 1. What is a struct in Go?

**Answer:** A struct is a composite data type in Go that groups together variables under a single name. These variables can be of different types.

**Example:**

```go
type Person struct {
  name string
  age int
}

func main() {
  p := Person{name: "Alice", age: 30}
  fmt.Println(p)
}
```

### 2. How do you define and initialize a struct in Go?

**Answer:** You can define a struct using the `type` keyword and initialize it using a struct literal.

**Example:**

```go
type Car struct {
  brand string
  year  int
}

func main() {
  c := Car{brand: "Toyota", year: 2020}
  fmt.Println(c)
}
```

### 3. Can you create an anonymous struct in Go?

**Answer:** Yes, you can create an anonymous struct without defining a named type.

**Example:**

```go
func main() {
  person := struct {
    name string
    age  int
  }{
    name: "John",
    age: 25,
  }
  fmt.Println(person)
}
```

### 4. How do you access and modify struct fields in Go?

**Answer:** You can access and modify struct fields using the dot `.` operator.

**Example:**

```go
type Book struct {
  title  string
  author string
}

func main() {
  b := Book{title: "Go Programming", author: "John Doe"}
  b.title = "Advanced Go Programming"
  fmt.Println(b)
}
```

### 5. Can structs have methods in Go?

**Answer:** Yes, you can define methods for structs.

**Example:**

```go
type Rectangle struct {
  width, height float64
}

func (r Rectangle) Area() float64 {
  return r.width * r.height
}

func main() {
  rect := Rectangle{width: 10, height: 5}
  fmt.Println("Area:", rect.Area())
}
```

### 6. What is the difference between value and pointer receivers in struct methods?

**Answer:** Value receivers operate on a copy of the struct, while pointer receivers operate on the original struct.

**Example:**

```go
type Counter struct {
  count int
}

func (c *Counter) Increment() {
  c.count++
}

func main() {
  c := Counter{}
  c.Increment()
  fmt.Println(c.count)
}
```

### 7. Can structs embed other structs in Go?

**Answer:** Yes, Go supports struct embedding for composition.

**Example:**

```go
type Address struct {
  city, state string
}

type Person struct {
  name    string
  address Address
}

func main() {
  p := Person{name: "Alice", address: Address{city: "New York", state: "NY"}}
  fmt.Println(p)
}
```

### 8. How do you compare two structs in Go?

**Answer:** You can compare structs using the `==` operator if all fields are comparable.

**Example:**

```go
type Point struct {
  x, y int
}

func main() {
  p1 := Point{x: 1, y: 2}
  p2 := Point{x: 1, y: 2}
  fmt.Println(p1 == p2) // true
}
```

### 9. Can you use structs as map keys in Go?

**Answer:** Yes, structs can be used as map keys if all their fields are comparable.

**Example:**

```go
type Point struct {
  x, y int
}

func main() {
  m := make(map[Point]string)
  m[Point{x: 1, y: 2}] = "A Point"
  fmt.Println(m)
}
```

### 10. How do you iterate over struct fields in Go?

**Answer:** You can use the `reflect` package to iterate over struct fields.

**Example:**

```go
import (
  "fmt"
  "reflect"
)

type Person struct {
  Name string
  Age  int
}

func main() {
  p := Person{Name: "Alice", Age: 30}
  v := reflect.ValueOf(p)
  for i := 0; i < v.NumField(); i++ {
    fmt.Println(v.Type().Field(i).Name, v.Field(i))
  }
}
```
