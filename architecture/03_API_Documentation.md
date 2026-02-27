# 03 | API Documentation

## Overview

This document provides a comprehensive reference for all REST APIs across BGCE Archive microservices. All APIs follow RESTful conventions with JSON request/response bodies.

**Base URL**: `https://api.bgce-archive.com` (production) or `http://localhost:{port}` (development)  
**Authentication**: JWT Bearer token in `Authorization` header  
**Content-Type**: `application/json`

---

## Authentication

All protected endpoints require a JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration**: 24 hours  
**Refresh**: Use `/api/v1/auth/refresh` endpoint

---

## Cortex Service (Port 8080)

### Authentication

#### Register User
```http
POST /api/v1/auth/register
```

**Request**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "viewer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/v1/auth/login
```

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "viewer",
    "created_at": "2026-02-27T10:00:00Z"
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer {expired_token}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Users

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "bio": "Go developer and open source contributor",
    "avatar_url": "https://cdn.bgce.com/avatars/johndoe.jpg",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev",
    "github_username": "johndoe",
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer {token}
```

**Request**:
```json
{
  "full_name": "John Doe",
  "bio": "Senior Go developer",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "github_username": "johndoe"
}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

#### Change Password
```http
POST /api/v1/users/change-password
Authorization: Bearer {token}
```

**Request**:
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Password changed successfully"
}
```

---

### Categories

#### List Categories
```http
GET /api/v1/categories
```

**Query Parameters**:
- `status` (optional): `pending`, `approved`, `rejected`
- `parent_id` (optional): Filter by parent category

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "slug": "concurrency",
      "label": "Concurrency",
      "description": "Goroutines, channels, and concurrent patterns",
      "icon": "zap",
      "color": "#3B82F6",
      "parent_id": null,
      "status": "approved",
      "created_at": "2026-02-01T10:00:00Z"
    }
  ]
}
```

#### Get Category by UUID
```http
GET /api/v1/categories/{uuid}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "concurrency",
    "label": "Concurrency",
    "description": "Goroutines, channels, and concurrent patterns",
    "subcategories": [
      {
        "id": 2,
        "slug": "goroutines",
        "label": "Goroutines"
      }
    ]
  }
}
```

#### Create Category
```http
POST /api/v1/categories
Authorization: Bearer {token}
```

**Request**:
```json
{
  "slug": "web-frameworks",
  "label": "Web Frameworks",
  "description": "HTTP servers, routers, and web frameworks",
  "icon": "globe",
  "color": "#10B981",
  "parent_id": null
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Category created successfully",
  "data": { /* category object */ }
}
```

#### Update Category
```http
PUT /api/v1/categories/{slug}
Authorization: Bearer {token}
```

**Request**:
```json
{
  "label": "Web Frameworks & Servers",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Category updated successfully",
  "data": { /* updated category */ }
}
```

#### Delete Category
```http
DELETE /api/v1/categories/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Category deleted successfully"
}
```

#### Approve Category
```http
POST /api/v1/categories/{id}/approve
Authorization: Bearer {token}
Requires: admin role
```

**Response** (200):
```json
{
  "status": true,
  "message": "Category approved successfully"
}
```

---

### Tenants

#### List Tenants
```http
GET /api/v1/tenants
Authorization: Bearer {token}
Requires: admin role
```

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "BGCE Archive",
      "slug": "bgce",
      "domain": "bgce-archive.com",
      "status": "active",
      "plan": "enterprise",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Tenant by Domain
```http
GET /api/v1/tenants/by-domain/{identifier}
```

**Example**: `/api/v1/tenants/by-domain/localhost`

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Local Development",
    "slug": "localhost",
    "domain": "localhost",
    "status": "active",
    "plan": "enterprise"
  }
}
```

#### Create Tenant
```http
POST /api/v1/tenants
Authorization: Bearer {token}
Requires: admin role
```

**Request**:
```json
{
  "name": "Acme Corp",
  "slug": "acme",
  "domain": "learn.acme.com",
  "plan": "professional"
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Tenant created successfully",
  "data": { /* tenant object */ }
}
```

---

## Postal Service (Port 8081)

### Posts

#### List Posts
```http
GET /api/v1/posts
```

