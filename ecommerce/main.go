package main 

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello World")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "I'm Habib. I'm youtuber. I'm software engineer")
}

type Product struct {
	ID 			int     `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgUrl 		string  `json:"imageUrl"`
}

var productList []Product

func getProducts(w http.ResponseWriter, r *http.Request) {
	handleCors(w)
	handlePreflightReq(w, r)

	if r.Method != "GET" { // r.Method = post, put, patch, delete
		http.Error(w, "Please send a GET request", 400)
		return 
	}

	sendData(w, productList, 200)
}

func createProduct(w http.ResponseWriter, r *http.Request){
	handleCors(w)
	handlePreflightReq(w, r)

	if r.Method != "POST" { // r.Method = get, put, patch, delete
		http.Error(w, "Please send a POST request", 400)
		return 
	}

	var newProduct Product 
	
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newProduct)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Please send a valid JSON body", 400)
		return 
	}

	newProduct.ID = len(productList) + 1

	productList = append(productList, newProduct)

	sendData(w, newProduct, 201)	
}

func handleCors(w http.ResponseWriter){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Headers", "Content-Type, Habib")
	w.Header().Set("Content-Type", "application/json")
	
}

func handlePreflightReq(w http.ResponseWriter, r *http.Request){
	if r.Method == "OPTIONS" {
		w.WriteHeader(200)
	}
}

func sendData(w http.ResponseWriter, data interface{}, statusCode int) {
	w.WriteHeader(statusCode)
	encoder := json.NewEncoder(w)
	encoder.Encode(data)
}

func main() {
	mux := http.NewServeMux() // router 

	mux.HandleFunc("/hello", helloHandler) // route

	mux.HandleFunc("/about", aboutHandler) // route

	mux.HandleFunc("/products", getProducts)

	mux.HandleFunc("/create-products", createProduct)
	
	fmt.Println("Server running on port :8080")

	err := http.ListenAndServe(":8080", mux) //" Failed to start the server"
	if err != nil {
		fmt.Println("Error starting the server", err)
	}
}

func init() {
	prd1 := Product{
		ID: 1,
		Title: "Orange",
		Description: "Orange is red. I love orange.",
		Price: 100,
		ImgUrl: "https://www.dole.com/sites/default/files/media/2025-01/oranges.png",
	}

	prd2 := Product{
		ID: 2,
		Title: "Apple",
		Description: "Apple is green. I hate apple.",
		Price: 40,
		ImgUrl: "https://www.harrisfarm.com.au/cdn/shop/products/40715-done.jpg",
	}

	prd3 := Product{
		ID: 3,
		Title: "Banana",
		Description: "Banana is boring. I feel bored eating banana.",
		Price: 5,
		ImgUrl: "https://www.allrecipes.com/thmb/lc7nSL9L5zMHXz9t6PMAVm9biNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ar-new-banana-adobe-ar-2x1-917fdde58d194b529b41042ebff1c031.jpg",
	}

	// prd4 := Product{
	// 	ID: 4,
	// 	Title: "Angur Fol",
	// 	Description: "Angur Fol Tastes good.",
	// 	Price: 140,
	// 	ImgUrl: "https://cdn.dhakapost.com/media/imgAll/BG/2022January/angur-2-20220215152127.jpg",
	// }

	// prd5 := Product{
	// 	ID: 5,
	// 	Title: "Mango",
	// 	Description: "Mango is my favorite. I love it very much.",
	// 	Price: 1000000,
	// 	ImgUrl: "https://www.dole.com/sites/default/files/styles/512w384h-80/public/media/dole-blog-03-maerz-mango-05.jpg?itok=qXHJMEAz-PEthlz_-",
	// }

	// prd6 := Product{
	// 	ID: 6,
	// 	Title: "Strawberry",
	// 	Description: "Strawberries are sweet, juicy, and bursting with flavor.",
	// 	Price: 500,
	// 	ImgUrl: "https://snaped.fns.usda.gov/sites/default/files/styles/crop_ratio_7_5/public/seasonal-produce/2018-05/strawberries.jpg.webp?itok=B4LFd4vV",
	// }

	productList = append(productList, prd1)
	productList = append(productList, prd2)
	productList = append(productList, prd3)
	// productList = append(productList, prd4)
	// productList = append(productList, prd5)
	// productList = append(productList, prd6)

}