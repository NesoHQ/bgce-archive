# Tenant Module

This module implements multi-tenant functionality for the Cortex service.

## Overview

The tenant module provides domain-based multi-tenancy where each tenant is automatically identified by the domain or subdomain being accessed.

## Database Schema

Run the migration to create the tenants table:

```bash
psql -U your_user -d your_database -f migrations/001_create_tenants_table.sql
```

Or if using ent migrations, the schema will be auto-created.

## API Endpoints

### Public Endpoints

#### Get Tenant by Domain
```
GET /api/v1/tenants/by-domain/{identifier}
```

Returns tenant information based on domain or slug identifier.

**Parameters:**
- `identifier`: Domain (e.g., "localhost", "example.com") or slug (e.g., "tenant1")

**Response:**
```json
{
  "message": "Tenant retrieved successfully",
  "status": true,
  "data": {
    "id": 1,
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Local Development",
    "slug": "localhost",
    "domain": "localhost",
    "status": "active",
    "plan": "enterprise",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Protected Endpoints (Require Authentication)

#### List All Tenants
```
GET /api/v1/tenants
Authorization: Bearer {token}
```

#### Create Tenant
```
POST /api/v1/tenants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Tenant",
  "slug": "my-tenant",
  "domain": "mytenant.com",
  "plan": "professional"
}
```

#### Update Tenant
```
PUT /api/v1/tenants/{uuid}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active",
  "plan": "enterprise"
}
```

#### Delete Tenant
```
DELETE /api/v1/tenants/{uuid}
Authorization: Bearer {token}
```

## Usage

### For Development (Localhost)

The system automatically creates a default "localhost" tenant. When accessing `http://localhost:8080`, the API will return the localhost tenant.

### For Production

#### Subdomain-based Tenancy

1. Create tenants with slugs matching subdomains:
```bash
curl -X POST http://localhost:8080/api/v1/tenants \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client A",
    "slug": "client-a",
    "plan": "professional"
  }'
```

2. Access via subdomain:
```
http://client-a.yourapp.com
```

#### Custom Domain Tenancy

1. Create tenant with custom domain:
```bash
curl -X POST http://localhost:8080/api/v1/tenants \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client B",
    "slug": "client-b",
    "domain": "clientb.com",
    "plan": "enterprise"
  }'
```

2. Configure DNS to point to your server

3. Access via custom domain:
```
http://clientb.com
```

## Plans

- **free**: Basic features
- **starter**: For small teams
- **professional**: Advanced features
- **enterprise**: Full access

## Status

- **active**: Tenant is operational
- **inactive**: Tenant is temporarily disabled
- **suspended**: Tenant is suspended (e.g., payment issues)

## Integration with Frontend

The frontend automatically detects the tenant from `window.location.hostname` and calls:

```javascript
GET /api/v1/tenants/by-domain/{hostname}
```

This returns the tenant configuration which is then used for all subsequent API calls.

## Testing

### Test Localhost Tenant

```bash
curl http://localhost:8080/api/v1/tenants/by-domain/localhost
```

### Test Creating a Tenant

```bash
curl -X POST http://localhost:8080/api/v1/tenants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tenant",
    "slug": "test-tenant",
    "plan": "starter"
  }'
```

### Test Getting All Tenants

```bash
curl http://localhost:8080/api/v1/tenants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- The `by-domain` endpoint is public (no auth required) to allow initial tenant detection
- All other tenant management endpoints require authentication
- Tenant slugs must be unique and URL-friendly (lowercase, hyphens only)
- Domain field is optional - used for custom domain tenancy
