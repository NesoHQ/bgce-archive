package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"ecommerce/database"
	"ecommerce/util"
)

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("productId")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", http.StatusBadRequest)
		return
	}

	var newProduct database.Product

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&newProduct)

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Plz give me valid JSON data", http.StatusBadRequest)
		return
	}

	newProduct.ID = pId

	database.Upddate(newProduct)
	util.SendData(w, "Successfully updated product", http.StatusOK)
}
