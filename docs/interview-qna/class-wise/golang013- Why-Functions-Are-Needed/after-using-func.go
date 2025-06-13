package main

import "fmt"

func printWelcomeMessage() {
	fmt.Println("Welcome to the application")
}

func getUserName() string {
	var name string
	fmt.Println("Enter your name - ")
	fmt.Scanln(&name)
	return name
}

func getTowNumbers() (int, int) {
	var num1 int
	var num2 int
	fmt.Println("Enter first number - ")
	fmt.Scanln(&num1)
	fmt.Println("Enter second number - ")
	fmt.Scanln(&num2)
	return num1, num2
}

func add(num1 int, num2 int) int {
	sum := num1 + num2
	return sum
}

func display(name string, sum int) {
	fmt.Println("Hello, ", name)
	fmt.Println("Summation = ", sum)
}

func printGoodByeMessage() {
	fmt.Println("Thank you for using the application")
	fmt.Println("Goodbye")
}

func main() {
	printWelcomeMessage()
	name := getUserName()
	num1, num2 := getTowNumbers()
	sum := add(num1, num2)
	display(name, sum)

}
