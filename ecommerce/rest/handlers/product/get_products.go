package product

import (
	"net/http"

	
	"ecommerce/util"

	//"github.com/golang-migrate/migrate/database"
)


func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	productList, err := h.productRepo.List()
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
		return 
	}
	util.SendData(w, http.StatusOK, productList)
}