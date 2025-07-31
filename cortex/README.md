# Categories Service — Quick Start Guide

This project uses a Makefile to automate common development tasks. Below is how you can build, run, test, and work with the project.

## Prerequisites

- Go installed (preferably latest stable version)
- Protocol Buffers compiler (`protoc`) installed
- `make` utility available

## Setup and Development

### 1. Prepare the environment

Run the `prepare` command to install necessary dependencies, tools, and tidy the modules:

```bash
make prepare
```

This will install:

- Protobuf code generators (`protoc-gen-go` and `protoc-gen-go-grpc`)
- Development tools like `air` for live reload during development
- Download Go module dependencies
- Tidy your `go.mod`

### 2. Build Protobuf files

Generate Go code from protobuf definitions:

```bash
make build-proto
```

This compiles the `.proto` files located at `./grpc/cortex/cortex.proto` into Go source code.

### 3. Run the server in development mode

Start the project with live reload enabled by running:

```bash
make dev
```

This runs the server command (`./main serve-rest`) managed by `air` for hot-reloading when code changes.

### 4. Seed the database

If you need to seed the database with initial data, run:

```bash
make seed
```

### 5. Build the executable

To build the project binary:

```bash
make build
```

This compiles the source code into an executable named `main`.

### 6. Start the server (production)

Run the compiled binary:

```bash
make start
```

This runs `./main serve-rest`.

### 7. Run tests

To run all tests with verbose output:

```bash
make test
```

---

## Additional commands

- `make tidy` — cleans and verifies module dependencies
- `make install-mockgen` — installs the mockgen tool for generating mocks
- `make install-proto-deps` — installs protobuf compiler plugins
- `make install-dev-deps` — installs development dependencies/tools
- `make install-deps` — downloads Go module dependencies

---

## Summary

Just run:

```bash
make dev
```

and the project should be up and running with live reload for easy development!

---
