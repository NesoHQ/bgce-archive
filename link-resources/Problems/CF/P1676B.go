package main

import (
	"fmt"
	"sort"
)

func main() {
	var loop int
	fmt.Scan(&loop)
	for loop > 0 {
		var n int
		fmt.Scan(&n)

		var sum int
		arr := make([]int, n)
		for i := 0; i < n; i++ {
			fmt.Scan(&arr[i])
		}
		sort.Ints(arr)
		for i := 0; i < n; i++ {
			sum += arr[i] - arr[0]
		}
		fmt.Println(sum)
		loop--
	}
}
