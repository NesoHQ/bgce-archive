package main

import "fmt"

func main() {
	var t int
	fmt.Scan(&t)
	 for t > 0 {
		var n int
		fmt.Scan(&n)
		var val string
		fmt.Scan(&val)
		var numOne int
		for i := range val {
			if( val[i] == '1') {
				numOne++
			}
		}
		
		total := 0

		for i := 0; i < n; i++ {
			if( val[i] == '0') {
				total += (numOne + 1)
			} else {
			 total += (numOne-1)
			}
		}
	 }
}