package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

// commandExists checks if a command is available in the system's PATH
// Returns true if the command can be found, false otherwise
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}

// runCommand executes a shell command with the given arguments
// It forwards stdout and stderr to the current process and exits on error
func runCommand(name string, args ...string) {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout // Forward command output to current stdout
	cmd.Stderr = os.Stderr // Forward command errors to current stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("Error running %s: %v", name, err)
	}
}

// getInstalledMdbookVersion retrieves the currently installed mdbook version
// Returns the version string without the 'v' prefix, or an error if not found
func getInstalledMdbookVersion() (string, error) {
	out, err := exec.Command("mdbook", "--version").Output()
	if err != nil {
		return "", err
	}
	
	// Parse output like "mdbook v0.4.28" to extract "0.4.28"
	parts := strings.Fields(string(out))
	if len(parts) >= 2 {
		return strings.TrimPrefix(parts[1], "v"), nil
	}
	return "", fmt.Errorf("unexpected mdbook version output: %s", out)
}

// getLatestMdbookVersion queries crates.io to find the latest mdbook version
// Uses 'cargo search mdbook' and parses the output to extract version number
func getLatestMdbookVersion() (string, error) {
	out, err := exec.Command("cargo", "search", "mdbook").Output()
	if err != nil {
		return "", err
	}
	
	// Parse output like: mdbook = "0.4.28" #...
	lines := strings.Split(string(out), "\n")
	if len(lines) == 0 {
		return "", fmt.Errorf("cargo search output empty")
	}
	
	// Extract version from the first line between quotes
	line := lines[0]
	start := strings.Index(line, `"`)
	end := strings.LastIndex(line, `"`)
	if start >= 0 && end > start {
		return line[start+1 : end], nil
	}
	return "", fmt.Errorf("failed to parse latest mdbook version from cargo search output")
}

// isLatestVersion compares installed and latest versions using simple string comparison
// Returns true if the versions match exactly
func isLatestVersion(installed, latest string) bool {
	return installed == latest
}

// setup ensures that Rust and mdBook are installed and up-to-date
// It installs Rust if missing, then installs or updates mdBook as needed
func setup() {
	fmt.Println("🔍 Checking for Rust + mdBook...")

	// Check if Rust is installed via rustup
	if !commandExists("rustup") {
		fmt.Println("⚙️ Installing Rust...")
		// Install Rust using the official installer script
		runCommand("sh", "-c", `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`)
		// Note: The cargo environment may not be loaded in the current process
	} else {
		fmt.Println("✅ Rust is already installed.")
	}

	// Verify cargo is available (Rust's package manager)
	if !commandExists("cargo") {
		log.Fatal("❌ Cargo still not found. Check your Rust install.")
	}

	// Check if mdBook is already installed
	if !commandExists("mdbook") {
		fmt.Println("📥 Installing mdBook...")
		runCommand("cargo", "install", "mdbook")
		return
	}

	// Get currently installed mdBook version
	installedVer, err := getInstalledMdbookVersion()
	if err != nil {
		fmt.Println("⚠️ Could not get installed mdbook version, proceeding to install...")
		runCommand("cargo", "install", "mdbook", "--force")
		return
	}

	// Get latest available mdBook version from crates.io
	latestVer, err := getLatestMdbookVersion()
	if err != nil {
		fmt.Println("⚠️ Could not get latest mdbook version, proceeding to update...")
		runCommand("cargo", "install", "mdbook", "--force")
		return
	}

	// Compare versions and update if necessary
	if isLatestVersion(installedVer, latestVer) {
		fmt.Printf("✅ mdBook is up-to-date (version %s)\n", installedVer)
	} else {
		fmt.Printf("🔄 Updating mdBook from %s to %s...\n", installedVer, latestVer)
		runCommand("cargo", "install", "mdbook", "--force")
	}
}