package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/Delta456/box-cli-maker/v2"
	"github.com/fatih/color"
)

func main() {
	box := box.New(box.Config{Px: 2, Py: 1, Type: "Double", Color: "Cyan", TitlePos: "Top"})
	box.Print("UNIT CONVERTER", "Convert Meters ⇌ Feet | Celsius ⇌ Fahrenheit | Kilograms ⇌ Pounds")

	for {
		color.New(color.FgGreen, color.Bold).Println("\nSelect conversion type:")
		fmt.Println("1. Meters to Feet")
		fmt.Println("2. Feet to Meters")
		fmt.Println("3. Celsius to Fahrenheit")
		fmt.Println("4. Fahrenheit to Celsius")
		fmt.Println("5. Kilograms to Pounds")
		fmt.Println("6. Pounds to Kilograms")
		fmt.Println("0. Exit")

		color.New(color.FgYellow).Print("Enter option: ")
		var choice int
		fmt.Scanln(&choice)

		if choice == 0 {
			color.New(color.FgHiMagenta).Println("Goodbye! 🌟")
			os.Exit(0)
		}

		color.New(color.FgCyan).Print("Enter value: ")
		var input string
		fmt.Scanln(&input)
		val, err := strconv.ParseFloat(input, 64)
		if err != nil {
			color.Red("Invalid input! Please enter a numeric value.")
			continue
		}

		switch choice {
		case 1:
			fmt.Printf("%.2f meters = %.2f feet\n", val, val*3.28084)
		case 2:
			fmt.Printf("%.2f feet = %.2f meters\n", val, val/3.28084)
		case 3:
			fmt.Printf("%.2f °C = %.2f °F\n", val, val*9/5+32)
		case 4:
			fmt.Printf("%.2f °F = %.2f °C\n", val, (val-32)*5/9)
		case 5:
			fmt.Printf("%.2f kg = %.2f lbs\n", val, val*2.20462)
		case 6:
			fmt.Printf("%.2f lbs = %.2f kg\n", val, val/2.20462)
		default:
			color.Red("Invalid option! Please select between 0 and 6.")
		}
	}
}
