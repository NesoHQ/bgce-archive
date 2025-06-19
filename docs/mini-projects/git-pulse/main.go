package main

import "fmt"

func main() {
	err := RunCLI()
	if err != nil {
		fmt.Println("Error:", err)
	}
}