package main

import "fmt"

func add(num1 int, num2 int){
	sum := num1 + num2

	fmt.Println(sum)
}

func main() {
	a := 10
	b := 20

	add(a, b)
}
