package main

import "fmt"

func main() {
	slice1 := []int{1, 2, 3, 4, 5}
	fmt.Println(slice1)
	fmt.Println(slice1[:])
	println(slice1[0])
	println(cap(slice1))
	println(len(slice1))
	slice2 := append(slice1, 6)
	fmt.Println(slice2)
	fmt.Println(slice1[3:5])

	// Using make to create a slice

	slice3 := make([]int, 5, 10)
	// Here 5 is the length of the slice and 10 is the capacity of the slice
	// Difference between length and capacity is that length is the number of elements in the slice and capacity is the number of elements that the slice can hold
	fmt.Println(slice3)

	slice3 = append(slice3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
	fmt.Println(slice3)
	slice3 = append(slice3, 11)
	fmt.Println(slice3)
	// Here the capacity of the slice is doubled when the number of elements in the slice exceeds the capacity of the slice

	for i := 0; i < len(slice3); i++ {
		fmt.Println(slice3[i])
	}

	for index, value := range slice3{
		fmt.Println(index, value)
	}
}
