package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}

func runCommand(name string, args ...string) {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("Error running %s: %v", name, err)
	}
}

func main() {
	fmt.Println("🔍 Checking for 🦀Rust, 📦cargo & 📘mdBook...")

	if !commandExists("rustup") {
		fmt.Println("⚙️ Installing Rust...")
		runCommand("sh", "-c", `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`)
	} else {
		fmt.Println("✅ Rust is already installed.")
	}

	if !commandExists("cargo") {
		log.Fatal("❌ Cargo still not found. Check your Rust install.")
	} else {
		runCommand("cargo", "install", "mdbook")
	}
}
