package product

import (
	"fmt"
	"net/http"
	"strconv"
	
	"ecommerce/util"
)
	

func (h *Handler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")

	pId, err := strconv.Atoi(productID)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid product ID")
		return 
	}

	err = h.productRepo.Delete(pId)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
		return 
	}

	util.SendData(w, http.StatusOK, "Successfully deleted product!")
}