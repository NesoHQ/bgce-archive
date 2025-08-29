package handlers

import (
	"net/http"
	"strconv"
	
	"ecommerce/database"
	"ecommerce/util"
)
	

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", 400)
		return 
	}

	database.Delete(pId)

	util.SendData(w, "Successfully deleted product!", 201)
}