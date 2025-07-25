package main

import (
	"fmt"
	"net/http"
)

func CategoryHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		handleGetCategories(w, r)
	case http.MethodPost:
		handleCreateCategory(w, r)
	case http.MethodPut:
		handleUpdateCategory(w, r)
	case http.MethodDelete:
		handleDeleteCategory(w, r)
	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func handleGetCategories(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Listing all categories...")
}

func handleCreateCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Creating a category...")
}

func handleUpdateCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Updating a category...")
}

func handleDeleteCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Deleting a category...")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/categories", CategoryHandler)

	port := ":8080"
	fmt.Println("Categories service is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
