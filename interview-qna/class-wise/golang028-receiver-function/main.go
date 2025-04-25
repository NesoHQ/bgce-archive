package main

import (
	"fmt"
)

// Define a struct called `Person`
type Person struct {
	Name string
	Age  int
}

// Define a receiver function for `Person`
// This function is attached to the struct type `Person` using the receiver `(p Person)`
func (p Person) Greet() {
	// Inside the function, `p` refers to the instance the method was called on
	fmt.Println("Hello, my name is", p.Name, "and I am", p.Age, "years old.")
}

// Define another receiver function that modifies the struct
// This time, we use a pointer receiver to actually change the struct's data
func (p *Person) HaveBirthday() {
	p.Age++ // Increases the age by 1
	fmt.Println(p.Name, "just turned", p.Age, "🎉")
}

func main() {
	// Create a new Person instance
	person1 := Person{Name: "Ruhin", Age: 21}

	// Call the Greet method (value receiver)
	person1.Greet()

	// Call the HaveBirthday method (pointer receiver)
	person1.HaveBirthday()

	// Call Greet again to see the updated age
	person1.Greet()
}

