[**Author:** @mdimamhosen
**Date:** 2025-04-22
**Category:** interview-qa/Receiver Function
**Tags:** [go, Receiver Function]
]

# 📦 Receiver Function in Go

A receiver function in Go is a method bound to a specific type—typically a struct. It enables you to implement object-oriented behavior by defining methods on user-defined types.

---

## 🧱 Struct and Receiver Basics

### Struct Definition

```go
// User struct with basic fields
type User struct {
	Name string
	Age  int
}
```

---

## 📞 Regular Function vs Receiver Function

### Regular Function

```go
func printUser(user User) {
	fmt.Println("User Name:", user.Name)
	fmt.Println("User Age:", user.Age)
}
```

This is a standalone function that takes `User` as a parameter.

### Value Receiver Method

```go
func (u User) printDetails() {
	fmt.Println("Name:", u.Name)
	fmt.Println("Age:", u.Age)
}
```

Here, `printDetails()` is associated with `User` type using a value receiver. It works on a copy, so original data won’t change.

### Pointer Receiver Method

```go
func (u *User) updateAge(newAge int) {
	u.Age = newAge
}
```

This method modifies the original `User` struct because it uses a pointer receiver.

---

## ✅ Main Function with Usage

```go
func main() {
	user1 := User{Name: "John", Age: 30}
	user2 := User{Name: "Jane", Age: 25}

	// Regular function call
	printUser(user1)

	// Receiver function calls
	user1.printDetails()
	user2.printDetails()

	// Update age using pointer receiver
	user1.updateAge(35)
	fmt.Println("Updated Age of user1:", user1.Age)

	// Demonstrate value receiver (no change to original)
	user2.call(100)
	fmt.Println("User2's age after call():", user2.Age)
}
```

---

## 🔍 Additional Receiver Method

```go
// Value receiver that does not affect original struct
func (u User) call(age int) {
	u.Age = age
	fmt.Println("Inside call() - temporary age:", u.Age)
}
```

This will not change the actual `User.Age` outside the function.

---

## 🧪 Example Output

```
User Name: John
User Age: 30
Name: John
Age: 30
Name: Jane
Age: 25
Updated Age of user1: 35
Inside call() - temporary age: 100
User2's age after call(): 25
```

---

## 💡 Key Takeaways

- ✅ Value receivers are good for read-only operations.
- ✅ Pointer receivers are used when you want to modify the actual data.
- ✅ Go supports object-like behavior through receiver functions.
- ✅ Methods with pointer receivers can be called on both values and pointers.

## 10 Interview Questions and Answers

1. **What is a receiver function in Go?**

   - A receiver function is a method associated with a specific type, allowing you to define methods on structs or other types.

2. **What is the difference between a value receiver and a pointer receiver?**

   - A value receiver operates on a copy of the object, while a pointer receiver operates on the actual object, allowing modifications.

3. **Can you define multiple receiver functions for the same type?**

   - Yes, you can define multiple receiver functions for the same type.

4. **What is the syntax for defining a receiver function?**

   - `func (receiverType TypeName) methodName(parameters) {}`

5. **Can receiver functions be used with built-in types?**

   - No, receiver functions can only be defined for user-defined types.

6. **What happens if you call a value receiver function on a pointer?**

   - Go automatically dereferences the pointer, so the function works as expected.

7. **What is the purpose of receiver functions?**

   - They enable object-oriented programming by associating methods with types.

8. **Can a receiver function modify the original object?**

   - Only if it uses a pointer receiver.

9. **What is the difference between a regular function and a receiver function?**

   - A regular function is not associated with any type, while a receiver function is tied to a specific type.

10. **Can you use receiver functions with interfaces?**
    - Yes, receiver functions are often used to implement interface methods.

## Example Output

```
User Name: John
User Age: 30
User Name: Jane
User Age: 25
User Age: 10
User Age: 20
```
