package main

import "fmt"

func main() {
	//if
	number := 10
	if number > 5 {
		fmt.Println("Number is greater than 5")
	}

	// if -else
	number1 := 3
	if number1 > 5 {
		fmt.Println("Greater than 5")
	} else {
		fmt.Println("5 or less")
	}

	// if,else if
	age := 18

	if age > 18 {

		fmt.Println("You are eligible to be married")
	} else if age < 18 {
		fmt.Println("You are not eligible to be married, but you can love someone")
	} else if age == 18 {
		fmt.Println("You are just a teenager, not eligible to be married")
	}
	// switch

	day := 3

	switch day {
	case 1:
		fmt.Println("Sunday")
	case 2:
		fmt.Println("Monday")
	case 3:
		fmt.Println("Tuesday")
	default:
		fmt.Println("Another day")
	}
}
