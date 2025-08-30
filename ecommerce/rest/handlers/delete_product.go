package handlers

import (
	"ecommerce/database"
	"ecommerce/util"
	"net/http"
	"strconv"
)

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productId")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", http.StatusBadRequest)
		return
	}

	database.Delete(pId)
	util.SendData(w, "Successfully deleted product", http.StatusOK)
}
