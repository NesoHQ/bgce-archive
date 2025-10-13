# Subcategory API Documentation

## Overview
This document describes the complete subcategory API implementation for the Cortex service. The API provides full CRUD operations for managing subcategories, which are categories that have a parent category.

## API Endpoints

### 1. Create Subcategory
**POST** `/api/v1/sub-categories`

Creates a new subcategory under a specified parent category.

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "slug": "web-development",
  "name": "Web Development",
  "description": "All about web development technologies",
  "parent_uuid": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**
```json
{
  "message": "Subcategory created successfully",
  "status": 201,
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or missing required fields
- `401 Unauthorized`: Missing or invalid JWT token
- `409 Conflict`: Subcategory with this slug already exists
- `500 Internal Server Error`: Server error

### 2. Get Subcategory List
**GET** `/api/v1/sub-categories?parent_uuid=<uuid>`

Retrieves a list of subcategories for a specific parent category.

**Query Parameters:**
- `parent_uuid` (required): UUID of the parent category
- `limit` (optional): Maximum number of results to return
- `offset` (optional): Number of results to skip
- `sort_by` (optional): Field to sort by (created_at, label, slug)
- `sort_order` (optional): Sort order (asc, desc)
- `status` (optional): Filter by status (pending, approved, rejected, deleted)
- `id` (optional): Filter by specific ID
- `uuid` (optional): Filter by specific UUID
- `slug` (optional): Filter by specific slug
- `label` (optional): Filter by specific label

**Response:**
```json
{
  "message": "Subcategories retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 1,
      "parent_id": 5,
      "uuid": "123e4567-e89b-12d3-a456-426614174001",
      "slug": "web-development",
      "label": "Web Development",
      "description": "All about web development technologies",
      "created_by": 1,
      "updated_by": null,
      "approved_by": null,
      "deleted_by": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "approved_at": null,
      "deleted_at": null,
      "status": "pending",
      "meta": {}
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parent_uuid format or missing parent_uuid parameter
- `500 Internal Server Error`: Server error

### 3. Get Subcategory by ID
**GET** `/api/v1/sub-categories/{id}`

Retrieves a specific subcategory by its ID or UUID.

**Path Parameters:**
- `id`: Subcategory ID (integer) or UUID (string)

**Response:**
```json
{
  "message": "Subcategory retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "parent_id": 5,
    "uuid": "123e4567-e89b-12d3-a456-426614174001",
    "slug": "web-development",
    "label": "Web Development",
    "description": "All about web development technologies",
    "created_by": 1,
    "updated_by": null,
    "approved_by": null,
    "deleted_by": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "approved_at": null,
    "deleted_at": null,
    "status": "pending",
    "meta": {}
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format or category is not a subcategory
- `404 Not Found`: Subcategory not found
- `500 Internal Server Error`: Server error

### 4. Update Subcategory
**PUT** `/api/v1/sub-categories/{id}`

Updates an existing subcategory.

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)
- `Content-Type: application/json`

**Path Parameters:**
- `id`: Subcategory UUID

**Request Body:**
```json
{
  "slug": "updated-web-development",
  "label": "Updated Web Development",
  "description": "Updated description",
  "status": "approved",
  "meta": {
    "custom_field": "custom_value"
  }
}
```

**Response:**
```json
{
  "message": "Subcategory updated successfully",
  "status": 200,
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Subcategory not found
- `409 Conflict`: Subcategory with this slug already exists
- `500 Internal Server Error`: Server error

### 5. Delete Subcategory
**DELETE** `/api/v1/sub-categories/{id}`

Soft deletes a subcategory (sets status to "deleted").

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)

**Path Parameters:**
- `id`: Subcategory UUID

**Response:**
```json
{
  "message": "Subcategory deleted successfully",
  "status": 200,
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Subcategory not found
- `500 Internal Server Error`: Server error

## Implementation Details

### Service Layer
The subcategory functionality is implemented in the `cortex/category` package with the following methods:

1. **CreateSubcategory**: Creates a new subcategory with parent validation
2. **GetSubcategoriesByParentID**: Retrieves subcategories filtered by parent UUID
3. **UpdateSubcategory**: Updates subcategory with slug uniqueness validation
4. **DeleteSubcategory**: Soft deletes a subcategory

### Data Transfer Objects (DTOs)
- `CreateSubcategoryParams`: Parameters for creating subcategories
- `UpdateSubcategoryParams`: Parameters for updating subcategories
- `GetSubcategoryFilter`: Filtering options for subcategory queries

### Handler Layer
All REST endpoints are implemented in the `cortex/rest/handlers` package:

1. **CreateSubcategory**: Handles subcategory creation requests
2. **GetSubCategoryList**: Handles subcategory listing requests
3. **GetSubCategoryByID**: Handles individual subcategory retrieval
4. **UpdateSubCategory**: Handles subcategory update requests
5. **DeleteSubCategory**: Handles subcategory deletion requests

### Validation
- Slug uniqueness validation across all categories
- Parent category existence validation
- JWT authentication for protected endpoints
- Input validation using the utils.Validate function

### Error Handling
- Custom error types for different scenarios
- Proper HTTP status codes
- Detailed error messages for debugging

## Testing

To test the API endpoints:

1. Start the required services (PostgreSQL, Redis, RabbitMQ)
2. Set the required environment variables
3. Run the server: `./cortex rest --port 3345`
4. Use the provided test script: `./test_api.sh`

## Notes

- All subcategory operations require a valid parent category
- Subcategories are identified by having a non-zero `parent_id`
- Soft deletion is implemented (status set to "deleted")
- JWT authentication is required for create, update, and delete operations
- The API follows RESTful conventions and returns consistent JSON responses
