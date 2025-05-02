package main

import "fmt"

func add(x, y int) int {
	res := x + y

	return res
}

func main() {
	x := 10

	res := add(x, 10)
	fmt.Println(res)
}
