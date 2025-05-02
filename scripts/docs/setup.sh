#!/usr/bin/env bash
set -e

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🔍 Checking for Rust + mdBook..."

if ! command_exists rustup; then
    echo "⚙️ Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "✅ Rust is already installed."
fi

if ! command_exists cargo; then
    echo "❌ Cargo still not found. Check your Rust install."
    exit 1
fi

if ! command_exists mdbook; then
    echo "📥 Installing mdBook..."
    cargo install mdbook
else
    echo "🔄 Updating mdBook..."
    cargo install mdbook --force
fi