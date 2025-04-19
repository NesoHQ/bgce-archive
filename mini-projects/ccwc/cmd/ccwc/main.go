package main

import (
	"fmt"
	"os"

	"github.com/0xRokib/ccwc/internal/processor"
)

func printOutput(count int, filename string) {
	if filename != "" {
		fmt.Printf("%8d %s\n", count, filename)
	} else {
		fmt.Printf("%8d\n", count)
	}
}

func printUsage() {
	fmt.Println("Usage: ccwc [options] [filename]")
	fmt.Println("Options:")
	fmt.Println("  -c    Print byte count")
	fmt.Println("  -l    Print line count")
	fmt.Println("  -w    Print word count")
	fmt.Println("  -m    Print character count (locale-dependent)")
	fmt.Println("\nIf no options are provided, the default behavior will print:")
	fmt.Println("  line count, word count, and byte count.")
}



func main(){
	var option string
	var filename string
	var file *os.File
	var err error

	args := os.Args

	if len(args) == 1 {
		option = ""
		filename = ""
		file = os.Stdin
		printUsage()
		return
	} else if len(args) == 2 {
		if args[1][0] == '-' {
			option = args[1]
			filename = ""
			file = os.Stdin
		} else {
			option = ""
			filename = args[1]
		}
	} else if len(args) >= 3 {
		option = args[1]
		filename = args[2]
	}
	
	if filename != "" {
		file, err = os.Open(filename)
		if err != nil {
			fmt.Printf("Error: Unable to open file '%s'. %v\n", filename, err)
			return
		}
		defer file.Close()
	}
	
	// Default Mode: No option passed
	if option != "-c" && option != "-l" && option != "-w" && option != "-m" {
		lines, err := processor.CountLines(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		file.Seek(0, 0)

		words, err := processor.CountWords(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		file.Seek(0, 0)

		bytes, err := processor.CountBytes(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		if filename != "" {
			fmt.Printf("%8d %8d %8d %s\n", lines, words, bytes, filename)
		} else {
			fmt.Printf("%8d %8d %8d\n", lines, words, bytes)
		}
		return
	}


	// If an option is passed
	switch option{
	case "-c":
		count , err := processor.CountBytes(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		printOutput(count, filename)
	case "-l":
		count, err := processor.CountLines(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		printOutput(count, filename)

	case "-w":
		count , err := processor.CountWords(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		printOutput(count, filename)
	case "-m":
		count, err := processor.CountChars(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		printOutput(count, filename)

	default:
		fmt.Println("Unknown option:", option)
		printUsage()
	}
	
}