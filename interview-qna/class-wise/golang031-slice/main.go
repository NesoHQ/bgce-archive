package main

import "fmt"

/*
   type slice struct {
       ptr  unsafe.Pointer
       len  int
       cap  int
   }
*/

/*
   Slice: A slice is a dynamic, flexible view into an array.
   flexible view -> means slices can resize, reference only part of data and share that data without owning it.
*/

func main() {
	// 1. array to slice
	// slice := arr[start(inclusive):end(exclusive)], len = end - start, cap = total_arr_len - start
	arr := [5]int{1, 2, 3, 4, 5}
	s := arr[1:4] // [2, 3, 4], len = 3, cap = 4
	// fmt.Println(s, len(s), cap(s))

	// 2. slice to slice
	s1 := s[1:3] // [3, 4], len = 2, cap = 3
	fmt.Println(s1, len(s1), cap(s1))

	// 3. slice literals
	s2 := []int{1, 2, 3} // [1, 2, 3], len = 3, cap = 3
	fmt.Println(s2, len(s2), cap(s2))

	// 4. using make()
	//  slice := make([]type, len)
	s3 := make([]int, 3) // [0, 0, 0], len = 3, cap = 3
	fmt.Println(s3, len(s3), cap(s3))

	// slice := make([]type, len, cap)
	s4 := make([]int, 3, 5) // [0, 0, 0], len = 3, cap = 5
	s4[0] = 5               // [5, 0, 0], len = 3, cap = 5
	s4[2] = 10              // [5, 0, 10], len = 3, cap = 5

	// s4[3] = 20 // runtime error: index out of range [3] with length 3.

	// 5. nil slice
	// No memory allocated for the nil slice
	var nilSlice []int // [], ptr = nil, len = 0, cap = 0
	fmt.Println(nilSlice, len(nilSlice), cap(nilSlice))
	fmt.Println("[nil_slice]: Check if it's nil: ", nilSlice == nil) // true

	// 6. empty slice
	// Yes, memory allocated for the empty slice
	emptySlice := []int{} // [], len = 0, cap = 0
	fmt.Println(emptySlice, len(emptySlice), cap(emptySlice))
	fmt.Println("[empty_slice]: Check if it's nil: ", emptySlice == nil) // false

	// using make()
	emptySlice2 := make([]int, 0) // [], len = 0, cap = 0
	fmt.Println(emptySlice2, len(emptySlice2), cap(emptySlice2))
	fmt.Println("[empty_slice]: Check if it's nil: ", emptySlice2 == nil) // false

	appendSlice()
	appendSlice2()

	print(1, 2, 3, 4, 5) // [1, 2, 3, 4, 5], len = 5, cap = 5
}

/*
* Appending elements into slice:
* Slice new underlying array rule => upto 1024 (len == cap == 1024) -> increase by x2 (capacity)
* and above 1024 capacity will be increased by 25% or 0.25
 */

func appendSlice() {
	var x []int // [], ptr = nil, len = 0, cap = 0

	x = append(x, 1) // [1], len = 1, cap = 1
	x = append(x, 2) // [1, 2], len = 2, cap = 2
	x = append(x, 3) // [1, 2, 3], len = 3, cap = 4

	y := x // [1, 2, 3], len = 3, cap = 4 ; new slice (y) created and point to the (x) slice

	x = append(x, 4) // [1, 2, 3, 4], len = 4, cap = 4
	y = append(y, 5) // [1, 2, 3, 5], len = 4, cap = 4

	x[0] = 10

	fmt.Println("x = ", x, len(x), cap(x)) // [10, 2, 3, 5], len = 4, cap = 4
	fmt.Println("y = ", y, len(y), cap(y)) // [10, 2, 3, 5], len = 4, cap = 4
}

func changesSlice(z []int) []int {
	z[0] = 10
	z = append(z, 11) // [10, 6, 7, 11], len = 4, cap = 6

	return z
}

func appendSlice2() {
	x := []int{1, 2, 3, 4, 5} // [1, 2, 3, 4, 5], len = 5, cap = 5

	x = append(x, 6) // [1, 2, 3, 4, 5, 6], len = 6, cap = 10
	x = append(x, 7) // [1, 2, 3, 4, 5, 6, 7], len = 7, cap = 10

	a := x[4:] // [5, 6, 7], len = 3, cap = 6

	y := changesSlice(a) // [10, 6, 7, 11], len = 4, cap = 6

	fmt.Println("x = ", x, len(x), cap(x)) // [1, 2, 3, 4, 10, 6, 7], len = 7, cap = 10
	fmt.Println("y = ", y, len(y), cap(y)) // [10, 6, 7, 11], len = 4, cap = 6

	fmt.Println("x = ", x[0:8], len(x), cap(x)) // [1, 2, 3, 4, 10, 6, 7, 11], len = 7, cap = 10
}

// --------------------- Variadic function ---------------------

/*
Variadic function:
  - A variadic function in Go is a function that accepts a variable number of arguments of the same type.
  - use the ... (ellipsis) syntax before the type to define it.
  - example: func funcName(arg ...type)
*/
func print(numbers ...int) { // numbers := []int{1, 2, 3, 4, 5}
	fmt.Println(numbers, len(numbers), cap(numbers)) // [1, 2, 3, 4, 5], len = 5, cap = 5
}

/*
   Creating slices:
       1. Array to Slice
       2. Slice to Slice
       3. Slice literals
       4. Using make()
           - with len
           - with len and cap
       5. Nil slice (No memory allocated)
       6. Empty slice (Yes, memory allocated)
            - []int{}
            - make([]int, 0)

*/
