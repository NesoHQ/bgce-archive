# Class 30: Pointers in Go

## What is a Pointer?
A **pointer** is a variable that stores the **memory address** of another variable.

In Go, memory is divided into several segments:
- **Code segment**: Stores compiled program instructions (functions).
- **Data segment**: Stores global/static variables and constants.
- **Heap**: Stores dynamically allocated memory.
- **Stack**: Stores local variables and function call information.

Pointers help us interact directly with memory addresses.

---

## Symbols to Know:

- `&` (Ampersand): Used to get the **address** of a variable.
- `*` (Star/Dereference operator): Used to get the **value** stored at a memory address.

Example:
```go
x := 20
p := &x // p holds the address of x

*p = 30 // change value at address p (which changes x)

fmt.Println(x)  // 30
fmt.Println(p)  // address of x
fmt.Println(*p) // 30 (value at address)
```

---

## Why Use Pointers?
- **Efficiency**: Instead of copying big structures (like arrays), just pass their memory address.
- **Shared Modification**: If multiple functions need to modify the same data.
- **Memory Management**: Especially important in lower-level or high-performance programming.

Without pointers, every function call would copy entire objects. That's sloooow and wasteful!

---

## Pass by Value vs Pass by Reference

**Pass by Value**:
- A copy of the variable is passed.
- Changes inside the function don't affect the original.

```go
func print(numbers [3]int) {
	fmt.Println(numbers)
}

arr := [3]int{1, 2, 3}
print(arr) // Passing a copy
```

**Pass by Reference**:
- Pass the address instead of copying.
- Changes inside the function affect the original.

```go
func print2(numbers *[3]int) {
	fmt.Println(numbers)
}

arr := [3]int{1, 2, 3}
print2(&arr) // Passing a pointer
```

---

## Struct Pointers (and why Go is chill with them)

When you have a pointer to a struct, Go is smart enough to let you access fields without needing `*` every time.

```go
user1 := User{
	Name: "Ruhin",
	Age: 21,
	Salary: 0,
}
p2 := &user1
fmt.Println(p2.Age) // no need to write (*p2).Age
```

Go automatically dereferences it for you. Big W.

---

## Full Code Example from Class:
```go
package main

import "fmt"

type User struct {
	Name   string
	Age    int
	Salary float64
}

func print(numbers [3]int) {
	fmt.Println(numbers)
}

func print2(numbers *[3]int) {
	fmt.Println(numbers)
}

func main() {
	x := 20
	p := &x
	*p = 30
	
	fmt.Println(x)           // 30
	fmt.Println("Address:", p)
	fmt.Println("Value:", *p)

	arr := [3]int{1, 2, 3}
	print(arr)   // pass by value
	print2(&arr) // pass by reference

	user1 := User{
		Name:   "Ruhin",
		Age:    21,
		Salary: 0,
	}
	p2 := &user1
	fmt.Println(p2.Age)
}
```

---

# Memory Layout Visualization (CLI-Style)

```
+--------------------+----------------------------------+
| Segment            | What's stored                   |
+--------------------+----------------------------------+
| Code Segment       | main(), print(), print2()        |
| Data Segment       | (none for local vars here)       |
| Stack              | arr [3]int {1,2,3}, x=30         |
|                    | p (pointer to x)                 |
|                    | user1 (User struct)              |
|                    | p2 (pointer to user1)            |
| Heap               | (unused for this simple program) |
+--------------------+----------------------------------+
```

### Detailed Memory Visualization (Addresses and Values)

```
Stack Memory:

[ Address 0x1000 ] x = 30
[ Address 0x1004 ] p -> 0x1000 (address of x)
[ Address 0x1008 ] arr = [1, 2, 3]
[ Address 0x1010 ] user1 = {"Ruhin", 21, 0.0}
[ Address 0x1018 ] p2 -> 0x1010 (address of user1)

Code Segment:
- Compiled code of main, print, print2

Data Segment:
- Empty (no global variables/constants)

Heap:
- Not used in this example
```

---

# Extra Example: Swapping Two Numbers with Pointers

Without Pointers (FAIL):
```go
func swap(x, y int) {
	temp := x
	x = y
	y = temp
}

func main() {
	a, b := 1, 2
	swap(a, b)
	fmt.Println(a, b) // still 1 2
}
```

With Pointers (WIN):
```go
func swap(x, y *int) {
	temp := *x
	*x = *y
	*y = temp
}

func main() {
	a, b := 1, 2
	swap(&a, &b)
	fmt.Println(a, b) // 2 1
}
```

---

# Quick Summary
- `&` gets the address.
- `*` gets the value at an address.
- Pointers = efficient + powerful.
- Struct pointer fields are auto-dereferenced.
- Pass big things (like arrays, structs) by pointer to save memory.

---

**Bro Tip**: 
> When in doubt, think: "Am I copying a whole dang castle, or just giving a map to it?" 

Pointers = the map. ✅


[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/arrays
]