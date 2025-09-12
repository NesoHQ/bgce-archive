package product 

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
	
)

func (h *Handler) CreateProduct(w http.ResponseWriter, r *http.Request){	
	var newProduct database.Product 	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newProduct)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Please send a valid JSON body", 400)
		return 
	}

	createdProduct := database.Store(newProduct)

	util.SendData(w, createdProduct, 201)	
}