**Query Parameters**:
- `status` (optional): `draft`, `published`, `archived`
- `category_id` (optional): Filter by category
- `is_featured` (optional): `true`, `false`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response** (200):
```json
{
  "status": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Understanding Go Channels",
        "slug": "understanding-go-channels",
        "summary": "A deep dive into Go channels and concurrent patterns",
        "thumbnail_url": "https://cdn.bgce.com/posts/channels.jpg",
        "category_id": 1,
        "status": "published",
        "is_featured": true,
        "view_count": 1523,
        "like_count": 42,
        "comment_count": 8,
        "published_at": "2026-02-20T10:00:00Z",
        "created_at": "2026-02-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

#### Get Post by ID
```http
GET /api/v1/posts/{id}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "Understanding Go Channels",
    "slug": "understanding-go-channels",
    "content": "# Introduction\n\nChannels are...",
    "summary": "A deep dive into Go channels",
    "thumbnail_url": "https://cdn.bgce.com/posts/channels.jpg",
    "category": {
      "id": 1,
      "slug": "concurrency",
      "label": "Concurrency"
    },
    "author": {
      "id": 5,
      "username": "gopher123",
      "full_name": "Jane Gopher"
    },
    "tags": ["channels", "concurrency", "goroutines"],
    "meta_title": "Understanding Go Channels - BGCE Archive",
    "meta_description": "Learn how to use Go channels effectively",
    "status": "published",
    "view_count": 1523,
    "like_count": 42,
    "comment_count": 8,
    "published_at": "2026-02-20T10:00:00Z",
    "created_at": "2026-02-15T10:00:00Z",
    "updated_at": "2026-02-21T14:30:00Z"
  }
}
```

#### Get Post by Slug
```http
GET /api/v1/posts/slug/{slug}
```

**Example**: `/api/v1/posts/slug/understanding-go-channels`

**Response**: Same as Get Post by ID

#### Create Post
```http
POST /api/v1/posts
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "Understanding Go Channels",
  "slug": "understanding-go-channels",
  "content": "# Introduction\n\nChannels are...",
  "summary": "A deep dive into Go channels",
  "thumbnail_url": "https://cdn.bgce.com/posts/channels.jpg",
  "category_id": 1,
  "sub_category_id": 2,
  "tags": ["channels", "concurrency"],
  "meta_title": "Understanding Go Channels",
  "meta_description": "Learn how to use Go channels",
  "status": "draft"
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Post created successfully",
  "data": { /* post object */ }
}
```

#### Update Post
```http
PUT /api/v1/posts/{id}
Authorization: Bearer {token}
```

**Request**: Same fields as Create Post

**Response** (200):
```json
{
  "status": true,
  "message": "Post updated successfully",
  "data": { /* updated post */ }
}
```

#### Delete Post
```http
DELETE /api/v1/posts/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Post deleted successfully"
}
```

#### Publish Post
```http
POST /api/v1/posts/{id}/publish
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Post published successfully",
  "data": { /* post with status=published */ }
}
```

#### Batch Upload Posts
```http
POST /api/v1/posts/batch
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request**: CSV file with columns: `title`, `slug`, `content`, `category_id`, etc.

**Response** (200):
```json
{
  "status": true,
  "message": "Batch upload completed",
  "data": {
    "total": 50,
    "success": 48,
    "failed": 2,
    "errors": [
      {
        "row": 15,
        "error": "Duplicate slug"
      }
    ]
  }
}
```

---

### Post Versions

#### List Post Versions
```http
GET /api/v1/posts/{id}/versions
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "version_no": 1,
      "title": "Understanding Go Channels",
      "edited_by": {
        "id": 5,
        "username": "gopher123"
      },
      "change_note": "Initial version",
      "created_at": "2026-02-15T10:00:00Z"
    },
    {
      "id": 2,
      "post_id": 1,
      "version_no": 2,
      "title": "Understanding Go Channels",
      "edited_by": {
        "id": 5,
        "username": "gopher123"
      },
      "change_note": "Fixed typos and added examples",
      "created_at": "2026-02-21T14:30:00Z"
    }
  ]
}
```

#### Get Specific Version
```http
GET /api/v1/posts/{id}/versions/{version}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "data": {
    "id": 1,
    "version_no": 1,
    "title": "Understanding Go Channels",
    "content": "# Introduction\n\n...",
    "created_at": "2026-02-15T10:00:00Z"
  }
}
```

#### Revert to Version
```http
POST /api/v1/posts/{id}/revert/{version}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Post reverted to version 1",
  "data": { /* post object */ }
}
```

---

### Tags

