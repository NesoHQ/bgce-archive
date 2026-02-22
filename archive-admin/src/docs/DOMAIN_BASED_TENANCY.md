# Domain-Based Multi-Tenancy

## Overview

The Archive Admin now implements **domain-based multi-tenancy**, where the tenant is automatically determined by the domain or subdomain being accessed. This eliminates the need for manual tenant switching and provides a seamless experience.

## How It Works

### Automatic Tenant Detection

The system automatically detects the current tenant based on the URL:

1. **Localhost Development**: `localhost` or `127.0.0.1` → Uses "localhost" as tenant identifier
2. **Subdomain-based**: `tenant1.example.com` → Uses "tenant1" as identifier
3. **Custom Domain**: `customdomain.com` → Uses "customdomain.com" as identifier

### Tenant Resolution Flow

```
User accesses URL
    ↓
System extracts domain/subdomain
    ↓
API call to /api/tenants/by-domain/{identifier}
    ↓
Tenant data loaded
    ↓
All content scoped to this tenant
```

## Key Changes from Manual Switching

### What Changed

1. **No Tenant Switcher** - Removed from sidebar (tenant is domain-based)
2. **Automatic Detection** - Tenant loaded on app initialization
3. **Domain-Scoped** - Each domain/subdomain has its own tenant
4. **Admin View** - Tenants page is for super-admins to manage all tenants

### What Stayed the Same

1. **Tenant Management** - Admins can still create/edit/delete tenants
2. **Data Isolation** - Each tenant's data remains completely isolated
3. **Plan Support** - Free, Starter, Professional, Enterprise plans
4. **All Features** - Posts, categories, comments, support tickets all work the same

## Configuration

### For Localhost Development

By default, localhost uses a tenant identifier of "localhost". Your backend should:

1. Have a default tenant with slug/domain "localhost"
2. Return this tenant when `/api/tenants/by-domain/localhost` is called

### For Production

#### Subdomain-based Tenancy

```
tenant1.yourapp.com → Tenant: tenant1
tenant2.yourapp.com → Tenant: tenant2
admin.yourapp.com   → Tenant: admin
```

Backend should:
- Extract subdomain from request
- Look up tenant by slug matching subdomain
- Return tenant data

#### Custom Domain Tenancy

```
client1.com → Tenant with domain: client1.com
client2.com → Tenant with domain: client2.com
```

Backend should:
- Extract full domain from request
- Look up tenant by custom domain field
- Return tenant data

## Backend API Requirements

### New Endpoint

```
GET /api/tenants/by-domain/:identifier
```

**Parameters:**
- `identifier`: Domain or subdomain string

**Response:**
```json
{
  "id": "uuid",
  "uuid": "uuid",
  "name": "Tenant Name",
  "slug": "tenant-slug",
  "domain": "custom-domain.com",
  "status": "active",
  "plan": "professional",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "settings": {},
  "stats": {
    "total_posts": 10,
    "total_users": 5,
    "total_categories": 3,
    "storage_used_mb": 100
  }
}
```

### Existing Endpoints

All existing endpoints should respect tenant context:
- Extract tenant from domain/subdomain
- Scope all queries to that tenant
- Return only tenant-specific data

## User Experience

### Regular Users

1. Access their tenant's domain (e.g., `mytenant.yourapp.com`)
2. Login with credentials
3. See only their tenant's content
4. No tenant selection needed

### Super Admins

1. Access admin domain (e.g., `admin.yourapp.com`)
2. Login with admin credentials
3. See "Tenants" menu item in sidebar
4. Can view/manage all tenants
5. Can create new tenants with custom domains

## Tenant Management (Admin Only)

### Creating a Tenant

1. Navigate to **Tenants** page
2. Click **"Create Tenant"**
3. Fill in:
   - Name: Display name
   - Slug: URL-friendly identifier (for subdomains)
   - Domain: Custom domain (optional)
   - Plan: Subscription level
4. Click **"Create Tenant"**

### Accessing a Tenant

After creating a tenant:
- **Subdomain**: Access at `{slug}.yourapp.com`
- **Custom Domain**: Access at `{domain}`
- **Localhost**: Configure backend to return tenant for localhost

## Development Setup

### 1. Backend Configuration

Create a default tenant for localhost:

