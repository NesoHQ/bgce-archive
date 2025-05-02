# Class 27: Structs & Memory Layout in Go 🧱

Welcome to Class 27! Today we're diving into **structs**, how to define and instantiate them, and how they interact with Go's memory model. Let's visualize everything from scratch like pros. 🧠💡

---

## ✍️ The Code

```go
package main

import "fmt"

type User struct {
	Name string
	Age  int
}

func (usr User) printDetails() {
	fmt.Println("Name:", usr.Name)
	fmt.Println("Age:", usr.Age)
}

func main() {
	user1 := User{
		Name: "Ruhin",
		Age:  21,
	}

	user2 := User{
		Name: "Mukim",
		Age:  15,
	}

	user1.printDetails()
	user2.printDetails()
}
```

---

## 🧠 Key Concepts

### 🧩 What is a Struct?
A **struct** is a user-defined type in Go used to group related data together. It’s like a custom container for fields.

```go
type User struct {
	Name string
	Age  int
}
```
This defines a new type called `User` with fields `Name` and `Age`.

---

### 🔨 Creating Instances (Instantiation)
When we create an actual value using a struct type, that’s called **instantiating**.

```go
user1 := User{
	Name: "Ruhin",
	Age:  21,
}
```
Here `user1` is an **instance** of `User`. This allocates memory to hold `Name` and `Age` values.

---

## 🧠 Memory Layout (Visualization)

```
┌─────────────────────────────┐
│       Code Segment          │
│-----------------------------│
│ main, printDetails,         │
│ type User struct {...}      │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│       Data Segment          │
│-----------------------------│
│ -                           │
│ (Global vars if present)    │
└─────────────────────────────┘
          ↓
┌─────────────────────────────┐
│           Stack             │
│-----------------------------│
│ main() frame →              │
│   user1 → Name: "Ruhin"     │
│           Age: 21           │
│   user2 → Name: "Mukim"     │
│           Age: 15           │
└─────────────────────────────┘
```

> ⚠️ NOTE: If a struct is returned from a function or captured by a closure, it may escape to the heap instead of stack.

---

## 📋 Example Use Case

```go
type Book struct {
	Title  string
	Author string
	Pages  int
}

book1 := Book{
	Title: "1984",
	Author: "George Orwell",
	Pages: 328,
}
```
This lets us build real-world models with multiple fields.

---

## 🧹 Role of the Garbage Collector (GC)

- If a struct instance **escapes** (used outside the function, stored long-term, etc.), Go stores it on the **heap**.
- Go’s **garbage collector** then tracks and cleans it when it’s no longer in use.
- This means you don’t have to manually `free()` anything — Go handles memory cleanup for heap objects.

---

## 🚀 TL;DR

- `type User struct {...}` is metadata → stored in the **Code Segment**.
- `user1 := User{...}` is runtime data → stored in **Stack** or **Heap** depending on usage.
- Structs bundle fields into one logical unit ✅
- Memory layout varies depending on usage → escape analysis decides 📦🧳
- GC only manages objects in the **heap**, not on the **stack** 🧹

---

### Q: Is struct a datatype?
**Ans:** 
Yes, 100% — a struct in Go is a user-defined data type. Think of it like creating your own custom "blueprint" for a data object. 💡

**Here's how it fits in:**

-[] Go has primitive data types like `int`, `string`, `bool`, `etc`.

-[] You can then use `struct` to define a custom data type that groups multiple fields together.

For example:
```go
type User struct {
	Name string
	Age  int
}
```
This `User` struct becomes its own data type, and now you can create instances of it just like you would for `int` or `string`:
```go
var u User
u.Name = "Ruhin"
u.Age = 21
```
It’s like building your own Lego brick with a custom shape, and then making as many copies of that brick as you want. 🧱✨


> You’re now struct-urally sound in Go! 😎 Next time you model data, flex your type muscles and track those memory segments like a boss.


