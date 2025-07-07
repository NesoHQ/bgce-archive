# 🛰️ BGCE Server (Backend API)

Welcome to the **backend server** powering the BGCE (Best Golang Community Ever) archive and control system.  
This project serves as the foundation for category management, RBAC (Role-Based Access Control), and future API integrations — all written in **Golang** with simplicity and scalability in mind.

---

## 📁 Project Structure

```bash
/server
├── main               # Main entry point for the server
├── go.mod             # Go module file (defines module path, dependencies)
│
├── /categories        # Category API handlers
│   ├── categories.go  # HTTP handlers for category management (GET/POST/etc)
│
├── /rbac              # Role-Based Access Control logic
│   ├── superadmin.go  # RBAC logic to allow/disallow actions based on role
```

---

## 🚀 Getting Started

### 1. Clone the repo & enter the `/server` directory
```bash
git clone https://github.com/yourusername/bgce-backend.git
cd bgce-backend/server
```

### 2. Initialize dependencies (if needed)
```bash
go mod tidy
```

### 3. Run the server
```bash
go run main.go
```

> ✅ Server runs on: `http://localhost:8080`

---

## 🔐 Role-Based Access Control (RBAC)

For now, **Super Admin** check is a simple function in `rbac/superadmin.go`:
```go
func IsSuperAdmin(r *http.Request) bool
```

This will later be extended using JWT tokens, sessions, or other proper authentication systems.

---

## 🧩 API Endpoints (WIP)

| Endpoint         | Method | Description                  | Access        |
|------------------|--------|------------------------------|---------------|
| `/`              | GET    | Welcome route                | Public        |
| `/categories`    | GET    | List all categories          | Super Admin   |
| `/categories`    | POST   | Create a new category        | Super Admin   |
| `/categories`    | PUT    | Update a category            | Super Admin   |
| `/categories`    | DELETE | Delete a category            | Super Admin   |

---

## 🤝 Contributing

We welcome PRs, ideas, and improvements! Here's how to get started:

1. **Fork** the repo
2. Create a new branch using:
   ```bash
   git switch -c feature/your-feature-name
   ```
3. Add your changes (modular, readable, minimal)
4. **If adding route logic**, place it under `/main/`
5. **If adding role or auth logic**, place it under `/rbac/`
6. Push and open a PR with a clear title and message

> 📌 _Keep each PR focused — one feature or fix per PR, please!_

---

## 🔮 Roadmap (WIP Ideas)

- ✅ Clean route structure using `http.ServeMux`
- 🔐 Real token-based Super Admin checks (JWT/session)
- 📦 Persistent DB (PostgreSQL or SQLite)
- 🧩 Problem management endpoints
- 📊 Admin dashboard (frontend)
- 🔄 JSON response formatting

---

## 🧑‍💻 Maintained By

BGCE Mod Team
---

> _If you break it, you fix it. If you build it, name it something cool._ 😎
