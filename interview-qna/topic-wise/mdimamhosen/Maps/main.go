package main

import "fmt"

// map is and unordered collection of key-value pairs, that does not allow duplicates keys
func main() {
		userInfo := map[string] int {
			"age": 22,
			"height": 5,
			"weight": 70,
		}


		fmt.Println(userInfo)
		fmt.Println(userInfo["age"])

		for key, value := range userInfo {
			fmt.Println(key, value)
		}
}
