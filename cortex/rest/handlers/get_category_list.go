package handlers

import (
	"encoding/json"
	"net/http"

	"cortex/category"
)

var categories []category.Category

func (h *Handlers) GetCategoryList(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(categories)
}
