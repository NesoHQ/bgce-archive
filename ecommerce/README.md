# 🛒 Simple Go eCommerce Backend

A minimal eCommerce backend built in pure Go (**Golang**) without any external web frameworks.
This project demonstrates a clean and modular folder structure for building REST APIs in Go.

---

## 🚀 Features

* 📜 **Product Listing** (`GET /products`)
* ➕ **Create Product** (`POST /products`)
* 🔍 **Get Product by ID** (`GET /products/{productId}`)
* ✅ **CORS Support**
* 🛠 **Clean Code** using Go's `net/http` package

---

## 📦 API Endpoints

| Method | Route                   | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/products`             | Fetch all products   |
| POST   | `/products`             | Create a new product |
| GET    | `/products/{productId}` | Fetch product by ID  |

---

## 🧪 Example Product JSON

```json
{
  "id": 1,
  "title": "Orange",
  "description": "Orange is red. I love orange.",
  "price": 100,
  "imageUrl": "https://www.dole.com/sites/default/files/media/2025-01/oranges.png"
}
```

---

## 📂 Project Structure

```
├── cmd
│   └── serve.go
├── config
│   └── config.go
├── database
│   └── product.go
├── go.mod
├── go.sum
├── main.go
├── README.md
├── rest
│   ├── handlers
│   │   ├── create_product.go
│   │   ├── delete_product.go
│   │   ├── get_product.go
│   │   ├── get_products.go
│   │   └── update_product.go
│   ├── middlewares
│   │   ├── arekta.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   ├── manager.go
│   │   └── preflight.go
│   ├── routes.go
│   └── server.go
└── util
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
