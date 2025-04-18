package main

import "fmt"

func main() {
	var x string = "Hello, World!"
	fmt.Println(x)
	// x = 2 // This will cause an error
	var y = "Hello, World!"
	fmt.Println(y)
	// y = 2 // This will cause an error
	one , two := 1, 2
	fmt.Println(one, two)

	var (
		num int
		number int = 1
		greeting string = "Hello, World!"
	)

	fmt.Println(num, number, greeting)
}
