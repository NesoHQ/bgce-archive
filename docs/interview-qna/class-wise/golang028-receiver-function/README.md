# Class 28: Receiver Functions in Go

## 🔑 Key Concept: Receiver Functions
In Go, a **receiver function** (also called a **method**) is a function that is associated with a particular **type** (usually a struct). It allows us to add behavior to data types, like attaching functions to objects in other languages (e.g., methods in OOP).

---

## 🧠 What Is a Receiver Function?
A **receiver function** is defined like a normal function, but with a special receiver parameter placed between the `func` keyword and the function name.

```go
func (r ReceiverType) FunctionName(params) returnType {
    // function body
}
```

The receiver type can be:
- A **value receiver**: `(t Type)` → receives a copy
- A **pointer receiver**: `(t *Type)` → receives a reference (can modify original)

---

## 🏗️ From the Project Code
```go
func (todos *Todos) add(title string) {
    todo := Todo{
        Title: title,
        Completed: false,
        CompletedAt: nil,
        CreatedAt: time.Now(),
    }
    *todos = append(*todos, todo)
}
```

- `todos *Todos` is the **receiver**
- This method is attached to `Todos` (which is a custom type: `[]Todo`)
- The `*Todos` pointer allows modifications to the original slice

Example usage from `main.go`:
```go
todos.add("Buy milk")
```

---

## 🔁 Why Use Receiver Functions?
- Organize logic with the data it operates on ✅
- Achieve OOP-like behavior in Go ✅
- Maintain cleaner and modular code ✅

---

## 💡 Extra Simple Example
```go
type User struct {
    Name string
}

// Value receiver (no change to original)
func (u User) SayHi() {
    fmt.Println("Hi, I am", u.Name)
}

// Pointer receiver (can change original)
func (u *User) ChangeName(newName string) {
    u.Name = newName
}

func main() {
    user := User{Name: "Ruhin"}
    user.SayHi() // Hi, I am Ruhin
    user.ChangeName("Mukim")
    user.SayHi() // Hi, I am Mukim
}
```

---

## ⚙️ Summary
| Term            | Meaning                                                                 |
|-----------------|-------------------------------------------------------------------------|
| Receiver        | The type a method is attached to (e.g., `*Todos`)                       |
| Value Receiver  | Gets a copy of the value; doesn't affect the original                   |
| Pointer Receiver| Gets a reference; can modify the original                               |

---

## 📘 Visualizing It
Think of `todos.add()` as calling a behavior of the object:
```go
object.method()
```
This pattern lets `Todos` have its own custom logic, like `add`, `delete`, `toggle`, `print`, etc., just like class methods in Python/Java.

---

[**Author:** @ifrunruhin12
**Date:** 2025-05-01
**Category:** interview-qa/class-wise
]