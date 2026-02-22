# Multi-Tenant CMS - Quick Reference

## 🚀 Quick Start

### Check Current Tenant
```typescript
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const currentTenant = tenantStore.currentTenant
```

### Switch Tenant
```typescript
await tenantStore.switchTenant(tenantId)
```

### Create Tenant
```typescript
const newTenant = await tenantStore.createTenant({
  name: 'My Organization',
  slug: 'my-org',
  domain: 'myorg.com',
  plan: 'professional'
})
```

## 📁 File Structure

```
archive-admin/
├── src/
│   ├── types/
│   │   └── tenant.ts                    # Tenant type definitions
│   ├── services/
│   │   └── tenantService.ts             # Tenant API service
│   ├── stores/
│   │   └── tenant.ts                    # Tenant state management
│   ├── components/
│   │   └── common/
│   │       ├── TenantSwitcher.vue       # Tenant dropdown
│   │       ├── TenantContextBanner.vue  # Context indicator
│   │       └── TenantRequired.vue       # No tenant placeholder
│   └── pages/
│       └── tenants/
│           ├── TenantsPage.vue          # Tenant list
│           └── TenantFormPage.vue       # Create/edit form
```

## 🎨 Components Usage

### TenantSwitcher
```vue
<template>
  <TenantSwitcher />
</template>
```

### TenantContextBanner
```vue
<template>
  <TenantContextBa