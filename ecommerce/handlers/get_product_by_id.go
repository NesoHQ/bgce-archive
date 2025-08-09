package handlers

import (
	"net/http"
	"strconv"

	"ecommerce/database"
	"ecommerce/util"
	
)


func GetProductByID(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productId")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", 400)
		return 
	}

	for _, product := range database.ProductList{
		if product.ID == pId {
			util.SendData(w, product, 200)
			return
		}
		
	}

	util.SendData(w, "Data not found", 404)
}