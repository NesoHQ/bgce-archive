// Common API Response structure
export interface ApiResponse<T = any> {
    success: any
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
    last_login_at?: string
    meta?: Record<string, any>
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
    status?: string
    meta?: Record<string, any>
}

// Subcategory types (same as category but with parent_id required)
export interface Subcategory extends Category {
    parent_id: number
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

// Post types (matching postal service)
export interface Post {
    id: number
    uuid?: string
    title: string
    slug: string
    content: string
    summary?: string
    excerpt?: string
    thumbnail?: string
    category_id: number
    sub_category_id?: number
    meta_title?: string
    meta_description?: string
    keywords?: string
    og_image?: string
    status: 'draft' | 'published' | 'archived' | 'deleted' | 'pending'
    is_public: boolean
    is_featured: boolean
    is_pinned: boolean
    published_at?: string
    archived_at?: string
    created_by: number
    updated_by?: number
    view_count: number
    version: number
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface CreatePostRequest {
    title: string
    slug?: string
    content: string
    summary?: string
    excerpt?: string
    thumbnail?: string
    category_id: number
    sub_category_id?: number
    meta_title?: string
    meta_description?: string
    keywords?: string
    og_image?: string
    is_public?: boolean
    is_featured?: boolean
    is_pinned?: boolean
}

export interface UpdatePostRequest {
    title?: string
    slug?: string
    content?: string
    summary?: string
    excerpt?: string
    thumbnail?: string
    category_id?: number
    sub_category_id?: number
    meta_title?: string
    meta_description?: string
    keywords?: string
    og_image?: string
    is_public?: boolean
    is_featured?: boolean
    is_pinned?: boolean
}

export interface PostListResponse {
    status: boolean
    message: string
    data: Post[]
    meta: {
        total: number
        limit: number
        offset: number
    }
}

// Comment types
export interface Comment {
    id: number
    uuid: string
    post_id: number
    user_id?: number
    author_name: string
    author_email: string
    content: string
    status: 'pending' | 'approved' | 'rejected' | 'spam'
    parent_id?: number
    moderation_reason?: string
    created_at: string
    updated_at: string
}

export interface CreateCommentRequest {
    post_id: number
    author_name: string
    author_email: string
    content: string
    parent_id?: number
}

export interface UpdateCommentRequest {
    status?: 'pending' | 'approved' | 'rejected' | 'spam'
    moderation_reason?: string
}

// Moderation Strategy types
export interface ModerationStrategy {
    id: number
    name: string
    type: 'keyword' | 'ai' | 'manual' | 'auto_approve'
    enabled: boolean
    priority: number
    config: Record<string, any>
    created_at: string
    updated_at: string
}

export interface CreateModerationStrategyRequest {
    name: string
    type: 'keyword' | 'ai' | 'manual' | 'auto_approve'
    enabled: boolean
    priority: number
    config: Record<string, any>
}

export interface UpdateModerationStrategyRequest {
    name?: string
    enabled?: boolean
    priority?: number
    config?: Record<string, any>
}

// Support Ticket types
export interface SupportTicket {
    id: number
    uuid: string
    user_id?: number
    user_name: string
    user_email: string
    subject: string
    message: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    category: 'bug' | 'feature' | 'question' | 'feedback' | 'other'
    assigned_to?: number
    created_at: string
    updated_at: string
}

export interface CreateSupportTicketRequest {
    user_name: string
    user_email: string
    subject: string
    message: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    category?: 'bug' | 'feature' | 'question' | 'feedback' | 'other'
}

export interface UpdateSupportTicketRequest {
    status?: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    assigned_to?: number
}

export interface SupportTicketReply {
    id: number
    ticket_id: number
    user_id: number
    message: string
    is_staff: boolean
    created_at: string
}

export interface CreateSupportTicketReplyRequest {
    ticket_id: number
    message: string
}

// Category Filter
export interface CategoryFilter {
    status?: string
    parent_id?: number
    page?: number
    limit?: number
    search?: string
}

// Register Request
export interface RegisterRequest {
    username: string
    email: string
    password: string
    full_name?: string
}
