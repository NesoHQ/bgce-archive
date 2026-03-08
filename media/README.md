# Media Service

The Media Service is a microservice responsible for handling file uploads, storage, and management for the BGCE Archive platform. It provides a robust API for uploading images, videos, and documents with support for image optimization, thumbnail generation, and CDN integration.

## Features

- **File Upload**: Support for images, videos, and documents
- **Image Processing**: Automatic image optimization and resizing
- **Storage**: MinIO/S3-compatible object storage
- **CDN Integration**: Optional CDN support for fast content delivery
- **Multi-tenancy**: Tenant-aware file management
- **Quota Management**: File size limits and type restrictions
- **Metadata Storage**: PostgreSQL for file metadata
- **RESTful API**: Clean REST API with JSON responses

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      Media Service (Port 8086)   │
├─────────────────────────────────┤
│  • Upload Handler                │
│  • Image Optimization            │
│  • File Management               │
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│ PostgreSQL  │  │ MinIO/S3     │
│ (Metadata)  │  │ (Files)      │
└─────────────┘  └──────────────┘
```

## Technology Stack

- **Language**: Go 1.24
- **Database**: PostgreSQL 14+ (shared with other services)
- **Storage**: MinIO (S3-compatible)
- **Image Processing**: `nfnt/resize`, `golang.org/x/image`
- **HTTP Framework**: Standard library `net/http`
- **Database Driver**: `jmoiron/sqlx`
- **Configuration**: Viper + godotenv

## Database Schema

```sql
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    tenant_id INTEGER,
    user_id INTEGER,
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Upload File
```http
POST /api/v1/media/upload
Content-Type: multipart/form-data

Form Data:
- file: (binary)
- tenant_id: (optional)
- user_id: (optional)

Response:
{
  "status": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "image.jpg",
    "file_url": "http://localhost:9000/bgce-media/2024/01/15/550e8400.jpg",
    "mime_type": "image/jpeg",
    "file_size": 245678,
    "width": 1920,
    "height": 1080,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### List Media Files
```http
GET /api/v1/media?page=1&limit=20&mime_type=image/

