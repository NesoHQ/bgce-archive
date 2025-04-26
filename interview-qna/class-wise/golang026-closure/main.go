package main

import "fmt"


const a = 10

var p = 100

//Closure
func outer(money int) func() {
	//money := 100
	age := 30

	fmt.Println("Age =",age)

	show := func() {
		money = money + a + p
		fmt.Println(money)
	}

	return show
}

func call() {
	incr1 := outer(100)
	incr1() //money 100, money = 100 + 10 + 100 = 210
	incr1() // money 100, money = 210 + 10 + 100 = 320

	incr2 := outer(100)
	incr2()
	incr2()
}

func main() {
	call()
}

func init() {
	fmt.Println("=== Bank ===")
}

