package user

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ecommerce/util"	
)


type RequestLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`

}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request){
	var req RequestLogin  	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid Request Data")
		return 
	}

	user, err := h.userRepo.Find(req.Email, req.Password)

	if err != nil {
		util.SendError(w, http.StatusUnauthorized, "Unauthorized")
		return 
	}


	accessToken, err := util.CreateJwt(h.cnf.JwtSecretKey, util.Payload{
		Sub:       user.ID, 
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	})

	if err != nil {
		http.Error(w, "Interal Server Error", http.StatusInternalServerError) 
		return
	}

	util.SendData(w, http.StatusCreated, accessToken)	
}