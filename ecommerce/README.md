# 🛒 Simple Go eCommerce API

This is a minimalist eCommerce REST API built using pure Go (Golang) without any external dependencies.

## 🚀 Features

- Pure Go implementation using `net/http`
- RESTful API endpoints
- CORS support
- In-memory product database
- JSON response format

## 📦 API Endpoints

| Method | Route                 | Description          |
| ------ | --------------------- | -------------------- |
| GET    | /products             | Get all products     |
| GET    | /products/{productID} | Get product by ID    |
| POST   | /products             | Create a new product |

## 🧪 Example Product Structure

```json
{
  "id": 1,
  "title": "Orange",
  "description": "Juicy, vitamin-rich oranges grown in Bangladesh.",
  "price": 120,
  "imageUrl": "https://www.dole.com/sites/default/files/media/2025-01/oranges.png"
}
```

## 🛠️ Project Structure

```
├── cmd/
│   └── serve.go          # Server initialization
├── database/
│   └── product.go        # Product model and data
├── global_router/
│   └── global_router.go  # CORS and middleware
├── handlers/
│   ├── creat_product.go
│   ├── get_product_by_id.go
│   └── get_products.go
├── util/
│   └── send_data.go      # Response utilities
└── main.go               # Application entry point
```

## 🚀 Running the Server

```bash
go run main.go
```

The server will start on port 8080.

## 🔑 CORS Support

The API includes CORS support with the following headers:

- Access-Control-Allow-Origin: \*
- Access-Control-Allow-Headers: Content-Type, Habib
- Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, OPTIONS
