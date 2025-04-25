
/*
//first example
package main

import "fmt"

func main() {
	fmt.Println("Hello Init Function!")
}

func init() {
	fmt.Println("I am the function that is executed first")
}
*/

//Second example
package main

import "fmt"

var a = 10

func main() {
	fmt.Println(a)
}

func init() {
	fmt.Println(a)
	a = 20
}

