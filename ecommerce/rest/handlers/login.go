package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
)


type RequestLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`

}

func Login(w http.ResponseWriter, r *http.Request){
	var requestlogin RequestLogin  	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestlogin)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid Request Data!", http.StatusBadRequest)
		return 
	}

	user := database.Find(requestlogin.Email, requestlogin.Password)
	if user == nil {
		http.Error(w, "Invalid credentials", http.StatusCreated)
		return
	}

	util.SendData(w, user, http.StatusCreated)	
}