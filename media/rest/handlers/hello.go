package handlers

import (
	"fmt"
	"net/http"
)

func (h *Handlers) HelloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, "Hello World")
}
