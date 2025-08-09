package global_router

import "net/http"

func GlobalRouter(mux *http.ServeMux) http.Handler {
	handelAllReq := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "aplication/json")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Habib")
		w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS")
		if r.Method == "OPTIONS" {
			w.WriteHeader(200)
			return
		}
		mux.ServeHTTP(w, r)
	}
	return http.HandlerFunc(handelAllReq)
}
