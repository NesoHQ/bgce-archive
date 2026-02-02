// Common API Response structure
export interface ApiResponse<T = any> {
    status: boolean
    message: string
    data: T
}

// Pagination
export interface PaginationParams {
    page?: number
    limit?: number
    offset?: number
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
}

// User types
export interface User {
    id: number
    uuid: string
    username: string
    email: string
    full_name?: string
    role: 'admin' | 'editor' | 'viewer'
    status: 'active' | 'inactive' | 'suspended'
    created_at: string
    updated_at: string
    meta?: Record<string, any>
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    full_name?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: User
}

export interface UpdateUserRequest {
    username?: string
    email?: string
    full_name?: string
}

export interface ChangePasswordRequest {
    old_password: string
    new_password: string
}

// Category types
export interface Category {
    id: number
    uuid: string
    slug: string
    label: string
    description?: string
    parent_id?: number
    creator_id?: number
    created_by: number
    updated_by?: number
    approved_by?: number
    deleted_by?: number
    approved_at?: string
    deleted_at?: string
    status: 'pending' | 'approved' | 'rejected' | 'deleted'
    meta?: Record<string, any>
    created_at: string
    updated_at: string
}

export interface CreateCategoryRequest {
    slug: string
    label: string
    description?: string
    meta?: Record<string, any>
}

export interface UpdateCategoryRequest {
    label?: string
    description?: string
    meta?: Record<string, any>
}

export interface CategoryFilter {
    status?: string
    search?: string
    page?: number
    limit?: number
}

// Subcategory types
export interface Subcategory {
    id: number
    uuid: string
    slug: string
    label: string
    description?: string
    parent_id: number
    creator_id?: number
    created_by: number
    updated_by?: number
    status: 'pending' | 'approved' | 'rejected' | 'deleted'
    meta?: Record<string, any>
    created_at: string
    updated_at: string
}

export interface CreateSubcategoryRequest {
    slug: string
    label: string
    description?: string
    parent_id: number
    meta?: Record<string, any>
}

export interface UpdateSubcategoryRequest {
    label?: string
    description?: string
    meta?: Record<string, any>
}
