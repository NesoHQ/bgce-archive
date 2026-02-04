# GitHub Configuration

This directory contains all GitHub-specific configurations for the BGCE Archive project.

## Directory Structure

```
.github/
├── actions/                    # Custom reusable actions
│   ├── cargo-mdbook-cache/    # Cache Cargo and install mdBook
│   ├── docker-login/          # Login to Docker registries
│   ├── docker-metadata/       # Extract Docker metadata
│   ├── go-cache/              # Cache Go modules
│   ├── node-setup/            # Setup Node.js with Yarn
│   └── README.md              # Actions documentation
│
├── workflows/                  # CI/CD workflows
│   ├── build-and-push.yml     # Main orchestrator
│   ├── commit-lint.yml        # Commit message validation
│   ├── docker-build.yml       # Reusable: Docker build
│   ├── docs.yml               # Documentation build
│   ├── go-tests.yml           # Go testing
│   ├── type-check.yml         # Reusable: TypeScript check
│   ├── update-k8s.yml         # Reusable: K8s deployment
│   └── README.md              # Workflows documentation
│
└── ISSUE_TEMPLATE/            # Issue templates
    ├── bug_report.md
    ├── feature_request.md
    └── custom.md
```

## Quick Links

- 📖 [Workflows Documentation](./workflows/README.md)
- 🔧 [Actions Documentation](./actions/README.md)
- 🚀 [View Workflow Runs](https://github.com/nesohq/bgce-archive/actions)

## Key Concepts

### Workflows vs Actions

| Feature | Workflows | Actions |
|---------|-----------|---------|
| **Location** | `.github/workflows/` | `.github/actions/` |
| **File** | `*.yml` | `action.yml` |
| **Purpose** | Complete CI/CD pipelines | Reusable step components |
| **Triggered by** | Events (push, PR, etc.) | Used in workflow steps |
| **Contains** | Jobs with multiple steps | 1-3 focused steps |
| **Example** | `build-and-push.yml` | `docker-login` |

### When to Use Each

**Use Workflows when:**
- You need a complete job with multiple steps
- You want to trigger it as a separate job
- You need matrix strategies
- Example: Building Docker images for multiple services

**Use Actions when:**
- You have 1-3 steps that repeat often
- You want to use it within a job step
- You need simple, focused functionality
- Example: Setting up Node.js with caching

## CI/CD Pipeline Overview

```
┌─────────────────────────────────────────────────────────┐
│  Push to master/main or create PR                       │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  detect-changes: Which services changed?                │
│  ✓ archive-admin  ✓ archive-client  ✓ cortex  ✓ postal │
└─────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Type Check   │  │ Docker Build │  │ K8s Deploy   │
│ (TS only)    │  │ (All svcs)   │  │ (Disabled)   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        ▼                ▼                ▼
    ✅ Pass         🐳 Images        📝 Status
                    Pushed           Message
```

## Services

The pipeline handles these services:

| Service | Language | Type | Port |
|---------|----------|------|------|
| **archive-admin** | Vue 3 + TypeScript | Frontend Admin Panel | 5173 |
| **archive-client** | Next.js + TypeScript | Public Frontend | 3000 |
| **cortex** | Go | Backend API (Categories) | 8080 |
| **postal** | Go | Backend API (Posts) | 8081 |

## Getting Started

### Running Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run a workflow
act push

# Run specific job
act -j build-and-push

# List available workflows
act -l
```

### Creating a New Workflow

1. Create `.github/workflows/my-workflow.yml`
2. Define triggers and jobs
3. Use existing actions for common tasks
4. Test locally with `act`
5. Commit and push

### Creating a New Action

1. Create `.github/actions/my-action/action.yml`
2. Define inputs, outputs, and steps
3. Use in workflows with `uses: ./.github/actions/my-action`
4. Document in `.github/actions/README.md`

## Environment Variables

Common environment variables used across workflows:

```yaml
env:
  REGISTRY_GHCR: ghcr.io
  IMAGE_PREFIX: nesohq/bgce-archive
  NODE_VERSION: '20'
  GO_VERSION: '1.23'
```

## Secrets Required

| Secret | Purpose | Required |
|--------|---------|----------|
| `GITHUB_TOKEN` | Push to GHCR | ✅ Auto-provided |
| `INFRA_REPO_TOKEN` | Update K8s manifests | ⏳ When K8s enabled |
| `DOCKERHUB_USERNAME` | Docker Hub push | ❌ Optional |
| `DOCKERHUB_TOKEN` | Docker Hub push | ❌ Optional |

## Monitoring & Debugging

### View Workflow Runs
- Go to **Actions** tab in GitHub
- Click on a workflow to see runs
- Click on a run to see job details
- Click on a job to see step logs

### Common Issues

**❌ Workflow not triggering:**
- Check file is in `.github/workflows/`
- Verify YAML syntax is valid
- Check trigger conditions match

**❌ Action not found:**
- Ensure path is correct: `./.github/actions/name`
- Check `action.yml` exists in action directory
- Verify action name matches directory name

**❌ Permission denied:**
- Check workflow has required permissions
- Verify secrets are configured
- Ensure token has correct scopes

## Best Practices

✅ Use reusable workflows for complete jobs
✅ Use custom actions for repeated steps
✅ Keep workflows focused and modular
✅ Add clear descriptions and comments
✅ Use emojis for easy log scanning 🎯
✅ Cache dependencies for faster builds
✅ Use matrix strategies for multiple services
✅ Add summaries for better visibility

## Contributing

When adding new workflows or actions:

1. Follow existing naming conventions
2. Add documentation to README files
3. Test locally with `act` if possible
4. Add clear descriptions and comments
5. Update this README if needed

---

**Need help?** Check the documentation:
- [Workflows README](./workflows/README.md)
- [Actions README](./actions/README.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
