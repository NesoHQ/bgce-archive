package rest

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (server *Server) initRoutes(mux *http.ServeMux) {
	mux.Handle(
		"GET /",
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			str, err := json.Marshal("A simple response")
			if err != nil {
				fmt.Println("Error in Root Endpoint!", err)

				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(`{"message": "Internal server error"}`))
			}

			w.WriteHeader(http.StatusOK)
			w.Write(str)
		}),
	)

}
