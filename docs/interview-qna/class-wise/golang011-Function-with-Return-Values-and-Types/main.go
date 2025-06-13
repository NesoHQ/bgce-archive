package main

import "fmt"

func add(num1 int, num2 int) int {
	sum := num1 + num2

	fmt.Println(sum)
	return sum
}

func getNumbers(num1 int, num2 int) (int, int) {
	sum := num1 + num2

	mul := num1 * num2

	return sum, mul
}

func main() {
	a := 10
	b := 20

	add(a, b)

	p, q := getNumbers(a, b)
	
	fmt.Println("sum = ", p)
	fmt.Println("mul = ", q)

}
