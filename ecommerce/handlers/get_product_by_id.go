package handlers

import (
	"ecommerce/database"
	"ecommerce/utils"
	"net/http"
	"strconv"
)

func GetProductByID(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productId")
	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me a valid product id", 400)
		return 
	}

	for _, product := range database.ProductList {
		if pId == product.ID {
			utils.SendData(w, product, 200)
			return
		}
	}

	utils.SendData(w, "Data pai nai", 404)
}