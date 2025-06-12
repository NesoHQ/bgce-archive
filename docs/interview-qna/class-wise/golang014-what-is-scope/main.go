package main

import "fmt"

var (
	a = 20
	b = 30
)

func add(x int, y int) {
	z := x + y
	fmt.Println(z)
}

func main() {
	p := 30
	q := 40

	add(p, q)

	add(a, b)

	add(a, p)

	// add(b, z)
}
