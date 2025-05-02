//Anonymous function
//IIFE - immediately invoke function expression

package main

import "fmt"

func main() {
	//anonymous function
	func(a int, b int) {
		c := a + b
		fmt.Println(c)
	}(5,7) //IIFE
}


func init() {
	fmt.Println("I'll be called first")
}

