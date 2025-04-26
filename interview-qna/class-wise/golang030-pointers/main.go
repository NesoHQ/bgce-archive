package main

import "fmt"

func print(numbers [3]int) {
	fmt.Println(numbers)
}

func print2(numbers *[3]int) {
	fmt.Println(numbers)
}

type User struct {
	Name string
	Age int
	Salary float64
}

func main() {
	//pointer or address of memory (ram)
	x := 20

	p := &x //ampersand => & => Address of

	*p = 30 //same as x = 30
	
	fmt.Println(x)
	fmt.Println("Address:", p) //p is the address of x
	fmt.Println("Value at the address:", *p) // * => value at address

	arr := [3]int{1, 2, 3}
	print(arr) //pass by value
	print2(&arr) //pass by reference

	user1 := User{
		Name: "Ruhin",
		Age: 21,
		Salary: 0,
	}
	fmt.Println(user1)
}
