# Todo CLI

A simple command-line interface (CLI) application for managing your to-do tasks, built with Go.

## Features

- Add new tasks
- List all tasks (with --all flag for completed tasks)
- Mark tasks as completed
- Delete tasks

## Project Structure

```
todo-cli/
├── cmd/
│   └── tasks/
│       └── main.go
└── internal/
    └── task/
        ├── task.go
        └── storage.go
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OxRokib/bgce-archive.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bgce-archive/mini-projects/todo-cli
   ```
3. Build the application:
   ```bash
   go build -o todo cmd/tasks/main.go
   ```

## Usage

### Add a Task

```bash
./todo add "Your task description"
```

### List Tasks

List incomplete tasks:

```bash
./todo list
```

List all tasks (including completed):

```bash
./todo list --all
```

### Mark a Task as Completed

```bash
./todo complete <task-id>
```

### Delete a Task

```bash
./todo delete <task-id>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
