# Media Service Architecture

## Overview

The Media Service is designed following **Hexagonal Architecture** (Ports & Adapters) principles, ensuring clean separation of concerns and testability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST Handlers (rest/handlers/)                          │  │
│  │  • UploadHandler                                         │  │
│  │  • ListMediaHandler                                      │  │
│  │  • GetMediaByIDHandler                                   │  │
│  │  • DeleteMediaHandler                                    │  │
│  │  • OptimizeImageHandler                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Media Service (media/service.go)                        │  │
│  │  • Upload() - File upload with validation               │  │
│  │  • GetByID() - Retrieve media by ID                     │  │
│  │  • List() - Paginated listing                           │  │
│  │  • Delete() - Remove media file                         │  │
│  │  • OptimizeImage() - Image optimization                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Repository Layer       │  │   Storage Layer          │
│  (media/repository.go)   │  │  (media/storage.go)      │
│  • Create()              │  │  • Upload()              │
│  • FindByID()            │  │  • Download()            │
│  • FindByUUID()          │  │  • Delete()              │
│  • List()                │  │  • GetURL()              │
│  • Delete()              │  │                          │
└──────────────────────────┘  └──────────────────────────┘
            │                              │
            ▼                              ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│      PostgreSQL          │  │      MinIO/S3            │
│  (Metadata Storage)      │  │  (Object Storage)        │
│  • media_files table     │  │  • bgce-media bucket     │
└──────────────────────────┘  └──────────────────────────┘
```

## Layer Responsibilities

### 1. HTTP Layer (rest/)

**Purpose**: Handle HTTP requests and responses

**Components**:
- `handlers/`: HTTP request handlers
- `middlewares/`: Request/response middleware (CORS, logging, auth)
- `utils/`: HTTP utilities (JSON response helpers)
- `routes.go`: Route definitions
- `server.go`: HTTP server setup

**Responsibilities**:
- Parse HTTP requests
- Validate request format
- Call service layer
- Format HTTP responses
- Handle HTTP errors

### 2. Service Layer (media/)

**Purpose**: Business logic and orchestration

**Components**:
- `service.go`: Core business logic
- `dto.go`: Data transfer objects
- `port.go`: Interface definitions

**Responsibilities**:
- File validation (size, type)
- Image processing (resize, optimize)
- Coordinate repository and storage operations
- Business rule enforcement
- Transaction management

### 3. Repository Layer (media/)

**Purpose**: Data persistence

**Components**:
- `repository.go`: Database operations

**Responsibilities**:
- CRUD operations on media_files table
- Query building
- Database transaction handling
- Data mapping (domain ↔ database)

### 4. Storage Layer (media/)

**Purpose**: File storage operations

**Components**:
- `storage.go`: MinIO/S3 client

**Responsibilities**:
- Upload files to object storage
- Download files from object storage
- Delete files from object storage
- Generate public URLs
- Bucket management

### 5. Domain Layer (domain/)

**Purpose**: Core business entities

**Components**:
- `media_file.go`: MediaFile entity

**Responsibilities**:
- Define domain models
- Business logic methods (IsImage(), IsVideo())
- Domain validation

## Data Flow

### Upload Flow

```
1. Client sends multipart/form-data request
   ↓
2. UploadHandler receives request
   ↓
3. Handler parses file and metadata
   ↓
4. Service validates file (size, type)
   ↓
5. Service reads file content
   ↓
6. Service detects image dimensions (if image)
   ↓
7. Storage uploads file to MinIO
   ↓
8. Repository saves metadata to PostgreSQL
   ↓
9. Service returns UploadResponse
   ↓
10. Handler sends JSON response to client
```

### Retrieve Flow

```
1. Client sends GET request with ID
   ↓
2. GetMediaByIDHandler receives request
   ↓
3. Service calls repository
   ↓
4. Repository queries PostgreSQL
   ↓
5. Service returns MediaFileResponse
   ↓
6. Handler sends JSON response to client
```

### Delete Flow

```
1. Client sends DELETE request with ID
   ↓
2. DeleteMediaHandler receives request
   ↓
3. Service retrieves media metadata
   ↓
4. Storage deletes file from MinIO
   ↓
5. Repository deletes record from PostgreSQL
   ↓
6. Service returns success
   ↓
7. Handler sends JSON response to client
```

## Database Schema

```sql
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    tenant_id INTEGER,                    -- Multi-tenancy support
    user_id INTEGER,                      -- File owner
    filename VARCHAR(500) NOT NULL,       -- Original filename
    file_path VARCHAR(1000) NOT NULL,     -- Storage path
    file_url VARCHAR(1000) NOT NULL,      -- Public URL
    mime_type VARCHAR(100) NOT NULL,      -- Content type
    file_size BIGINT NOT NULL,            -- Size in bytes
    width INTEGER,                        -- Image width (nullable)
    height INTEGER,                       -- Image height (nullable)
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_media_files_user_id ON media_files(user_id);
CREATE INDEX idx_media_files_tenant_id ON media_files(tenant_id);
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_files_created_at ON media_files(created_at DESC);
```

## Storage Structure

Files are stored in MinIO with the following path structure:

```
bgce-media/
├── 2024/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── 550e8400-e29b-41d4-a716-446655440000.jpg
│   │   │   ├── 550e8400-e29b-41d4-a716-446655440000_optimized.jpg
│   │   │   └── 661f9510-f3ac-52e5-b827-557766551111.pdf
│   │   └── 16/
│   │       └── ...
│   └── 02/
│       └── ...
└── 2025/
    └── ...
