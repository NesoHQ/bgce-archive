package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

// build compiles the mdBook project into static HTML files
// This function runs the 'mdbook build docs' command to generate the final documentation
func build() {
	fmt.Println("📦 Building the mdBook...")

	// Create the mdbook build command
	// This will build the documentation from the 'docs' directory
	cmd := exec.Command("mdbook", "build", "docs")
	
	// Forward the command's output streams to the current process
	// This allows users to see the build progress and any messages from mdbook
	cmd.Stdout = os.Stdout // Forward standard output (build progress, success messages)
	cmd.Stderr = os.Stderr // Forward standard error (warnings, error messages)

	// Execute the build command
	if err := cmd.Run(); err != nil {
		// If the build fails, log the error and exit the program
		log.Fatalf("❌ Failed to build mdBook: %v", err)
	}

	// Confirm successful completion
	fmt.Println("✅ Build complete!")
}