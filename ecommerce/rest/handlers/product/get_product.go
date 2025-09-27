package product

import (
	"net/http"
	"strconv"


	"ecommerce/util"
	
)


func (h *Handler) GetProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid request body")
		return 
	}

	product, err := h.productRepo.Get(pId)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	if product ==  nil {
		util.SendError(w, http.StatusNotFound, "Product not found!")
		return
	}

	util.SendData(w, http.StatusOK, product)
}