# Multi-Tenant CMS Manager - Implementation Guide

## Overview

The Archive Admin UI has been upgraded to function as a multi-tenant CMS manager. This allows users to manage multiple tenant organizations from a single interface, with each tenant having its own isolated content, categories, posts, comments, and support tickets.

## Key Features

### 1. Tenant Management
- **Tenant Switcher**: Quick dropdown in the sidebar to switch between tenants
- **Tenant Dashboard**: Dedicated page to view and manage all tenants
- **Tenant CRUD**: Create, read, update, and delete tenant organizations
- **Tenant Context**: Visual indicators showing which tenant is currently active

### 2. Multi-Tenant Architecture
- **Isolated Data**: Each tenant's data is completely isolated
- **Tenant-Scoped Operations**: All API calls include tenant context
- **Plan-Based Features**: Different subscription plans (Free, Starter, Professional, Enterprise)
- **Custom Domains**: Support for tenant-specific custom domains

### 3. UI Enhancements
- **Tenant Context Banner**: Shows current tenant in relevant pages
- **Plan Badges**: Visual indicators for tenant subscription plans
- **Tenant Stats**: Quick overview of tenant metrics
- **Tenant Switcher**: Easy navigation between tenants

## New Components

### 1. TenantSwitcher.vue
Location: `src/components/common/TenantSwitcher.vue`

Dropdown component in the sidebar that allows users to:
- View all active tenants
- Switch between tenants
- Create new tenants
- Navigate to tenant management

### 2. TenantContextBanner.vue
Location: `src/components/common/TenantContextBanner.vue`

Banner component that displays:
- Current tenant information
- Tenant plan badge
- Quick switch button
- Warning when no tenant is selected

### 3. TenantsPage.vue
Location: `src/pages/tenants/TenantsPage.vue`

Main tenant management page featuring:
- Grid view of all tenants
- Search and filter functionality
- Tenant cards with stats
- Quick actions (edit, delete, switch)

### 4. TenantFormPage.vue
Location: `src/pages/tenants/TenantFormPage.vue`

Form for creating and editing tenants:
- Tenant name and slug
- Custom domain configuration
- Plan selection
- Form validation

## New Store

### Tenant Store
Location: `src/stores/tenant.ts`

State management for tenants:
- `tenants`: Array of all tenants
- `currentTenant`: Currently active tenant
- `loading`: Loading state

Actions:
- `fetchTenants()`: Load all tenants
- `switchTenant(id)`: Switch to a different tenant
- `createTenant(data)`: Create new tenant
- `updateTenant(id, data)`: Update tenant
- `deleteTenant(id)`: Delete tenant

## New Service

### Tenant Service
Location: `src/services/tenantService.ts`

API integration for tenant operations:
- `getTenants()`: Fetch all tenants
- `getTenantById(id)`: Get single tenant
- `createTenant(data)`: Create tenant
- `updateTenant(id, data)`: Update tenant
- `deleteTenant(id)`: Delete tenant
- `switchTenant(id)`: Switch active tenant
- `getTenantStats(id)`: Get tenant statistics

## Type Definitions

### Tenant Types
Location: `src/types/tenant.ts`

```typescript
interface Tenant {
  id: string
  uuid: string
  name: string
  slug: string
  domain?: string
  status: 'active' | 'inactive' | 'suspended'
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
  settings?: TenantSettings
  stats?: TenantStats
}
```

## Updated Components

### 1. DashboardSidebar.vue
- Added TenantSwitcher component
- Added "Tenants" menu item
- Added tenant context information panel
- Updated styling for multi-tenant context

### 2. DashboardHeader.vue
- Added tenant context badge in header
- Shows current tenant name
- Quick link to tenant management

### 3. DashboardPage.vue
- Added tenant context banner
- Shows current tenant information
- Displays tenant plan badge
- Shows total tenant count

### 4. MainLayout.vue
- No changes required (maintains existing structure)

## Routes

New routes added to `src/router/routes.ts`:

```typescript
{
  path: 'tenants',
  name: 'tenants',
  component: TenantsPage,
  meta: { requiresAuth: true, title: 'Tenants' },
},
{
  path: 'tenants/new',
  name: 'tenant-create',
  component: TenantFormPage,
  meta: { requiresAuth: true, title: 'Create Tenant' },
},
{
  path: 'tenants/:id/edit',
  name: 'tenant-edit',
  component: TenantFormPage,
  meta: { requiresAuth: true, title: 'Edit Tenant' },
}
```

## Initialization

Updated `src/main.ts` to initialize tenant store:

```typescript
const tenantStore = useTenantStore()

// Initialize tenants if user is authenticated
if (authStore.isAuthenticated) {
  tenantStore.fetchTenants()
}
```

## Usage Guide

### For Users

1. **Login**: Authenticate with your credentials
2. **Select Tenant**: Use the tenant switcher in the sidebar
3. **Manage Content**: All content operations are scoped to the selected tenant
4. **Switch Tenants**: Click the tenant switcher to change context
5. **Create Tenants**: Navigate to Tenants page and click "Create Tenant"

### For Developers

1. **Tenant Context**: Always check `tenantStore.currentTenant` before operations
2. **API Calls**: Tenant context is automatically included in API headers
3. **Scoped Data**: All stores fetch data for the current tenant
4. **Tenant Switching**: Triggers a page reload to refresh all data

## Backend Integration

The frontend expects the following API endpoints:

```
GET    /api/tenants              - List all tenants
GET    /api/tenants/:id          - Get tenant by ID
POST   /api/tenants              - Create tenant
PUT    /api/tenants/:id          - Update tenant
DELETE /api/tenants/:id          - Delete tenant
POST   /api/tenants/:id/switch   - Switch active tenant
GET    /api/tenants/:id/stats    - Get tenant statistics
```

All other API endpoints should respect the tenant context from headers or session.

## Best Practices

1. **Always Show Context**: Use TenantContextBanner on pages with tenant-specific data
2. **Validate Tenant**: Check if tenant is selected before operations
3. **Clear Indication**: Use badges and colors to show tenant status and plan
4. **Easy Switching**: Make tenant switching accessible from multiple places
5. **Isolated Data**: Ensure all operations are scoped to current tenant

## Migration Notes

### Existing Features Preserved
- All existing functionality remains intact
- No breaking changes to existing components
- Backward compatible with single-tenant usage
- Existing routes and navigation work as before

### New Capabilities
- Multi-tenant support added as an enhancement
- Tenant management is optional (can work with single tenant)
- Graceful handling when no tenant is selected
- Automatic tenant initialization on login

## Future Enhancements

Potential improvements for the multi-tenant system:

1. **Tenant Invitations**: Invite users to specific tenants
2. **Role-Based Access**: Different permissions per tenant
3. **Tenant Analytics**: Detailed usage statistics per tenant
4. **Billing Integration**: Subscription management per tenant
5. **Tenant Themes**: Custom branding per tenant
6. **Tenant Settings**: Advanced configuration options
7. **Tenant Backup**: Export/import tenant data
8. **Tenant Cloning**: Duplicate tenant configuration

## Troubleshooting

### No Tenants Showing
- Check if user is authenticated
- Verify API endpoint is returning data
- Check browser console for errors

### Tenant Switch Not Working
- Ensure backend supports tenant switching
- Check if tenant ID is valid
- Verify API response includes updated context

### Data Not Scoped to Tenant
- Verify tenant context is sent in API headers
- Check backend tenant isolation logic
- Ensure current tenant is set in store

## Support

For issues or questions about the multi-tenant implementation:
1. Check this guide first
2. Review component documentation
3. Check API integration
4. Verify backend tenant support
