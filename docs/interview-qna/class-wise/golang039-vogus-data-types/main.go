package main

import "fmt"

func main() {
	var a int8 = -128
	var b int8 = 127

	var x uint8 = 255

	var j float32 = 10.23343
	var k float64 = 10.4455

	var flag bool = true

	var s string = "The sky is beautiful"

	r := '❤'

	fmt.Printf("%c\n", r)
	fmt.Printf("%d\n", a)
	fmt.Printf("%.2f\n", j)
	fmt.Printf("%v\n", flag)
	fmt.Printf("%s\n", s)

	fmt.Printf("** Type of variable flag = %T\n", flag)

	fmt.Println(a, b, x, j, k, flag)
}
