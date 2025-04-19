package main

import (
	"fmt"
	"os"

	"github.com/0xRokib/ccwc/internal/processor"
)


func main(){
	if len(os.Args) < 2 {
		fmt.Println("Usage: ccwc -<option> filename or ccwc filename")
		return
	}
	var option string
	var filename string
	if len(os.Args) == 2{
		option = ""
		filename = os.Args[1]
	}else{
		option = os.Args[1]
		filename = os.Args[2]
	}
	
	file , err := os.Open(filename)
	if err != nil{
		fmt.Println("Error:", err)
		return
	}
	defer file.Close()
	
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

		fmt.Printf("%8d %8d %8d %s\n", lines, words, bytes, filename)
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
		fmt.Printf("%8d %s\n", count, filename)
	case "-l":
		count, err := processor.CountLines(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		fmt.Printf("%8d %s\n", count, filename)

	case "-w":
		count , err := processor.CountWords(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		fmt.Printf("%8d %s\n", count, filename)
	case "-m":
		count, err := processor.CountChars(file)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		fmt.Printf("%8d %s\n", count, filename)

	default:
		fmt.Println("Unknown option:", option)

	}
	
}