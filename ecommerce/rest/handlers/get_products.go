package handlers

import (
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {
	util.SendData(w, database.List(), http.StatusOK)
}
