package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World with ServeMux!")
}

func createCategoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, create category")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", helloHandler)
	mux.HandleFunc("/category", createCategoryHandler)

	port := ":8080"
	fmt.Println("Server is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
