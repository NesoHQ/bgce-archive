package main

import (
	"fmt"
	"os"

	"github.com/0xRokib/ccwc/internal/processor"
)


func main(){
	if len(os.Args) < 3 {
		fmt.Println("Usage: ccwc -c filename")
		return
	}
	option := os.Args[1]
	filename := os.Args[2]

	file , err := os.Open(filename)
	if err != nil{
		fmt.Println("Error:", err)
		return
	}
	defer file.Close()

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

	default:
		fmt.Println("Unknown option:", option)

	}
	
}