package handlers 

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
	
)

func CreateProduct(w http.ResponseWriter, r *http.Request){
	var newProduct database.Product 	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newProduct)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Please send a valid JSON body", 400)
		return 
	}

	newProduct.ID = len(database.ProductList) + 1

	database.ProductList = append(database.ProductList, newProduct)

	util.SendData(w, newProduct, 201)	
}