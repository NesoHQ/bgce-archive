package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

// serve starts the mdBook development server for local testing and development
// It changes to the docs directory and runs 'mdbook serve --open' to start a local web server
func serve() {
	// Step 1: Change the current working directory to "docs"
	// This is necessary because mdbook serve needs to run from the book's root directory
	err := os.Chdir("docs")
	if err != nil {
		log.Fatalf("Failed to change directory: %v", err)
	}

	// Step 2: Inform the user that the server is starting
	fmt.Println("📘 Serving mdBook on localhost...")

	// Step 3: Create and configure the mdbook serve command
	// The --open flag automatically opens the documentation in the default web browser
	cmd := exec.Command("mdbook", "serve", "--open")
	
	// Forward all I/O streams to maintain interactive behavior
	cmd.Stdout = os.Stdout // Forward output (server status, access logs)
	cmd.Stderr = os.Stderr // Forward errors (server errors, warnings)
	cmd.Stdin = os.Stdin   // Allow user input (for stopping the server with Ctrl+C)

	// Execute the serve command
	// This will start the development server and block until the user stops it
	if err := cmd.Run(); err != nil {
		log.Fatalf("Error running mdbook serve: %v", err)
	}
}