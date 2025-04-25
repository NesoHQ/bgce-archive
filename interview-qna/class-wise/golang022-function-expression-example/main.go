package main

import "fmt"

//Global function expression
var add = func(x,y int) {
	fmt.Println(x + y)
}

func main() {
	add(4, 7)
	//Function expression or Assign function in variable
	add := func(a int, b int) {
		c := a + b
		fmt.Println(c)
	}

	add(2,3)
}

func init() {
	fmt.Println("I will be called first")
}
