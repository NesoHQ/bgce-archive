package main

import (
	"UrlShortner/config"
	"UrlShortner/handlers"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Starting server...")
	config.InitDB()
	fmt.Println("Back to main")

	http.HandleFunc("/shorten", handlers.ShortenUrlHandler)
	http.HandleFunc("/", handlers.RedirectHandler)

	err := http.ListenAndServe(":8081", nil)
	fmt.Println("after listen")
	fmt.Println(err)
	if err != nil {
		log.Fatal(err)
		return
	}
	log.Println("Listening on port 8080")
}
