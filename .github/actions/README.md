# Custom GitHub Actions

This directory contains reusable composite actions for the BGCE Archive project.

## Available Actions

### 🐳 docker-login
Login to Docker registries (GHCR and optionally Docker Hub).

**Usage:**
```yaml
- uses: ./.github/actions/docker-login
  with:
    ghcr-token: ${{ secrets.GITHUB_TOKEN }}
    ghcr-username: ${{ github.actor }}
    # Optional: Docker Hub
    dockerhub-username: ${{ secrets.DOCKERHUB_USERNAME }}
    dockerhub-token: ${{ secrets.DOCKERHUB_TOKEN }}
```

**Inputs:**
- `ghcr-token` (required): GitHub token for GHCR
- `ghcr-username` (required): GitHub username
- `dockerhub-username` (optional): Docker Hub username
- `dockerhub-token` (optional): Docker Hub token

---

### 🏷️ docker-metadata
Extract Docker image metadata and generate tags.

**Usage:**
```yaml
- uses: ./.github/actions/docker-metadata
  id: meta
  with:
    service: cortex
    registry: ghcr.io
    image-prefix: nesohq/bgce-archive
```

**Inputs:**
- `service` (required): Service name
- `registry` (optional): Container registry (default: `ghcr.io`)
- `image-prefix` (optional): Image name prefix (default: `nesohq/bgce-archive`)

**Outputs:**
- `tags`: Generated Docker tags
- `labels`: Generated Docker labels

---

### 📦 node-setup
Setup Node.js with Yarn caching for faster installs.

**Usage:**
```yaml
- uses: ./.github/actions/node-setup
  with:
    working-directory: archive-admin
    node-version: '20'
    install-dependencies: 'true'
```

**Inputs:**
- `working-directory` (required): Directory containing package.json
- `node-version` (optional): Node.js version (default: `20`)
- `install-dependencies` (optional): Install deps (default: `true`)

---

### ♻️ go-cache
Cache Go modules and build artifacts.

**Usage:**
```yaml
- uses: ./.github/actions/go-cache
  with:
    modulePath: cortex
```

**Inputs:**
- `modulePath` (required): Relative path to go.sum file

---

### 📚 cargo-mdbook-cache
Cache Cargo binaries and install mdBook if needed.

**Usage:**
```yaml
- uses: ./.github/actions/cargo-mdbook-cache
```

**Inputs:** None

---

## Creating New Actions

To create a new composite action:

1. Create a new directory: `.github/actions/my-action/`
2. Add `action.yml` with this structure:

```yaml
name: "My Action"
description: "What it does"

inputs:
  my-input:
    description: "Input description"
    required: true

outputs:
  my-output:
    description: "Output description"
    value: ${{ steps.step-id.outputs.value }}

runs:
  using: "composite"
  steps:
    - name: Do something
      shell: bash
      run: echo "Hello"
```

3. Use it in workflows:
```yaml
- uses: ./.github/actions/my-action
  with:
    my-input: value
```

## Best Practices

✅ **Use actions for**: Repeated 1-3 step sequences
✅ **Use reusable workflows for**: Complete jobs with multiple steps
✅ **Keep actions focused**: One clear responsibility per action
✅ **Document inputs/outputs**: Clear descriptions help users
✅ **Add emojis**: Makes logs easier to scan 🎯
