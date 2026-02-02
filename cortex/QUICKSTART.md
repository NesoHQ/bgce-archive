# Cortex - Quick Start

## 🚀 Get Started in 30 Seconds

```bash
# Start everything with Docker
make docker-up

# View logs
make docker-logs
```

Access the service at `http://localhost:5000`

## 🛠️ Common Commands

### Docker Operations
```bash
make docker-up        # Start all services
make docker-down      # Stop all services
make docker-logs      # View logs
make docker-restart   # Restart services
make docker-clean     # Clean everything
```

### Local Development
```bash
make prepare          # Install dependencies
make dev              # Run with hot reload
make build            # Build binary
make start            # Run production build
make test             # Run tests
```

### Code Generation
```bash
make ent-gen          # Generate Ent code
make ent-schema NAME=Entity  # Create new entity
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

Key variables:
- `HTTP_PORT` - Server port (default: 8080)
- `BGCE_DB_DSN` - PostgreSQL connection string
- `READ_REDIS_URL` / `WRITE_REDIS_URL` - Redis URLs
- `RABBITMQ_URL` - RabbitMQ connection string
- `JWT_SECRET` - JWT signing secret

## 🔗 Service URLs

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger/
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **PostgreSQL**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## 🐛 Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :5000

# Or change the port in docker-compose.yml
ports:
  - "5001:8080"  # Use 5001 instead
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres
```

### Clean start
```bash
# Remove everything and start fresh
make docker-clean
make docker-up
```

## 📚 More Help

Run `make help` to see all available commands.
