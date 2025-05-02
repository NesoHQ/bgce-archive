#!/usr/bin/env bash
set -e

bash "$(dirname "$0")/setup.sh"
bash "$(dirname "$0")/generate_index.sh"
bash "$(dirname "$0")/build.sh"
bash "$(dirname "$0")/serve.sh"
