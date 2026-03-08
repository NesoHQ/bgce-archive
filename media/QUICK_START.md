# Media Service - Quick Start Guide

Get the Media Service up and running in 5 minutes!

## Prerequisites

- Go 1.24+
- Docker & Docker Compose
- Make (optional, for convenience commands)

## Option 1: Docker Compose (Recommended)

The fastest way to get started with all dependencies:

```bash
# 1. Navigate to media directory
cd media

# 2. Start all services (PostgreSQL, MinIO, Media Service)
docker-compose up -d

# 3. Check logs
docker-compose logs -f media

# 4. Test the service
curl http://localhost:8086/health
```

That's it! The service is now running on port 8086.

### Access MinIO Console

Open http://localhost:9001 in your browser:
- Username: `minioadmin`
- Password: `minioadmin`

## Option 2: Local Development

Run the service locally with external dependencies:

### Step 1: Start Dependencies

```bash
# Start PostgreSQL
docker run -d \
  -p 5432:5432 \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:14

# Start MinIO
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

### Step 2: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env if needed (defaults should work)
```

### Step 3: Run the Service

```bash
# Install dependencies and run
make dev

# Or manually
go mod download
go run main.go serve-rest
```

The service will:
1. Connect to PostgreSQL
2. Run database migrations automatically
3. Connect to MinIO and create bucket
4. Start HTTP server on port 8086

## Quick Test

### 1. Health Check

```bash
curl http://localhost:8086/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "media",
  "version": "1.0.0"
}
```

### 2. Upload a File

```bash
# Create a test image
echo "Test image content" > test.txt

# Upload it
curl -X POST http://localhost:8086/api/v1/media/upload \
  -F "file=@test.txt" \
  -F "user_id=1"
```

Expected response:
```json
{
  "status": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "test.txt",
    "file_url": "http://localhost:9000/bgce-media/2024/01/15/550e8400.txt",
    "mime_type": "text/plain",
    "file_size": 18,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### 3. List Files

```bash
curl http://localhost:8086/api/v1/media
```

### 4. Get File by ID

```bash
curl http://localhost:8086/api/v1/media/1
```

### 5. Delete File

```bash
curl -X DELETE http://localhost:8086/api/v1/media/1
```

## Upload a Real Image

```bash
# Download a sample image
curl -o sample.jpg https://picsum.photos/800/600

# Upload it
curl -X POST http://localhost:8086/api/v1/media/upload \
  -F "file=@sample.jpg" \
  -F "user_id=1"

# The response will include width and height for images
```

## Optimize an Image

```bash
# Upload an image first and note its ID
IMAGE_ID=1

# Optimize it
curl -X POST http://localhost:8086/api/v1/media/${IMAGE_ID}/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "quality": 85,
    "width": 1024,
    "height": 768
  }'
```

## Common Commands

```bash
# View logs (Docker Compose)
docker-compose logs -f media

# Restart service
docker-compose restart media

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Run migrations manually
make migrate-up

# Rollback last migration
make migrate-down

# Create new migration
make migrate-create

# Build binary
make build

# Run tests
make test
```

## Troubleshooting

### Service won't start

1. Check if ports are available:
```bash
lsof -i :8086  # Media service
lsof -i :5432  # PostgreSQL
lsof -i :9000  # MinIO
```

2. Check logs:
```bash
docker-compose logs media
```

### Can't upload files

1. Check MinIO is running:
```bash
curl http://localhost:9000/minio/health/live
```

2. Check bucket exists:
   - Open http://localhost:9001
   - Login with minioadmin/minioadmin
   - Look for "bgce-media" bucket

### Database connection failed

1. Check PostgreSQL is running:
```bash
docker ps | grep postgres
```

2. Test connection:
```bash
psql -h localhost -U postgres -d bgce_archive
```

### File upload fails with "file too large"

Increase MAX_UPLOAD_SIZE_MB in .env:
```bash
MAX_UPLOAD_SIZE_MB=100
```

Then restart the service.

## Next Steps

1. **Read the full README**: `README.md`
2. **Understand the architecture**: `ARCHITECTURE.md`
3. **Explore the API**: Try all endpoints
4. **Integrate with frontend**: Use the API in your application
5. **Configure for production**: Update .env for production settings

## Production Checklist

Before deploying to production:

- [ ] Change MinIO credentials
- [ ] Enable SSL for MinIO (MINIO_USE_SSL=true)
- [ ] Configure CDN (set CDN_BASE_URL)
- [ ] Enable database SSL (WRITE_DB_ENABLE_SSL_MODE=true)
- [ ] Set MODE=release
- [ ] Configure proper backup strategy
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting
- [ ] Enable authentication (uncomment JWT middleware)
- [ ] Review and adjust upload limits
- [ ] Set up log aggregation

## Support

- **Documentation**: See README.md and ARCHITECTURE.md
- **Issues**: Create an issue on GitHub
- **Architecture docs**: See `../architecture/` directory

## Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/media/upload` | POST | Upload file |
| `/api/v1/media` | GET | List files |
| `/api/v1/media/{id}` | GET | Get file by ID |
| `/api/v1/media/uuid/{uuid}` | GET | Get file by UUID |
| `/api/v1/media/{id}` | DELETE | Delete file |
| `/api/v1/users/{user_id}/media` | GET | Get user's files |
| `/api/v1/media/{id}/optimize` | POST | Optimize image |

**Default Port**: 8086  
**MinIO Console**: http://localhost:9001  
**PostgreSQL**: localhost:5432

Happy coding! 🚀
