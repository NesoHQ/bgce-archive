package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"encoding/json"

	"ecommerce/database"
	"ecommerce/util"
)
	

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Please give me valid product id", 400)
		return 
	}

	var newProduct database.Product 	
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&newProduct)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Please send a valid JSON body", 400)
		return 
	}

	newProduct.ID = pId

	database.Update(newProduct)

	util.SendData(w, "Successfully updated product", 201)
}