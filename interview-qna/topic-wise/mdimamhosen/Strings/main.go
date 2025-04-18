package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println("Hello, World!")
	fmt.Println("Hello, " + "World!")

	// format strings
	message := "Hello World!"
	fmt.Printf("Data: %v\n", message)
	fmt.Printf("Data: %+v\n", message)
	fmt.Printf("Data: %#v\n", message)
	fmt.Printf("Data: %T\n", message)
	fmt.Printf("Data: %q\n", message)
	fmt.Printf("First character: %c\n", message[0])

	fmt.Println("Length:", len(message))
	fmt.Println("Substring:", message[0:5]) // this will print "Hello"

	msg1 :=  "one"
	msg2 := "two"

	fmt.Println("Equal?", msg1 == msg2)
	fmt.Println("Not Equal?", msg1 != msg2)
	fmt.Println(strings.Compare(msg1, msg2))

	mainString := "This is a go lang tutorial for beginners"
	fmt.Println(strings.Contains(mainString, "go"))
}
