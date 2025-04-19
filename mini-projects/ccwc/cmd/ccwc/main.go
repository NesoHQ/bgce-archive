package main

import (
	"fmt"
	"os"
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
	case "c":
		

	default:
		fmt.Println("Unknown option:", option)

	}
	

}