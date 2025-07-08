package main

import (
	"fmt"
	"net/http"
	"server/categories"
	"server/categories/classnotes"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to BGCE Archive!")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", HomeHandler)

	mux.HandleFunc("GET /categories", categories.CategoryHandler)

	mux.HandleFunc("GET /categories/classnotes", classnotes.ClassnotesHandler)
	mux.HandleFunc("GET /categories/classnotes/{id}", classnotes.GetClassNote)
	mux.HandleFunc("POST /categories/classnotes", classnotes.PostClassNote)

	port := ":8080"
	fmt.Println("Server is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
