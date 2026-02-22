export interface Tenant {
    id: string
    uuid: string
    name: string
    slug: string
    domain?: string
    logo?: string
    status: 'active' | 'inactive' | 'suspended'
    plan: 'free' | 'starter' | 'professional' | 'enterprise'
    created_at: string
    updated_at: string
    settings?: TenantSettings
    stats?: TenantStats
}

export interface TenantSettings {
    theme?: {
        primary_color?: string
        logo_url?: string
        favicon_url?: string
    }
    features?: {
        comments_enabled?: boolean
        support_enabled?: boolean
        analytics_enabled?: boolean
    }
    limits?: {
        max_posts?: number
        max_users?: number
        max_storage_mb?: number
    }
}

export interface TenantStats {
    total_posts: number
    total_users: number
    total_categories: number
    storage_used_mb: number
}

export interface CreateTenantRequest {
    name: string
    slug: string
    domain?: string
    plan?: string
}

export interface UpdateTenantRequest {
    name?: string
    slug?: string
    domain?: string
    status?: string
    settings?: TenantSettings
}
