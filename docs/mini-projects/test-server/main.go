package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to BGCE Archive!")
}

func CategoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintln(w, "Categories list goes here")
}

func ClassnotesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintln(w, "All classnotes list goes here")
}

func GetClassnoteByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Invalid classnote ID", http.StatusBadRequest)
		return
	}
	id := parts[3]

	fmt.Fprintf(w, "Classnote details for ID: %s\n", id)
}

func PostNewClassnote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "Received new classnote: %+v\n", data)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", HomeHandler)
	mux.HandleFunc("/categories", CategoryHandler)

	mux.HandleFunc("/categories/classnotes", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			ClassnotesHandler(w, r)
		case http.MethodPost:
			PostNewClassnote(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/categories/classnotes/", GetClassnoteByID)

	port := ":8080"
	fmt.Println("Server is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
