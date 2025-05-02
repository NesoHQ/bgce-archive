package main

import "fmt"

var arr2 = [3]string{"I", "love", "you"}

func main() {
	//var arr [2]int
	//fmt.Println(arr) #it would print [0, 0] as no value was assigned and by deafult go sets it to 0

	//arr[1] = 6
	//arr[0] = 3

	//short way declaration
	arr := [2]int{3,6}
	fmt.Println(arr)
	fmt.Println(arr2)
	fmt.Println(arr2[1])
}
