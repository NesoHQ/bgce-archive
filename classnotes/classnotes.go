package main

import (
	"fmt"
	"net/http"
	"strings"
)

func ClassnotesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintln(w, "Showing all Class Notes")
}

func GetClassnoteByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract noteID from URL path
	// Assuming route: /classnotes/{id}
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 || parts[2] == "" {
		http.Error(w, "Invalid or missing classnote ID", http.StatusBadRequest)
		return
	}
	noteID := parts[2]

	fmt.Fprintf(w, "Showing class note %v\n", noteID)
}

func PostNewClassnote(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO: Parse request body and save to DB
	fmt.Fprintln(w, "Classnote Added")
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/classnotes", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			ClassnotesHandler(w, r)
		case http.MethodPost:
			PostNewClassnote(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/classnotes/", GetClassnoteByID)

	port := ":8081"
	fmt.Println("Classnotes service is running on http://localhost" + port)

	if err := http.ListenAndServe(port, mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
