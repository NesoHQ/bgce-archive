#!/usr/bin/env bash

set -e  # Exit on first error

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🔍 Checking if Rust is installed..."

# Install Rust if missing
if ! command_exists rustup; then
    echo "⚙️ Rust not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "✅ Rust is already installed."
fi

# Ensure Cargo is available (comes with Rust)
if ! command_exists cargo; then
    echo "❌ Cargo not found even after Rust install. Please check your environment."
    exit 1
fi

# Install or update mdBook
if ! command_exists mdbook; then
    echo "📥 Installing mdBook..."
    cargo install mdbook
else
    echo "🔄 Updating mdBook..."
    cargo install mdbook --force
fi

# Build the docs
echo "📦 Building the mdBook..."
mdbook build docs

# Serve the docs
echo "📘 Serving the mdBook..."
cd docs && mdbook serve --open