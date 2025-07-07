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

func updateCategoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, update category")
}

func deleteCategoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, delete category")
}

func renameCategoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, rename category")
}


func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", helloHandler)
	mux.HandleFunc("/createCategory", createCategoryHandler)
	mux.HandleFunc("/updateCategory", updateCategoryHandler)
	mux.HandleFunc("/deleteCategory", deleteCategoryHandler)
	mux.HandleFunc("/renameCategory", renameCategoryHandler)

	port := ":8080"
	fmt.Println("Server is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
