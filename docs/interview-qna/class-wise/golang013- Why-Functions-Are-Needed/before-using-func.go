package main

import "fmt"

func main() {
	// Befor using function

	// Print welcome message
	fmt.Println("Welcome to the application")

	// Get user name as input
	var name string
	fmt.Println("Enter your name - ")
	fmt.Scanln(&name)

	var num1 int
	var num2 int
	fmt.Println("Enter first number - ")
	fmt.Scanln(&num1)
	fmt.Println("Enter second number - ")
	fmt.Scanln(&num2)

	sum := num1 + num2

	// display results
	fmt.Println("Hello, ",name)
	fmt.Println("Summation = ",sum)

	// print a goodbye message
	fmt.Println("Thank you for using the application")
	fmt.Println("Goodbye")

}