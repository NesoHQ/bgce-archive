package main

import "fmt"

func main() {
	arr1 := [5]int{1, 2, 3, 4, 5}
	arr2 := [5]int{1, 2, 3, 4, 5}

	fmt.Println(arr1)
	fmt.Println(arr2)

	var arr3 [5]int
	// fmt.Println(arr3) // this should print [0 0 0 0 0]
	// println("Length:", len(arr3))

	for i := 0; i < len(arr3); i++ {
	    fmt.Scan(&arr3[i])
	}
	fmt.Println(arr3)

	strArr := [3]string{"one", "two", "three"}

	for i := 0; i < len(strArr); i++ {
		fmt.Print(strArr[i]+ "")
	}


}


