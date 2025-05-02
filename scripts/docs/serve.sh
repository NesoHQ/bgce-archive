#!/usr/bin/env bash
set -e

cd docs
echo "📘 Serving mdBook on localhost..."
mdbook serve --open