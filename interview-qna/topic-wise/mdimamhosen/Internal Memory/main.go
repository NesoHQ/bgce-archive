package main

func add(a, b int) int {
	return a + b
}

func main() {
	add := add(1, 2)
	println(add)
}

func init() {
	println("init")
}
