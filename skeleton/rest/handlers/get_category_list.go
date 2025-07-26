package handlers

import (
	"encoding/json"
	"net/http"
)

func (h *Handlers) GetCategoryList(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(categories)
}
