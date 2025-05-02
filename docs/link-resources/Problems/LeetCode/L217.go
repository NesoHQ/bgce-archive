package main

import "fmt"

func containsDuplicate(nums []int) bool {
	st := make(map[int]bool)
	for _, i := range nums {
		fmt.Println(st[i])
	}
	return false
}

func main() {
	nums := []int{1, 2, 3, 1}
	result := containsDuplicate(nums)
	fmt.Println(result) // Output: true
}
