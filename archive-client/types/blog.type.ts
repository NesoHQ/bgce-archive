export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Article {
  id: number; // Needed for key in lists
  slug?: string; // Add slug for linking
  title: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    badgeColor: string;
  };
  publishedAt: string; // New field
  views: number; // New field
  votes: number; // New field
  description: string;
  tags: string[]; // New field
  date: string;
  category_id?: number; // Add for filtering
  subcategory_id?: number; // Add for filtering
}

// API Response Types
export interface ApiCategory {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  label: string;
  slug: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected' | 'deleted';
  parent_id?: number | null; // Optional because of omitempty in backend
  creator_id: number;
  meta: Record<string, any> | null;
}

export interface ApiSubcategory {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  label: string;
  slug: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected' | 'deleted';
  parent_id: number;
  creator_id: number;
  meta: Record<string, any> | null;
}

// Post Types (from Postal service)
export interface ApiPost {
  id: number;
  uuid?: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  thumbnail?: string;
  category_id: number;
  sub_category_id?: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_image?: string;
  status: 'draft' | 'published' | 'archived' | 'deleted';
  is_public: boolean;
  is_featured: boolean;
  is_pinned: boolean;
  published_at?: string;
  archived_at?: string;
  created_by: number;
  updated_by?: number;
  view_count: number;
  read_time: number;
  version: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Lighter response for list endpoints
export interface ApiPostListItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  meta_description?: string;
  keywords?: string;
  category_id: number;
  sub_category_id?: number;
  is_featured: boolean;
  is_pinned: boolean;
  created_by: number;
  view_count: number;
  read_time: number;
  content_length: number; // For read time calculation
  created_at: string;
}

export interface ApiPostListResponse {
  status: boolean;
  message: string;
  data: ApiPostListItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
