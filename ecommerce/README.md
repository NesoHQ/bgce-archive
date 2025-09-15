# 🛒 Simple Go eCommerce Backend

A minimal eCommerce backend built in pure Go (**Golang**) without any external web frameworks.  
This project demonstrates a clean and modular folder structure for building REST APIs in Go.

## 🌿 Environment Variables

This project uses environment variables for configuration.  

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```
2.-   Fill in the required values in `.env`

  -   `SERVICE_NAME` – The name of your service (e.g., `ecommerce`)
        
    -   `HTTP_PORT` – The port your server will run on (e.g., `8080`)
        
    -   `JWT_SECRET_KEY` – Secret key used for signing JWT tokens
        
    -   `VERSION` – Version of the application (e.g., `1.0.0`)
        
-   If the service isn’t deployed yet, you can keep local defaults so anyone can run the service out of the box:


## 🚀 Features

📜 Product Listing (GET /products)  
➕ Create Product (POST /products)  
🔍 Get Product by ID (GET /products/{id})  
✏️ Update Product by ID (PUT /products/{id})  
❌ Delete Product by ID (DELETE /products/{id})  

👤 User Management (Register, Login with JWT)  

🛡 Middlewares for:
- Logging requests  
- CORS handling  
- Preflight and request validation  
- JWT authentication  
- Error handling and response management  

✅ CORS Support  
🛠 Clean Code using Go's `net/http` package  

---
```
## 📦 API Endpoints

| Method   | Endpoint           | Description              |
| -------- | ------------------ | ------------------------ |
| `GET`    | `/products`        | Retrieve all products    |
| `POST`   | `/products`        | Create a new product     |
| `GET`    | `/products/{id}`   | Retrieve a product by ID |
| `PUT`    | `/products/{id}`   | Update a product by ID   |
| `DELETE` | `/products/{id}`   | Delete a product by ID   |
| `POST`   | `/users`           | Create a new user        |
| `POST`   | `/login`           | Login user (JWT auth)    |

---
```



## 🧪 Example Product JSON

```json
{
  "id": 1,
  "title": "Orange",
  "description": "Orange is red. I love orange.",
  "price": 100,
  "imageUrl": "https://www.dole.com/sites/default/files/media/2025-01/oranges.png"
}
````

---

## 📂 Project Structure

```
├── cmd
│   └── serve.go
├── config
│   └── config.go
├── database
│   ├── product.go
│   └── user.go
├── go.mod
├── go.sum
├── main.go
├── README.md
├── rest
│   ├── handlers
│   │   ├── product
│   │   │   ├── create_product.go
│   │   │   ├── delete_product.go
│   │   │   ├── get_product.go
│   │   │   ├── get_products.go
│   │   │   ├── handler.go
│   │   │   ├── routes.go
│   │   │   └── update_product.go
│   │   ├── review
│   │   │   ├── get_reviews.go
│   │   │   ├── handler.go
│   │   │   └── routes.go
│   │   └── user
│   │       ├── create_user.go
│   │       ├── handler.go
│   │       ├── login.go
│   │       └── routes.go
│   ├── middlewares
│   │   ├── authenticate_jwt.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   ├── manager.go
│   │   ├── middleware.go
│   │   └── preflight.go
│   └── server.go
└── util
    ├── create_jwt.go
    └── send_data.go
```

---

## ▶️ Running the Server

```bash
go run main.go
```

Server will run at: **[http://localhost:8080](http://localhost:8080)**

---

## 📌 Notes

* Built entirely with **standard Go libraries** — no third-party HTTP frameworks.
* Modular structure for easy scalability.
* Can be extended for authentication, database persistence, and more.

---

## 📝 TODO
* [ ] Add database integration (currently missing)
* [X] Split `routes.go` into multiple route files
* [X] Split handlers into feature-wise packages
* [X] Avoid reloading configuration repeatedly
* [X] Remove tight coupling from `config`
* [ ] Decouple handlers from direct database calls
