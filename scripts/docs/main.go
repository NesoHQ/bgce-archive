package main

import (
	"fmt"
	"os"
)

func main() {
	// If no command-line arguments provided, run the full workflow
	if len(os.Args) < 2 {
		setup()        // Install/update Rust and mdBook
		generateIndex() // Generate SUMMARY.md from directory structure
		build()        // Build the mdBook
		serve()        // Start the local development server
		return
	}

	switch os.Args[1] {
	case "generate-index":
		generateIndex() // Only generate the index/summary
	case "serve":
		serve() // Only start the development server
	default:
		fmt.Println("Unknown command:", os.Args[1])
		fmt.Println("Usage: app [generate-index|serve]")
		os.Exit(1)
	}
}