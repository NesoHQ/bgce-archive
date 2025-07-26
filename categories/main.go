package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Category struct {
	ID          string    `json:"id"`
	Label       string    `json:"label"`
	Description string    `json:"description"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Meta        string    `json:"meta,omitempty"`
}

var categories []Category

func getCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if r.Method != "GET" {
		http.Error(w, "Only GET method allowed", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(categories)
}

func createCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Only POST method allowed", http.StatusBadRequest)
		return
	}

	var cat Category
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	cat.CreatedAt = time.Now().UTC()
	cat.UpdatedAt = time.Now().UTC()

	categories = append(categories, cat)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cat)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getCategories(w, r)
		case http.MethodPost:
			createCategory(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	fmt.Println("Category service running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		fmt.Println("Server error:", err)
	}
}

func init() {
	categories = append(categories, Category{
		ID:          "interview-qna",
		Label:       "Interview Q&A",
		Description: "Technical interview questions categorized by difficulty and topic",
		CreatedBy:   "admin",
		CreatedAt:   time.Now().Add(-48 * time.Hour).UTC(),
		UpdatedAt:   time.Now().Add(-24 * time.Hour).UTC(),
		Meta:        "extra-info-placeholder",
	})
}
