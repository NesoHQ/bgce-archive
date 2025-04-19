# CCWC (Custom Word Count)

A Go implementation of the Unix/Linux `wc` command that counts bytes, lines, words, and characters in text files.

## Features

- Count bytes in a file (`-c`)
- Count lines in a file (`-l`)
- Count words in a file (`-w`)
- Count characters in a file (`-m`)
- Support for reading from both files and standard input (stdin)
- Default mode that displays line, word, and byte counts together

## Installation

1. Ensure you have Go installed on your system
2. Navigate to the project directory:
```bash
cd /Users/rokib/Developer/go_projects/bgce-archive/mini-projects/ccwc
```
3. Build the project:
```bash
go build -o ccwc ./cmd/ccwc
```

## Usage

### Basic Usage

```bash
./ccwc [options] [filename]
```

If no filename is provided, ccwc reads from standard input.

### Options

- `-c`: Print the byte count
- `-l`: Print the line count
- `-w`: Print the word count
- `-m`: Print the character count (locale-dependent)

If no options are provided, ccwc displays line count, word count, and byte count.

### Examples

1. Count bytes in a file:
```bash
./ccwc -c testdata/test.txt
```

2. Count lines in a file:
```bash
./ccwc -l testdata/test.txt
```

3. Count words in a file:
```bash
./ccwc -w testdata/test.txt
```

4. Count characters in a file:
```bash
./ccwc -m testdata/test.txt
```

5. Default output (lines, words, and bytes):
```bash
./ccwc testdata/test.txt
```

6. Read from standard input:
```bash
echo "Hello, World!" | ./ccwc -w
```

## Project Structure

```
mini-projects/ccwc/
├── cmd/
│   └── ccwc/
│       └── main.go       # Main application entry point
├── internal/
│   └── processor/
│       └── processor.go  # Core processing functions
├── testdata/            # Test files directory
│   └── test.txt
├── go.mod               # Go module file
└── README.md           # This file
```

## Implementation Details

The project is organized into two main components:

1. **Processor Package** (`internal/processor/processor.go`):
   - Contains core counting functions
   - Implements byte, line, word, and character counting logic
   - Uses efficient buffered I/O operations

2. **Main Package** (`cmd/ccwc/main.go`):
   - Handles command-line argument parsing
   - Manages file operations
   - Coordinates counting operations
   - Formats and displays output

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

