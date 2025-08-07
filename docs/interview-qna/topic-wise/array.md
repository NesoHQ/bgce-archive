[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-19
**Category:** interview-qa/arrays
**Tags:** [go, arrays, functions]
]

# Go তে Array

## Array declare করা

Go-তে নিচের syntax ব্যবহার করে array declare করা যায়:

```go
var arrayName [size]elementType
```

উদাহরণ:

```go
var numbers [5]int
```

## Arrays  initialize করা

Array declare করার সময় Array initialize করা যেতে পারে:

```go
var numbers = [5]int{1, 2, 3, 4, 5}
```

অথবা short-hand notation ব্যবহার করতে পারেন:

```go
numbers := [5]int{1, 2, 3, 4, 5}
```

## Array element access করা

Array এর element index ব্যবহার করে access করা যায়, যেটি 0 থেকে শুরু হয়:

```go
fmt.Println(numbers[0]) // Output: 1
```

## Array তে loop run করা

`for` loop ব্যবহার করে Array উপর loop run করা যায়:

```go
for i := 0; i < len(numbers); i++ {
    fmt.Println(numbers[i])
}
```

অথবা `range` keyword ব্যবহার করতে পারেন:

```go
for index, value := range numbers {
    fmt.Println(index, value)
}
```

## Multidimensional Arrays

Go multidimensional array সাপোর্ট করে। একটি two-dimensional array নিচেরভাবে declare করা হয়:

```go
var matrix [3][3]int
```

উদাহরণ:

```go
matrix := [3][3]int{
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
}
```

## Array of Arrays

array of arrays হলো এমন একটি data structure, যেখানে একটি array প্রতিটি element আরেকটি array বা slice। এটি সাধারণত variable সাইজের 2D data রাখার জন্য ব্যবহৃত হয়, যেমন প্রতিটি row তে ভিন্ন ভিন্ন element থাকতে পারে।


উদাহরণ:

```go
arrayOfArrays := [][]int{
    {1, 2},
    {3, 4, 5},
    {6},
}
```

## ফাংশনে Arrays পাঠানো

Go-তে array ফাংশনে পাঠানো হয় value হিসেবে, অর্থাৎ ফাংশনটি array এর একটি copy পায়:

```go
func printArray(arr [5]int) {
    for i := 0; i < len(arr); i++ {
        fmt.Println(arr[i])
    }
}
```

মূল array পরিবর্তন করতে হলে, আপনাকে array এর pointer পাঠাতে হবে:

```go
func modifyArray(arr *[5]int) {
    arr[0] = 100
}
```

## Frequently Asked Questions

### Q1: Go-তে কিভাবে array এর দৈর্ঘ্য নির্ধারণ করব?

array এর  দৈর্ঘ্য নির্ধারণ করতে len() built-in function ব্যবহার করুন।

উদাহরণ:

```go
package main

import "fmt"

func main() {
    arr := [5]int{1, 2, 3, 4, 5}
    fmt.Println("Length of the array:", len(arr)) // Output: 5
}
```

### Q2: Go-তে কিভাবে একটি array copy করব?

Go-তে array copy করার জন্য আপনি সেটিকে একই type এবং size এর অন্য array তে assign করতে পারেন।

উদাহরণ:

```go
package main

import "fmt"

func main() {
    original := [3]int{1, 2, 3}
    copy := original
    fmt.Println("Original:", original) // Output: [1 2 3]
    fmt.Println("Copy:", copy)         // Output: [1 2 3]
}
```

### Q3: কিভাবে copy না করে function এ array পাঠিয়ে সেটিকে পরিবর্তন করা যায়?

copy না করে পরিবর্তন করতে চাইলে array এর pointer পাঠান।

উদাহরণ:

```go
package main

import "fmt"

func modifyArray(arr *[3]int) {
    arr[0] = 42
}

func main() {
    arr := [3]int{1, 2, 3}
    modifyArray(&arr)
    fmt.Println("Modified array:", arr) // Output: [42 2 3]
}
```

### test করার জন্য উদাহরণ: main.go

```go
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



```
