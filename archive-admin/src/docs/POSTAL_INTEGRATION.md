# Postal Service Integration - Archive Admin

## Overview
The archive-admin application is now fully integrated with the Postal microservice for managing archive posts.

## Configuration

### Environment Variables
Add to `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1          # Cortex (Auth, Categories)
VITE_POSTAL_API_BASE_URL=http://localhost:8081/api/v1   # Postal (Posts)
```

### API Configuration
Located in `src/config/api.config.ts`:
- `USE_MOCK_POSTS = false` - Now using real Postal API
- Separate base URLs for Cortex and Postal services

## Architecture

### Services
- **postalApi.ts** - Dedicated axios client for Postal service
  - Automatic JWT token injection from localStorage
  - Error handling and toast notifications
  - Shares authentication with Cortex

- **postService.ts** - Post API methods
  - `getPosts()` - List posts with filters
  - `getPostById()` - Get single post
  - `getPostBySlug()` - Get post by URL slug
  - `createPost()` - Create new post
  - `updatePost()` - Update existing post
  - `publishPost()` - Publish draft
  - `unpublishPost()` - Unpublish published post
  - `archivePost()` - Archive post
  - `deletePost()` - Soft delete post

### Store
**usePostStore** (`src/stores/post.ts`):
- State management for posts
- Actions for all CRUD operations
- Automatic toast notifications
- Loading and error states

### Types
**Post Interface** (`src/types/api.ts`):
```typescript
interface Post {
  id: number
  title: string
  slug: string
  content: string
  summary?: string
  thumbnail?: string
  category_id: number
  sub_category_id?: number
  meta_title?: string
  meta_description?: string
  keywords?: string
  og_image?: string
  status: 'draft' | 'published' | 'archived' | 'deleted'
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
}
```

## UI Components

### Pages

#### PostListPage (`src/pages/posts/PostListPage.vue`)
- Lists all posts with filtering
- Status filter: All, Draft, Published, Archived
- Search by title
- Actions: Edit, Publish, Unpublish, Archive, Delete

#### PostEditorPage (`src/pages/posts/PostEditorPage.vue`)
Comprehensive post editor with sections:

**Content Section:**
- Title (auto-generates slug)
- Slug (URL-friendly identifier)
- Summary (brief description)
- Content (Markdown/HTML)

**SEO Section:**
- Meta Title
- Meta Description
- Keywords (comma-separated)
- OG Image URL (for social sharing)

**Classification Section:**
- Category (required, dropdown)
- Subcategory (optional, filtered by category)

**Featured Image:**
- Thumbnail URL
- Live preview

**Visibility Controls:**
- Public (visible to everyone)
- Featured (show in featured section)
- Pinned (pin to top of list)

### Components

#### PostTableRow (`src/components/posts/PostTableRow.vue`)
- Displays post in table format
- Status badges with icons
- Shows pinned/featured badges
- Context menu with actions based on status

#### PostFilters (`src/components/posts/PostFilters.vue`)
- Search input
- Status filter tabs with counts
- Reusable across pages

### UI Components Created
- **Textarea** (`src/components/ui/textarea/`) - Multi-line text input
- **Switch** (`src/components/ui/switch/`) - Toggle switch for boolean values

## Post Lifecycle

```
DRAFT → PUBLISHED → ARCHIVED
  ↑         ↓          ↓
  └─────────┴──────────┘
         (Edit)
```

### Status Transitions
- **Draft**: Initial state, can be edited and published
- **Published**: Live and visible to public (if is_public=true)
- **Archived**: Hidden but preserved, can be restored
- **Deleted**: Soft deleted, can be recovered

### Available Actions by Status

**Draft:**
- Edit
- Publish
- Delete

**Published:**
- Edit
- Unpublish (back to draft)
- Archive
- Delete

**Archived:**
- Edit
- Restore & Publish
- Delete

## Authentication Flow

1. User logs in via Cortex (`/api/v1/auth/login`)
2. JWT token stored in localStorage
3. Token automatically included in all Postal API requests
4. Postal validates token using same JWT secret as Cortex
5. User info extracted from token (ID, username, email, role)

## API Endpoints

### Public Endpoints
- `GET /posts` - List published posts
- `GET /posts/{id}` - Get post by ID
- `GET /posts/slug/{slug}` - Get post by slug

### Protected Endpoints (Admin Only)
- `POST /posts` - Create post
- `PUT /posts/{id}` - Update post
- `POST /posts/{id}/publish` - Publish post
- `POST /posts/{id}/unpublish` - Unpublish post
- `POST /posts/{id}/archive` - Archive post
- `DELETE /posts/{id}` - Delete post

## Features

### Content Management
- Rich text editor support (Markdown/HTML)
- Auto-slug generation from title
- Draft saving
- Version tracking (via Postal)

### SEO Optimization
- Custom meta title and description
- Keywords management
- Open Graph image for social sharing
- URL slug customization

### Organization
- Category and subcategory classification
- Subcategories filtered by parent category
- Featured and pinned posts
- Public/private visibility control

### Search & Filter
- Search by title
- Filter by status (draft, published, archived)
- Filter by category
- Pagination support

## Development

### Running the Application
```bash
cd archive-admin
yarn install
yarn dev
```

### Building for Production
```bash
yarn build
```

### Type Checking
```bash
yarn type-check
```

## Testing

### Manual Testing Checklist
- [ ] Create new post
- [ ] Edit existing post
- [ ] Publish draft post
- [ ] Unpublish published post
- [ ] Archive published post
- [ ] Restore archived post
- [ ] Delete post
- [ ] Filter posts by status
- [ ] Search posts by title
- [ ] Select category and subcategory
- [ ] Toggle visibility settings
- [ ] Upload featured image
- [ ] Add SEO metadata

## Troubleshooting

### Posts not loading
1. Check Postal service is running: `curl http://localhost:8081/api/v1/health`
2. Verify environment variables in `.env`
3. Check browser console for errors
4. Verify JWT token in localStorage

### Authentication errors
1. Ensure Cortex is running on port 8080
2. Check JWT_SECRET matches between Cortex and Postal
3. Try logging out and logging back in
4. Clear localStorage and re-authenticate

### Category/Subcategory not showing
1. Ensure categories are approved in Cortex
2. Check Cortex API: `curl http://localhost:8080/api/v1/categories`
3. Verify subcategories have correct parent_id

## Future Enhancements
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload functionality
- [ ] Markdown preview
- [ ] Post scheduling
- [ ] Bulk actions
- [ ] Post duplication
- [ ] Version history viewer
- [ ] Post analytics
- [ ] Tag management
- [ ] Media library

## Related Documentation
- [Postal Service README](../../postal/README.md)
- [Cortex Service Documentation](../../cortex/README.md)
- [API Types](./src/types/api.ts)
- [Post Service](./src/services/postService.ts)
