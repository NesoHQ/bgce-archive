package main

import "fmt"

func main() {
	fmt.Println(true && true)
	fmt.Println(true && false)

	fmt.Println(true || true)
	fmt.Println(false || false)

	fmt.Println(!true)
	fmt.Println(!false)
}
