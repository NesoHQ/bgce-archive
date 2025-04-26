package main

import (
	"fmt"
	"strconv"
)

func findNumbers(nums []int) int {
	count := 0
	for i := 0; i < len(nums); i++ {
		if len(strconv.Itoa(nums[i]))%2 == 0 {
			fmt.Println(strconv.Itoa(nums[i]))
			count++
		}
	}
	return count
}

func main() {
	nums := []int{12, 345, 2, 6, 7896}
	result := findNumbers(nums)
	fmt.Println(result) // Output: 2
}
