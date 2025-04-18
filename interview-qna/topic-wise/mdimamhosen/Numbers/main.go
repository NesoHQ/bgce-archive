package main

import "fmt"

func main() {
	fmt.Println("1 + 1 =", 1+1)
	fmt.Println("1.0 + 1.0 =", 1.0+1.0)
	fmt.Println("1.0 + 1 =", 1.0+1)
	fmt.Println("1 + 1.0 =", 1+1.0)
	fmt.Println("1 - 1 =", 1-1)
	fmt.Println("1.0 - 1.0 =", 1.0-1.0)
	fmt.Println("1.0 - 1 =", 1.0-1)
	fmt.Println("1 - 1.0 =", 1-1.0)
	fmt.Println("1 * 1 =", 1*1)
	fmt.Println("1.0 * 1.0 =", 1.0*1.0)
	fmt.Println("1.0 * 1 =", 1.0*1)
	fmt.Println("1 * 1.0 =", 1*1.0)
	fmt.Println("1 / 1 =", 1/1)
	fmt.Println("1.0 / 1.0 =", 1.0/1.0)
	fmt.Println("1.0 / 1 =", 1.0/1)
	fmt.Println("1 / 1.0 =", 1/1.0)
	fmt.Println("1 % 1 =", 1%1)
	// fmt.Println("1.0 % 1.0 =", 1.0%1.0) // Invalid: Modulus operator cannot be used with floating-point numbers
	// fmt.Println("1.0 % 1 =", 1.0%1)     // Invalid: Modulus operator cannot be used with floating-point numbers
	// fmt.Println("1 % 1.0 =", 1%1.0)     // Invalid: Modulus operator cannot be used with floating-point numbers
}
