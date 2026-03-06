package main

import (
	"axon/cmd"
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: axon [rest|consumer]")
		os.Exit(1)
	}

	switch os.Args[1] {
	case "rest":
		if err := cmd.RunRESTServer(); err != nil {
			fmt.Printf("Server error: %v\n", err)
			os.Exit(1)
		}
	case "consumer":
		if err := cmd.RunConsumer(); err != nil {
			fmt.Printf("Consumer error: %v\n", err)
			os.Exit(1)
		}
	default:
		fmt.Printf("Unknown command: %s\n", os.Args[1])
		os.Exit(1)
	}
}