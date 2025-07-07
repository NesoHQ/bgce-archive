package main

import (
	"fmt"
	"net/http"
	"server/rbac"
)

func categoryHandler(w http.ResponseWriter, r *http.Request) {
	if !rbac.IsSuperAdmin(r) {
		http.Error(w, "Forbidden: Super Admins only", http.StatusForbidden)
		return
	}

	switch r.Method {
	case http.MethodGet:
		fmt.Fprintln(w, "Listing all categories:")
	case http.MethodPost:
		fmt.Fprintln(w, "Creating a category...")
	case http.MethodPut:
		fmt.Fprintln(w, "Updating a category...")
	case http.MethodDelete:
		fmt.Fprintln(w, "Deleting a category...")
	default:
		http.Error(w, "🚫 Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
