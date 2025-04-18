package main

import "fmt"

func main() {
	// if (true) {<code>}
	// else if (true) {<code>}
	// else {<code>}

	num := 5

	if num > 5 {
		fmt.Println("number is greater then five ")
	} else if num < 5 {
		fmt.Println("number is less then five")
	} else {
		fmt.Println("number is equal to five")
	}

	password := "12345678"
	if len(password) > 7 {
		fmt.Println("Valid Password")
	} else if password == "" {
		fmt.Println("Please provide a password")
	} else {
		fmt.Println("Invalid Password")
	}
}
