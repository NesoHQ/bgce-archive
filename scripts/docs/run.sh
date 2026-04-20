#!/usr/bin/env bash
set -e

go run scripts/docs/setup.go
bash "$(dirname "$0")/generate_index.sh"
bash "$(dirname "$0")/build.sh"
bash "$(dirname "$0")/serve.sh"