#### List Tags
```http
GET /api/v1/tags
```

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Channels",
      "slug": "channels",
      "usage_count": 42
    },
    {
      "id": 2,
      "name": "Concurrency",
      "slug": "concurrency",
      "usage_count": 89
    }
  ]
}
```

#### Create Tag
```http
POST /api/v1/tags
Authorization: Bearer {token}
```

**Request**:
```json
{
  "name": "Microservices",
  "slug": "microservices",
  "description": "Microservices architecture patterns"
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Tag created successfully",
  "data": { /* tag object */ }
}
```

---

## Community Service (Port 8082) - PLANNED

### Comments

#### List Comments for Post
```http
GET /api/v1/posts/{id}/comments
```

**Query Parameters**:
- `status` (optional): `pending`, `approved`, `rejected`, `spam`

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "user": {
        "id": 10,
        "username": "commenter1",
        "avatar_url": "https://cdn.bgce.com/avatars/commenter1.jpg"
      },
      "content": "Great article! Very helpful.",
      "status": "approved",
      "like_count": 5,
      "reply_count": 2,
      "created_at": "2026-02-22T10:00:00Z"
    }
  ]
}
```

#### Create Comment
```http
POST /api/v1/comments
Authorization: Bearer {token}
```

**Request**:
```json
{
  "post_id": 1,
  "content": "Great article! Very helpful.",
  "parent_id": null
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Comment created successfully",
  "data": { /* comment object */ }
}
```

#### Approve Comment
```http
POST /api/v1/comments/{id}/approve
Authorization: Bearer {token}
Requires: admin or editor role
```

**Response** (200):
```json
{
  "status": true,
  "message": "Comment approved successfully"
}
```

---

### Discussions

#### List Discussions
```http
GET /api/v1/discussions
```

**Query Parameters**:
- `category_id` (optional): Filter by category
- `status` (optional): `open`, `closed`, `locked`
- `sort` (optional): `recent`, `popular`, `unanswered`

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "How to handle errors in goroutines?",
      "slug": "how-to-handle-errors-in-goroutines",
      "user": {
        "id": 15,
        "username": "gopher_newbie"
      },
      "category": {
        "id": 1,
        "slug": "concurrency",
        "label": "Concurrency"
      },
      "status": "open",
      "upvote_count": 12,
      "comment_count": 5,
      "view_count": 234,
      "is_pinned": false,
      "last_activity_at": "2026-02-26T15:30:00Z",
      "created_at": "2026-02-25T10:00:00Z"
    }
  ]
}
```

#### Create Discussion
```http
POST /api/v1/discussions
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "How to handle errors in goroutines?",
  "content": "I'm struggling with error handling in concurrent code...",
  "category_id": 1
}
```

**Response** (201):
```json
{
  "status": true,
  "message": "Discussion created successfully",
  "data": { /* discussion object */ }
}
```

---

### Notifications

#### List Notifications
```http
GET /api/v1/notifications
Authorization: Bearer {token}
```

**Query Parameters**:
- `is_read` (optional): `true`, `false`

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "type": "comment",
      "title": "New comment on your post",
      "message": "gopher123 commented on 'Understanding Go Channels'",
      "link": "/posts/understanding-go-channels#comment-42",
      "is_read": false,
      "created_at": "2026-02-27T09:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```http
POST /api/v1/notifications/{id}/read
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Notification marked as read"
}
```

---

## Learning Service (Port 8083) - PLANNED

### Courses

#### List Courses
```http
GET /api/v1/courses
```

**Query Parameters**:
- `level` (optional): `beginner`, `intermediate`, `advanced`
- `topic` (optional): Filter by topic
- `is_free` (optional): `true`, `false`

**Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "Go Fundamentals",
      "slug": "go-fundamentals",
      "description": "Learn Go from scratch",
      "thumbnail_url": "https://cdn.bgce.com/courses/go-fundamentals.jpg",
      "level": "beginner",
      "topic": "Basics",
      "duration_hours": 10,
      "rating": 4.8,
      "students_count": 1523,
      "price": "Free",
      "is_free": true,
      "instructor": {
        "id": 5,
        "username": "gopher_teacher"
      }
    }
  ]
}
```

#### Enroll in Course
```http
POST /api/v1/courses/{id}/enroll
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "status": true,
  "message": "Enrolled successfully",
  "data": {
    "enrollment_id": 42,
    "course_id": 1,
    "progress": 0
  }
}
```

---

## Media Service (Port 8086) - PLANNED

### Media Upload

#### Upload File
```http
POST /api/v1/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request**: Form data with `file` field

**Response** (201):
```json
{
  "status": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "filename": "channels-diagram.png",
    "file_url": "https://cdn.bgce.com/media/channels-diagram.png",
    "mime_type": "image/png",
    "file_size": 245678,
    "width": 1920,
    "height": 1080
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

---

## Rate Limiting

**Limits**:
- Authenticated users: 1000 requests/hour
- Unauthenticated users: 100 requests/hour

**Headers**:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1709035200
```

---

## Pagination

List endpoints support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Owner**: API Team