```sql
INSERT INTO tenants (name, slug, domain, status, plan)
VALUES ('Local Development', 'localhost', 'localhost', 'active', 'enterprise');
```

### 2. Frontend Configuration

No configuration needed - automatically detects localhost.

### 3. Testing Different Tenants Locally

Option A: Use hosts file
```
# /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
```

Then access:
- `http://tenant1.localhost:5173`
- `http://tenant2.localhost:5173`

Option B: Use different ports with proxy
- Configure backend to map ports to tenants
- Access different ports for different tenants

## Deployment

### DNS Configuration

#### Subdomain-based

1. Create wildcard DNS record:
   ```
   *.yourapp.com → Your server IP
   ```

2. Configure web server (nginx/apache) to handle subdomains

3. Backend extracts subdomain and loads tenant

#### Custom Domain

1. Each tenant configures their DNS:
   ```
   customdomain.com → Your server IP
   ```

2. Backend checks domain against tenant records

3. Returns appropriate tenant data

### Environment Variables

```env
# Backend
MULTI_TENANT_MODE=subdomain  # or 'domain' or 'both'
DEFAULT_TENANT=localhost
ALLOW_TENANT_CREATION=true

# Frontend
VITE_API_URL=https://api.yourapp.com
VITE_TENANT_MODE=auto  # auto-detect from domain
```

## Security Considerations

### Data Isolation

- All database queries MUST include tenant filter
- Use middleware to inject tenant context
- Validate tenant access on every request

### Cross-Tenant Access

- Prevent users from accessing other tenants' data
- Validate tenant ownership on all operations
- Log cross-tenant access attempts

### Admin Access

- Super admins can view all tenants
- Regular admins only see their tenant
- Implement role-based access control

## Troubleshooting

### "Failed to load tenant" Error

**Cause**: Backend can't find tenant for current domain

**Solutions**:
1. Check if tenant exists in database
2. Verify domain/slug matches
3. Check backend logs for errors
4. Ensure API endpoint is correct

### Wrong Tenant Loaded

**Cause**: Domain detection logic issue

**Solutions**:
1. Check browser URL
2. Verify DNS configuration
3. Check backend tenant resolution
4. Clear browser cache

### Localhost Not Working

**Cause**: No default tenant for localhost

**Solutions**:
1. Create tenant with slug "localhost"
2. Configure backend to return default tenant
3. Check API response in browser console

## Migration from Manual Switching

If you had the manual tenant switching version:

1. **No data migration needed** - All data structures remain the same
2. **Update backend** - Add `/api/tenants/by-domain/:identifier` endpoint
3. **Configure DNS** - Set up subdomains or custom domains
4. **Test** - Verify each tenant loads correctly from its domain

## Best Practices

1. **Use Subdomains for SaaS** - Easier to manage, consistent branding
2. **Use Custom Domains for White-Label** - Each client has their own domain
3. **Implement Caching** - Cache tenant lookups to reduce database queries
4. **Monitor Performance** - Track tenant resolution time
5. **Log Everything** - Log tenant access for debugging and analytics

## Example Scenarios

### Scenario 1: SaaS Platform

```
acme-corp.yourapp.com     → Acme Corp tenant
tech-startup.yourapp.com  → Tech Startup tenant
enterprise.yourapp.com    → Enterprise tenant
```

Each company accesses their own subdomain and sees only their data.

### Scenario 2: White-Label Solution

```
acmecorp.com    → Acme Corp tenant (custom domain)
techstart.io    → Tech Startup tenant (custom domain)
enterprise.biz  → Enterprise tenant (custom domain)
```

Each client uses their own domain with your platform.

### Scenario 3: Hybrid Approach

```
client1.yourapp.com  → Client 1 (subdomain)
client2.com          → Client 2 (custom domain)
client3.yourapp.com  → Client 3 (subdomain)
```

Mix of subdomains and custom domains based on client needs.

## Summary

Domain-based multi-tenancy provides:
- ✅ Automatic tenant detection
- ✅ No manual switching needed
- ✅ Clean, professional URLs
- ✅ Better security (domain-scoped)
- ✅ Easier for end users
- ✅ Scalable architecture

The tenant is determined by the URL, making it transparent to users while maintaining complete data isolation between tenants.
