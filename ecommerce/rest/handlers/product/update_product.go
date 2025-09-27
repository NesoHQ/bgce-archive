package product

import (
	"fmt"
	"net/http"
	"strconv"
	"encoding/json"

	"ecommerce/util"
	"ecommerce/repo"
)
	
type ReqUpdateProduct struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgUrl 		string  `json:"imageUrl"`
}


func (h *Handler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid product ID")
		return 
	}

	var req ReqUpdateProduct	
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&req)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid request body")
		return 
	}

	_, err = h.productRepo.Update(repo.Product{
		ID:          pId,
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		ImgUrl:      req.ImgUrl,
	})

	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
		return 
	}


	util.SendData(w, http.StatusOK, "Successfully updated product")
}