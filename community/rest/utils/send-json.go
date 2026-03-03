package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func SendJson(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Add("Content-Type", "application/json")

	str, err := json.Marshal(data)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"message": "Internal server error"}`))
		return
	}

	w.WriteHeader(status)
	w.Write(str)
}
