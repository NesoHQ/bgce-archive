package main

import "fmt"

func add(a int, b int) { //Parameter is a and b 
	c := a + b
	fmt.Println(c)
}

func main() {
	add(2,5) //2 and 5 are argument
	processOperation(4, 5, add)
	sum := call() //function expression
	sum(4,7)
}

/*
1. parameter vs argument
2. First order function
	i. standard function or named function
	ii. anonymous function
	iii. IIFE
	iv. function expression
3. Higher order function or first class function
4. Callback function
5. first class citizen (variable assigning data)


fucntional paradigm -> Haskel, Racket

math logic -> logic (discrete mathematics)
1. first order logic
2. higher order logic

####logic####

1. Object (people, animal, car etc)
2. Property (color, student)
3. Relation


Higher order function
	any of the following
		1. parameter -> function
		2. function return
		3. both
*/

func processOperation(a int, b int, op func(p int, q int)) { //Higher order function
	op(a,b)
}

func call() func(x int, y int) {
	return add
}