Response:
{
  "status": true,
  "data": {
    "data": [...],
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Get Media by ID
```http
GET /api/v1/media/{id}

Response:
{
  "status": true,
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "image.jpg",
    ...
  }
}
```

### Get Media by UUID
```http
GET /api/v1/media/uuid/{uuid}
```

### Delete Media
```http
DELETE /api/v1/media/{id}

Response:
{
  "status": true,
  "message": "Media file deleted successfully"
}
```

### Get User Media
```http
GET /api/v1/users/{user_id}/media?page=1&limit=20
```

### Optimize Image
```http
POST /api/v1/media/{id}/optimize
Content-Type: application/json

{
  "quality": 85,
  "width": 1024,
  "height": 768
}

Response:
{
  "status": true,
  "message": "Image optimized successfully (45.23% savings)",
  "data": {
    "original_size": 245678,
    "optimized_size": 134567,
    "savings_percentage": 45.23,
    "new_url": "http://localhost:9000/bgce-media/2024/01/15/550e8400_optimized.jpg"
  }
}
```

### Health Check
```http
GET /health

Response:
{
  "status": "healthy",
  "service": "media",
  "version": "1.0.0"
}
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Service Configuration
VERSION=1.0.0
MODE=debug
SERVICE_NAME=media
HTTP_PORT=8086
MIGRATION_SOURCE=migrations

# Database Configuration
READ_DB_HOST=127.0.0.1
READ_DB_PORT=5432
READ_DB_NAME=bgce_archive
READ_DB_USER=postgres
READ_DB_PASSWORD=postgres
READ_DB_MAX_IDLE_TIME_IN_MINUTES=60
READ_DB_MAX_OPEN_CONNS=25
READ_DB_MAX_IDLE_CONNS=25
READ_DB_ENABLE_SSL_MODE=false

WRITE_DB_HOST=127.0.0.1
WRITE_DB_PORT=5432
WRITE_DB_NAME=bgce_archive
WRITE_DB_USER=postgres
WRITE_DB_PASSWORD=postgres
WRITE_DB_MAX_IDLE_TIME_IN_MINUTES=60
WRITE_DB_MAX_OPEN_CONNS=25
WRITE_DB_MAX_IDLE_CONNS=25
WRITE_DB_ENABLE_SSL_MODE=false

# MinIO/S3 Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=bgce-media
MINIO_REGION=us-east-1
CDN_BASE_URL=http://localhost:9000

# Upload Configuration
MAX_UPLOAD_SIZE_MB=50
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/ogg
ALLOWED_DOCUMENT_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Image Processing
ENABLE_IMAGE_OPTIMIZATION=true
THUMBNAIL_WIDTH=300
THUMBNAIL_HEIGHT=300
MAX_IMAGE_WIDTH=2048
MAX_IMAGE_HEIGHT=2048
```

## Getting Started

### Prerequisites

- Go 1.24+
- PostgreSQL 14+
- MinIO (or S3-compatible storage)

### Installation

1. Clone the repository:
```bash
cd media
```

2. Install dependencies:
```bash
go mod download
```

3. Set up MinIO (using Docker):
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

4. Set up PostgreSQL (if not already running):
```bash
docker run -d \
  -p 5432:5432 \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:14
```

5. Create `.env` file (see Configuration section above)

6. Run database migrations:
```bash
go run main.go serve-rest
# Migrations run automatically on startup
```

### Running the Service

#### Development Mode
```bash
# Using make
make dev

# Or directly
go run main.go serve-rest
```

#### Production Mode
```bash
# Build
make build

# Run
./main serve-rest
```

### Using Docker

```bash
# Build image
docker build -t media-service .

# Run container
docker run -d \
  -p 8086:8086 \
  --env-file .env \
  --name media-service \
  media-service
```

## Testing

### Manual Testing with cURL

#### Upload a file:
```bash
curl -X POST http://localhost:8086/api/v1/media/upload \
  -F "file=@/path/to/image.jpg" \
  -F "user_id=1"
```

#### List media files:
```bash
curl http://localhost:8086/api/v1/media?page=1&limit=10
```

#### Get media by ID:
```bash
curl http://localhost:8086/api/v1/media/1
```

#### Delete media:
```bash
curl -X DELETE http://localhost:8086/api/v1/media/1
```

#### Optimize image:
```bash
curl -X POST http://localhost:8086/api/v1/media/1/optimize \
  -H "Content-Type: application/json" \
  -d '{"quality": 85, "width": 1024}'
```

## Project Structure

```
media/
├── cmd/                    # Command-line interface
│   ├── rest.go            # REST server command
│   └── root.go            # Root command
├── config/                 # Configuration management
│   ├── config.go          # Config struct
│   ├── db_config.go       # Database config
│   └── load-config.go     # Config loader
├── domain/                 # Domain models
│   └── media_file.go      # MediaFile entity
├── media/                  # Media business logic
│   ├── dto.go             # Data transfer objects
│   ├── port.go            # Interfaces
│   ├── repository.go      # Database operations
│   ├── service.go         # Business logic
│   └── storage.go         # MinIO storage provider
├── migrations/             # Database migrations
│   ├── 000001_create_media_files_table.up.sql
│   └── 000001_create_media_files_table.down.sql
├── rest/                   # HTTP handlers
│   ├── handlers/
│   │   ├── handler.go     # Handler struct
│   │   └── media.go       # Media endpoints
│   ├── middlewares/       # HTTP middlewares
│   ├── utils/             # HTTP utilities
│   ├── routes.go          # Route definitions
│   └── server.go          # HTTP server
├── .env                    # Environment variables
├── .env.example           # Example environment file
├── Dockerfile             # Docker configuration
├── go.mod                 # Go module definition
├── main.go                # Application entry point
├── Makefile               # Build commands
└── README.md              # This file
```

## Deployment

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  media:
    build: .
    ports:
      - "8086:8086"
    environment:
      - VERSION=1.0.0
      - MODE=release
      - SERVICE_NAME=media
      - HTTP_PORT=8086
      # ... other env vars
    depends_on:
      - postgres
      - minio

  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
```

Run with:
```bash
docker-compose up -d
```

## Monitoring

### Health Check

The service exposes a health check endpoint:
```bash
curl http://localhost:8086/health
```

### Logs

Logs are written to stdout in JSON format:
```json
{
  "time": "2024-01-15T10:00:00Z",
  "level": "INFO",
  "msg": "File uploaded successfully",
  "path": "2024/01/15/550e8400.jpg",
  "url": "http://localhost:9000/bgce-media/2024/01/15/550e8400.jpg"
}
```

## Security Considerations

1. **File Type Validation**: Only allowed MIME types can be uploaded
2. **File Size Limits**: Configurable maximum upload size
3. **Storage Isolation**: Files are stored with UUID-based paths
4. **Authentication**: JWT authentication (to be enabled)
5. **CORS**: Configurable CORS settings
6. **SQL Injection**: Parameterized queries prevent SQL injection

## Performance

- **Connection Pooling**: Configurable database connection pools
- **Concurrent Uploads**: Handles multiple simultaneous uploads
- **Image Optimization**: Reduces file sizes by 30-50%
- **CDN Support**: Optional CDN integration for fast delivery

## Troubleshooting

### MinIO Connection Issues
```bash
# Check MinIO is running
docker ps | grep minio

# Check MinIO logs
docker logs minio

# Test MinIO connection
curl http://localhost:9000/minio/health/live
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test database connection
psql -h localhost -U postgres -d bgce_archive
```

### Upload Failures
- Check file size doesn't exceed MAX_UPLOAD_SIZE_MB
- Verify MIME type is in allowed types list
- Check MinIO bucket exists and is accessible
- Review service logs for detailed error messages

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow Go best practices
5. Use meaningful commit messages

## License

Copyright © 2024 BGCE Archive / NesoHQ

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/bgce-archive/issues)
- Documentation: See `architecture/` directory
- Email: support@bgce-archive.com
