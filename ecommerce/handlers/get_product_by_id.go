package handlers

import (
	"ecommerce/database"
	"ecommerce/util"
	"net/http"
	"strconv"
)

func GetProductByID(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productID")

	pID, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Pls give me valid product ID", 400)
		return
	}

	for _, product := range database.ProductList {
		if product.ID == pID {
			util.SendData(w, product, 200)
			return
		}
	}

	util.SendData(w, "Product not found", 404)
}
