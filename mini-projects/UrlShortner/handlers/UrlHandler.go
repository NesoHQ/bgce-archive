package handlers

import (
	"UrlShortner/database"
	"UrlShortner/models"
	"UrlShortner/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

const baseUrl = "http://localhost:8081/"

func ShortenUrlHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.UrlReq
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.URL == "" {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	key := utils.GenerateKey(6)
	err = database.SaveUrl(key, req.URL)
	fmt.Println(err)
	if err != nil {
		http.Error(w, "Internal server errorc", http.StatusInternalServerError)
		return
	}

	resp := models.UrlRes{
		Key:      key,
		Url:      req.URL,
		ShortUrl: baseUrl + key,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func RedirectHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Path[1:]
	if key == "" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	originalUrl, err := database.GetUrl(key)
	if err != nil {
		http.Error(w, "Url not found x", http.StatusNotFound)
		return
	}

	fmt.Println("OriginalUrl:", originalUrl)
	fmt.Println(err)
	http.Redirect(w, r, originalUrl, http.StatusFound)
}
