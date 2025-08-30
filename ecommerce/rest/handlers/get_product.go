package handlers

import (
	"net/http"
	"strconv"

	"ecommerce/database"
	"ecommerce/util"
)

func GetProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productId")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", http.StatusBadRequest)
		return
	}

	product := database.Get(pId)

	if product == nil {
		util.SendError(w, http.StatusNotFound, "Product not found")
		return
	}

	util.SendData(w, product, http.StatusOK)
}