```

**Path Format**: `{year}/{month}/{day}/{uuid}{extension}`

**Benefits**:
- Organized by date for easy management
- UUID prevents filename collisions
- Supports file variants (original, optimized, thumbnail)

## Configuration

### Environment Variables

```bash
# Service
SERVICE_NAME=media
HTTP_PORT=8086
VERSION=1.0.0
MODE=debug

# Database
READ_DB_HOST=localhost
READ_DB_PORT=5432
READ_DB_NAME=bgce_archive
READ_DB_USER=postgres
READ_DB_PASSWORD=postgres

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=bgce-media
MINIO_USE_SSL=false

# Upload Limits
MAX_UPLOAD_SIZE_MB=50
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/ogg
ALLOWED_DOCUMENT_TYPES=application/pdf,application/msword

# Image Processing
ENABLE_IMAGE_OPTIMIZATION=true
THUMBNAIL_WIDTH=300
THUMBNAIL_HEIGHT=300
MAX_IMAGE_WIDTH=2048
MAX_IMAGE_HEIGHT=2048
```

## Error Handling

### Error Types

1. **Validation Errors** (400 Bad Request)
   - Invalid file type
   - File too large
   - Missing required fields

2. **Not Found Errors** (404 Not Found)
   - Media file not found
   - Invalid ID/UUID

3. **Storage Errors** (500 Internal Server Error)
   - MinIO connection failure
   - Upload failure
   - Download failure

4. **Database Errors** (500 Internal Server Error)
   - Connection failure
   - Query failure
   - Transaction failure

### Error Response Format

```json
{
  "status": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Security

### File Validation

1. **MIME Type Validation**: Only allowed types can be uploaded
2. **File Size Validation**: Configurable maximum size
3. **Extension Validation**: Verify file extension matches MIME type
4. **Content Validation**: Decode images to verify they're valid

### Storage Security

1. **UUID-based Paths**: Prevent path traversal attacks
2. **Bucket Policies**: Public read, authenticated write
3. **Signed URLs**: Optional time-limited access (future)

### Database Security

1. **Parameterized Queries**: Prevent SQL injection
2. **Connection Pooling**: Limit concurrent connections
3. **SSL Mode**: Optional encrypted connections

## Performance Optimizations

### Database

1. **Indexes**: On frequently queried columns (user_id, tenant_id, mime_type)
2. **Connection Pooling**: Reuse database connections
3. **Pagination**: Limit query results

### Storage

1. **Streaming**: Stream files instead of loading into memory
2. **CDN Integration**: Optional CDN for fast delivery
3. **Compression**: Automatic image optimization

### Caching (Future)

1. **Redis**: Cache frequently accessed metadata
2. **CDN**: Cache files at edge locations
3. **HTTP Caching**: ETag and Last-Modified headers

## Monitoring

### Metrics

1. **Upload Metrics**
   - Total uploads
   - Upload success rate
   - Average upload time
   - File size distribution

2. **Storage Metrics**
   - Total storage used
   - Storage by tenant
   - Storage by user

3. **Performance Metrics**
   - Request latency
   - Database query time
   - Storage operation time

### Logging

Structured JSON logs with:
- Timestamp
- Log level (INFO, WARN, ERROR)
- Message
- Context (user_id, file_path, etc.)

Example:
```json
{
  "time": "2024-01-15T10:00:00Z",
  "level": "INFO",
  "msg": "File uploaded successfully",
  "path": "2024/01/15/550e8400.jpg",
  "size": 245678,
  "mime_type": "image/jpeg"
}
```

## Testing Strategy

### Unit Tests

- Service layer business logic
- Repository layer database operations
- Storage layer MinIO operations
- Domain model methods

### Integration Tests

- End-to-end upload flow
- Database migrations
- MinIO bucket operations

### Load Tests

- Concurrent uploads
- Large file uploads
- High-frequency requests

## Deployment

### Docker

```bash
# Build image
docker build -t media-service:latest .

# Run container
docker run -d \
  -p 8086:8086 \
  --env-file .env \
  --name media-service \
  media-service:latest
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f media

# Stop services
docker-compose down
```

### Kubernetes (Future)

- Deployment with 3 replicas
- Horizontal Pod Autoscaler (HPA)
- Persistent Volume Claims (PVC) for MinIO
- ConfigMap for configuration
- Secret for sensitive data

## Future Enhancements

1. **Image Variants**
   - Automatic thumbnail generation
   - Multiple size variants
   - WebP conversion

2. **Video Processing**
   - Thumbnail extraction
   - Format conversion
   - Streaming support

3. **Advanced Features**
   - Facial recognition
   - Image tagging
   - Duplicate detection
   - Virus scanning

4. **Performance**
   - Redis caching
   - CDN integration
   - Async processing queue

5. **Security**
   - Signed URLs
   - Watermarking
   - Access control lists (ACL)

## References

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Go Best Practices](https://go.dev/doc/effective_go)
