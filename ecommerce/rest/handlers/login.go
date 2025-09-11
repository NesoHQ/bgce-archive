package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ecommerce/database"
	"ecommerce/util"
	"ecommerce/config"
	
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

	cnf := config.GetConfig()

	accessToken, err := util.CreateJwt(cnf.JwtSecretKey, util.Payload{
		Sub:       user.ID, 
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	})

	if err != nil {
		http.Error(w, "Interal Server Error", http.StatusInternalServerError) 
		return
	}

	util.SendData(w, accessToken, http.StatusCreated)	
}