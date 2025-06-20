package main

import (
	"fmt"
	"time"
)

var a = 10

const p = 11

func add(a, b int) {
	fmt.Println(a + b)
}

func printHello(num int) {
	time.Sleep(5 * time.Second)
	fmt.Println("Hello Habib", num)
	add(2, 4)
}

func main() {
	var x int = 10

	fmt.Println("Hello", x)

	go printHello(1)

	go printHello(2)

	go printHello(3)

	go printHello(4)

	go printHello(5)

	fmt.Println(a, " ", p)

	time.Sleep(5 * time.Second)

	fmt.Println("Ha ha")
}
