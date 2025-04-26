package main

import "fmt"

var a = 10

func add(x, y int) {
	z := x + y
	fmt.Println(z)
}

func main() {
	add(5,4)
	add(a,3)
}

func init() {
	fmt.Println("Hello")
}
