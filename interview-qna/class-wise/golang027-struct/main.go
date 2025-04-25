package main

import "fmt"

type User struct{
	Name string 
	Age int
}

func (usr User) printDetails() {
	fmt.Println("Name:", usr.Name)
	fmt.Println("Age:", usr.Age)
}

func main() {
	user1 := User{
		Name: "Ruhin",
		Age: 21,
	}

	user2 := User{
		Name: "Mukim",
		Age: 15,
	}

	user1.printDetails()
	user2.printDetails()
}

