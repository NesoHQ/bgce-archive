# Service Template

This is a production-ready Go microservice template intended to speed up new service creation. It comes with:

-   Go module structure
-   Docker support
-   PostgreSQL DB integration (read/write separation)
-   RabbitMQ configuration
-   Elastic APM support
-   Configurable environment variables
-   Structured logging
-   Graceful shutdown

## 📚 Documentation

All relevant documentation is available inside the [`docs/`](docs/) directory:

-   [API Docs](docs/api-docs/) – Specifications, endpoints, authentication, and usage examples.
-   [Database Docs](docs/db-docs/) – Database schema, table descriptions, and migration guidelines.
-   [Architecture Decision Records (ADR)](docs/adr/) – Key design choices and their justifications.
-   [Docs Overview](docs/README.md) – Full documentation index and contribution guide.

---

## Getting Started

### 1. Clone the Template

```bash
git clone https://github.com/your-org/servicetemplate.git your-new-service
cd your-new-service
```

### 2. Replace Module Name

Update the go.mod file:

```go
module github.com/your-org/<your-service-name>
```

Then replace all `servicetemplate` imports in the project:

```bash
find . -type f -name "*.go" -exec sed -i 's/servicetemplate/<your-service-name>/g' {} +
```

### 3. Configure Environment

Create a `.env` file or use `Docker Compose` to inject environment variables. You can customize:

-   PostgreSQL DB (read/write)
-   RabbitMQ
-   APM settings
-   Service ports, names, secrets

#### 🧩 Basic Settings

| Key            | Description                 | Example          |
| -------------- | --------------------------- | ---------------- |
| `SERVICE_NAME` | Your microservice name      | `product-api`    |
| `MODE`         | Environment mode            | `debug` / `prod` |
| `HTTP_PORT`    | Exposed container port      | `80`             |
| `JWT_SECRET`   | Secret for token validation | `my-secret-key`  |

#### 🐇 RabbitMQ Settings

| Key                   | Description                              |
| --------------------- | ---------------------------------------- |
| `RABBITMQ_URL`        | AMQP connection string                   |
| `RMQ_RECONNECT_DELAY` | Delay before reconnect in seconds        |
| `RMQ_RETRY_INTERVAL`  | Interval between retries in milliseconds |
| `RMQ_QUEUE_PREFIX`    | Prefix used for queue naming             |

#### 📊 APM Settings

| Key                | Description                           |
| ------------------ | ------------------------------------- |
| `APM_SERVICE_NAME` | Name of the service in APM            |
| `APM_SERVER_URL`   | APM Server URL                        |
| `APM_SECRET_TOKEN` | Secret token for secure communication |
| `APM_ENVIRONMENT`  | APM environment (e.g., `dev`, `prod`) |

#### 🗄️ PostgreSQL DB (Read & Write)

| Key                            | Description                 |
| ------------------------------ | --------------------------- |
| `*_SERVICE_DB_HOST`            | DB hostname or IP           |
| `*_SERVICE_DB_PORT`            | DB port                     |
| `*_SERVICE_DB_NAME`            | Database name               |
| `*_SERVICE_DB_USER`            | Database username           |
| `*_SERVICE_DB_PASSWORD`        | Password                    |
| `*_SERVICE_DB_MAX_IDLE_*`      | Connection pooling settings |
| `*_SERVICE_DB_ENABLE_SSL_MODE` | true/false                  |

### 4. 🧪 Build & Run with Docker

Build and start the service:

```bash
docker-compose up --build
```

### 5. 🔐 Environment Management

You can also move the environment: values into a .env file:

```
SERVICE_NAME=product-api
MODE=debug
HTTP_PORT=80
JWT_SECRET=my-super-secret
# and so on...
```

Update docker-compose.yml to use variables like:

```yml
SERVICE_NAME: ${SERVICE_NAME}
```

### 6. Example Docker Compose Service Block

```yaml
services:
    <your-service-name>:
        build:
            context: .
        container_name: <your-service-name>
        ports:
            - '5000:80'
        environment:
            VERSION: 1.0.0
            MODE: debug
            SERVICE_NAME: <your-service-name>
            HTTP_PORT: 80
            MIGRATION_SOURCE: migrations
            JWT_SECRET: anything-secret

            # APM Configuration
            APM_SERVICE_NAME:
            APM_SERVER_URL:
            APM_SECRET_TOKEN:
            APM_ENVIRONMENT:

            # RabbitMQ
            RABBITMQ_URL:
            RMQ_RECONNECT_DELAY:
            RMQ_RETRY_INTERVAL:
            RMQ_QUEUE_PREFIX: <your-service-name>-dev

            # Read DB
            READ_SERVICE_DB_HOST:
            READ_SERVICE_DB_PORT:
            READ_SERVICE_DB_NAME:
            READ_SERVICE_DB_USER:
            READ_SERVICE_DB_PASSWORD:
            READ_SERVICE_DB_MAX_IDLE_TIME_IN_MINUTES:
            READ_SERVICE_DB_MAX_OPEN_CONNS:
            READ_SERVICE_DB_MAX_IDLE_CONNS:
            READ_SERVICE_DB_ENABLE_SSL_MODE:

            # Write DB
            WRITE_SERVICE_DB_HOST:
            WRITE_SERVICE_DB_PORT:
            WRITE_SERVICE_DB_NAME:
            WRITE_SERVICE_DB_USER:
            WRITE_SERVICE_DB_PASSWORD:
            WRITE_SERVICE_DB_MAX_IDLE_TIME_IN_MINUTES:
            WRITE_SERVICE_DB_MAX_OPEN_CONNS:
            WRITE_SERVICE_DB_MAX_IDLE_CONNS:
            WRITE_SERVICE_DB_ENABLE_SSL_MODE:
```

### Finally just run:

`make dev`

and the project should be up and running!
