package product

import (
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
)


func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	util.SendData(w, database.List(), 200)
}