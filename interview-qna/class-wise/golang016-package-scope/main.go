/*
package main

var (
	a = 20
	b = 30
)

func main() {
	add(4,7)
}
*/

package main

import (
	"fmt"
	"example.com/mathlib"
)

var (
	a = 20
	b = 30
)

func main() {
	fmt.Println("Showing Custom Package")
	mathlib.Add(4,7)
}
