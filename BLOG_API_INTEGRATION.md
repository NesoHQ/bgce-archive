# Blog API Integration - Complete

## Summary

Successfully migrated the blog pages from mock data to real API integration with the Postal service.

## Changes Made

### 1. Blog Listing Page (`/blogs`)
**File:** `archive-client/app/(home)/blogs/page.tsx`
- Converted to Server Component
- Fetches posts from Postal API using `getPosts()`
- Passes data to client component for filtering/sorting

**File:** `archive-client/app/(home)/blogs/BlogsClient.tsx` (NEW)
- Client component handling all interactive features
- Filters: Search by title/summary
- Sorting: Newest, Most Viewed, Featured
- Mobile-responsive filter drawer
- Compact, user-friendly UI matching the upgraded design system
- Links to blog details using slug: `/blogs/[slug]`

### 2. Blog Details Page (`/blogs/[slug]`)
**File:** `archive-client/app/(home)/blogs/[slug]/page.tsx`
- Converted to Server Component
- Fetches post by slug from Postal API using `getPostBySlug()`
- Generates dynamic metadata (SEO)
- Returns 404 if post not found or not published

**File:** `archive-client/app/(home)/blogs/[slug]/BlogDetailsClient.tsx` (NEW)
- Client component for blog details display
- Markdown rendering with `react-markdown` and `remark-gfm`
- Full article layout with:
  - Breadcrumb navigation
  - Author info
  - Post metadata (views, read time, version)
  - Tags display
  - Social sharing buttons
  - Like/Save actions
  - Sidebar with post info and newsletter signup

## API Integration

### Endpoints Used

**Blog Listing:**
```
GET /api/v1/posts?status=published&limit=100
```

**Blog Details:**
```
GET /api/v1/posts/slug/{slug}
```

### API Response Structure

```typescript
interface ApiPost {
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
  created_by: number;
  view_count: number;
  version: number;
  created_at: string;
  updated_at: string;
}
```

## Features Implemented

### Blog Listing
- ✅ Real-time data from API
- ✅ Search functionality (title/summary)
- ✅ Sort by: Newest, Most Viewed, Featured
- ✅ Featured badge for `is_featured` posts
- ✅ Pinned badge for `is_pinned` posts
- ✅ View count display
- ✅ Read time calculation
- ✅ Tags from keywords field
- ✅ Author avatars (generated from user ID)
- ✅ Mobile-responsive filter drawer
- ✅ Compact, user-friendly UI

### Blog Details
- ✅ Full markdown rendering
- ✅ Syntax highlighting for code blocks
- ✅ Tables support (GFM)
- ✅ Breadcrumb navigation
- ✅ Author information
- ✅ Post metadata sidebar
- ✅ Tags display
- ✅ Social sharing buttons
- ✅ Like/Save actions (UI only)
- ✅ SEO metadata generation
- ✅ 404 handling for unpublished/private posts

## Data Transformations

### Author Display
Since the API only provides `created_by` (user ID), we generate:
- Avatar initials: `U{userId}` (e.g., "U1", "U2")
- Avatar colors: Rotating through 6 colors based on user ID

### Read Time Calculation
```typescript
const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
};
```

### Tags Extraction
```typescript
const getTags = (keywords?: string) => {
    if (!keywords) return [];
    return keywords.split(',').map(k => k.trim());
};
```

## Caching Strategy

- Blog listing: 3 minutes cache (`revalidate: 180`)
- Blog details: 10 minutes cache (`revalidate: 600`)

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_POSTAL_API_URL=http://localhost:8081/api/v1
# or production:
NEXT_PUBLIC_POSTAL_API_URL=https://postal.nesohq.org/api/v1
```

## Dependencies Added

```json
{
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0"
}
```

## Testing

### Local Testing
1. Start Postal service: `cd postal && make run`
2. Start Next.js dev server: `cd archive-client && pnpm dev`
3. Visit: `http://localhost:3000/blogs`

### Production Testing
- Blog listing: `https://your-domain.com/blogs`
- Blog details: `https://your-domain.com/blogs/class-8-8-variables-and-data-types`

## Example API Responses

### Blog Listing Response
```json
{
  "status": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": 92,
      "uuid": "72fbb5f9-da9c-443b-a821-ca067f01a0fd",
      "title": "Class 8: Variables And Data Types",
      "slug": "class-8-8-variables-and-data-types",
      "summary": "Class 08: Variables and Data Types...",
      "content": "# Class 08: Variables and Data Types...",
      "thumbnail": "https://via.placeholder.com/800x600",
      "category_id": 1,
      "sub_category_id": 2,
      "keywords": "variables, and, data, types",
      "status": "published",
      "is_public": true,
      "is_featured": true,
      "is_pinned": false,
      "created_by": 1,
      "view_count": 0,
      "version": 1,
      "created_at": "2026-02-22T16:47:17.887583Z",
      "updated_at": "2026-02-22T16:47:17.887583Z"
    }
  ],
  "meta": {
    "total": 38,
    "limit": 10,
    "offset": 0
  }
}
```

### Blog Details Response
```json
{
  "status": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": 92,
    "title": "Class 8: Variables And Data Types",
    "slug": "class-8-8-variables-and-data-types",
    "content": "# Class 08: Variables and Data Types\n\n> Go একটি strongly typed...",
    "summary": "Class 08: Variables and Data Types...",
    "keywords": "variables, and, data, types",
    "status": "published",
    "is_public": true,
    "is_featured": true,
    "view_count": 0,
    "created_by": 1,
    "created_at": "2026-02-22T16:47:17.887583479Z"
  }
}
```

## UI/UX Improvements

### Consistent Design System
- Uses the same compact, user-friendly design as courses/discussion/cheatsheet pages
- Vibrant dark mode hover effects with `oklch` color space
- 2px borders for better visibility
- Responsive grid layouts (1-5 columns based on screen size)

### Mobile Experience
- Filter drawer with Portal component
- Touch-friendly buttons and spacing
- Optimized typography for mobile screens

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements

## Next Steps (Future Enhancements)

1. **Comments System**: Integrate with Community Service API
2. **Like/Save Functionality**: Connect to backend endpoints
3. **Related Posts**: Implement recommendation algorithm
4. **Author Profiles**: Fetch real user data from Cortex service
5. **Search Enhancement**: Full-text search with Search Service
6. **Analytics**: Track views with Analytics Service
7. **Social Sharing**: Implement actual sharing functionality
8. **Newsletter**: Connect to Notification Service

## Build Status

✅ Build successful
✅ TypeScript compilation passed
✅ All routes generated correctly
✅ No errors or warnings

## Routes Generated

- `/blogs` - Blog listing (Server Component with 3min cache)
- `/blogs/[slug]` - Blog details (Dynamic route with 10min cache, uses slug instead of ID)

---

**Status:** ✅ Complete
**Date:** 2026-02-26
**Build:** Successful
