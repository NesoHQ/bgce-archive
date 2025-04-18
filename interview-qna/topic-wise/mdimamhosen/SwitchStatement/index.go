package main

import "fmt"

func main() {
	num := 1000

	switch {
	case (num > 5):
		fmt.Println("number is greater then 5")
	case (num < 5):
		fmt.Println("number is less then 5")
	case (num == 5):
		fmt.Println("number is equal to 5")
	}

	day := "friday"

	switch {
	case (day == "monday"):
		fmt.Println("Today is monday")
	case (day == "tuesday"):
		fmt.Println("Today is tuesday")
	case (day == "wednesday"):
		fmt.Println("Today is wednesday")
	case (day == "friday"):
		fmt.Println("Today is friday")
	case (day == "saturday"):
		fmt.Println("Today is saturday")
	case (day == "sunday"):
		fmt.Println("Today is sunday")
	default:
		fmt.Println("Don't know what day is today!")
	}
}
