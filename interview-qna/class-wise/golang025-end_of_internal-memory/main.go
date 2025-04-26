package main

import "fmt"

const a = 10 //constant
var p = 100

func call() {
	add := func (x int, y int) {
		z := x + y
		fmt.Println(z)
	}

	add(5, 6)
	add(p, a)
}

func main() {
	call()
	fmt.Println(a)
}

func init() {
	fmt.Println("Hello")
}

/*
2 Phase:
	1. Compilation phase
	2. Execution phase
*/
