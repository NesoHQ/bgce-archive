# 🛒 Simple Go eCommerce 

This is a basic eCommerce backend built using pure Go (Golang) without any external frameworks.

## 🚀 Features

- 🧾 Product listing (`GET /products`)
- 👋 Hello route (`GET /hello`)
- 🙋 About route (`GET /about`)
- ✅ CORS support for product route
- 🛠️ Clean and simple Go code (uses `net/http`)

## 📦 API Endpoints

| Method | Route        | Description                    |
|--------|--------------|--------------------------------|
| GET    | /hello       | Returns "Hello World"          |
| GET    | /about       | Info about the developer       |
| GET    | /products    | Returns a list of products     |

## 🧪 Example Product JSON

```json
{
  "id": 1,
  "title": "Orange",
  "description": "Orange is red. I love orange.",
  "price": 100,
  "imageUrl": "https://www.dole.com/sites/default/files/media/2025-01/oranges.png"
}
