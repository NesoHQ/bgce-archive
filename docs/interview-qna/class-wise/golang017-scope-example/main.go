package main

import "fmt"

var (
	a = 10
	b = 20
)

func printNum(num int) {
	fmt.Println(num)
}

func add(x int, y int) {
	res := x + y
	printNum(res)
}

func main() {
	add(a, b)
}
