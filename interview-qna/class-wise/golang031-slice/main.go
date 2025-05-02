package main

import "fmt"

func main() {
	arr := [6]string{"This", "is", "a", "Go", "interview", "Questions"}
	fmt.Println(arr)

	s := arr[1:4] //making a slice 's' from the array

	//So "s" is a slice
		//ptr(pointer) = index 1
		//length is 3 and capacity is 5
	fmt.Println(s) // [is a Go]

	s1 := s[1:2]
		//len = 3 and cap = 4
	fmt.Println(s1) //[a]

	//to print the len use len()
	//to print the capacity use cap()
	fmt.Println(len(s1))
	fmt.Println(cap(s1))


	s2 := []int{3, 4, 7} //Slice literal

	fmt.Println("slice", s2, "lenght:", len(s2), "capacity:", cap(s2))

	//Another way to make a slice
	//With the make() function

	s3 := make([]int, 3) // slice [0, 0, 0], len = 3, cap = 3

	s3[0] = 5 //slice [5, 0, 0], len = 3, cap = 3

	fmt.Println(s3)

	fmt.Println(len(s3))
	fmt.Println(cap(s3))


	//Yet another way to make a slice declaring both length and capacity
	s4 := make([]int, 3, 5) //[0, 0, 0], len = 3, cap = 5
	s4[0] = 5 //[5, 0, 0], len = 3, cap = 5
	// s4[3] = 10 // [5, 0, 0, 10], len = 4, cap = 5 (but this is wrong)
	fmt.Println(s4)

	fmt.Println(len(s4))
	fmt.Println(cap(s4))

	var s5 []int //empty slice => []
	fmt.Println(s5) //[]

	var s6 []int //another empty slice => []
	s6 = append(s6, 1) //added an element to the empty slice => [1], len = 1, cap = 1
	fmt.Println(s6) // it will print [1]

	var s7 []int //another empty slice => []
	s7 = append(s7, 1, 2, 3) //added 3 elements to the empty slice ==> [1,2,3], len=3, cap=3
	fmt.Println(s7, len(s7), cap(s7))


	//Interview question for slice
	//to understand slice deeply
	var x []int		//[], len=0, cap=0
	x = append(x, 1)//[1], len=1, cap=1
	x = append(x, 2)//[1, 2], len=2, cap=2
	x = append(x, 3)//[1, 2, 3], len=3, cap=4
	
	y := x  		//y is [1, 2, 3], len=3, cap=4
	
	x = append(x, 4)//[1, 2, 3, 4], len=4, cap=4
	y = append(y, 5)//[1, 2, 3, 5], len=4, cap=4, (x is also changed cause x and y both are pointing the same underlying array)
	
	x[0] = 10 		//[10, 2, 3, 5], len=4, cap=4
	
	fmt.Println(x) //[10, 2, 3, 5]
	fmt.Println(y) //[10, 2, 3, 5]



	//Another important interview question
	slc := []int{1, 2, 3, 4, 5}
	slc = append(slc, 6)
	slc = append(slc, 7)

	slcA := slc[4:]

	slcY := changeSlice(slcA)

	fmt.Println(slc) //[1, 2, 3, 4, 10, 6, 7]
	fmt.Println(slcY) //[10, 6, 7, 11]
	fmt.Println(slc[0:8]) //[1, 2, 3, 4, 10, 6, 7, 11]


	//variadic function call
	variadic(2, 3, 4, 6, 8, 10)
}

func changeSlice(a []int) []int {
	a[0] = 10
	a = append(a, 11)
	return a
}

func variadic(numbers ...int) { //variadic function
	fmt.Println(numbers)
	fmt.Println(len(numbers))
	fmt.Println(cap(numbers))
}
