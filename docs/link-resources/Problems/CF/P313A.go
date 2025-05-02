package main

import (
	"fmt"
)

func main() {
	var n int
	fmt.Scan(&n)

	lastRmv := n / 10
	secondLastRmv := n/100*10 + n%10

	fmt.Print(max(n, lastRmv, secondLastRmv))
}
