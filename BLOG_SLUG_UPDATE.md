# Blog Route Update - Using Slug Instead of ID

## Summary

Updated the blog details route from `/blogs/[id]` to `/blogs/[slug]` to match the archive pattern and use SEO-friendly URLs.

## Changes Made

### 1. Route Structure
- **Old:** `/blogs/[id]` (e.g., `/blogs/92`)
- **New:** `/blogs/[slug]` (e.g., `/blogs/class-8-8-variables-and-data-types`)

### 2. Files Updated

#### Created New Files:
- `archive-client/app/(home)/blogs/[slug]/page.tsx`
- `archive-client/app/(home)/blogs/[slug]/BlogDetailsClient.tsx`

#### Updated Files:
- `archive-client/app/(home)/blogs/BlogsClient.tsx` - Changed link from `href={/blogs/${blog.id}}` to `href={/blogs/${blog.slug}}`

#### Deleted Files:
- `archive-client/app/(home)/blogs/[id]/page.tsx`
- `archive-client/app/(home)/blogs/[id]/BlogDetailsClient.tsx`

### 3. API Changes

**Before:**
```typescript
const post = await getPostById(parseInt(id));
```

**After:**
```typescript
const post = await getPostBySlug(slug);
```

### 4. URL Examples

**Before:**
- `/blogs/92`
- `/blogs/93`
- `/blogs/94`

**After:**
- `/blogs/class-8-8-variables-and-data-types`
- `/blogs/class-9-9-if-else-and-switch`
- `/blogs/class-10-10-introduction-to-functions`

## Benefits

1. **SEO-Friendly URLs**: Slugs are more descriptive and better for search engines
2. **User-Friendly**: URLs are readable and give context about the content
3. **Consistency**: Matches the `/archive/post/[slug]` pattern
4. **Shareable**: URLs are more meaningful when shared on social media

## API Endpoint Used

```
GET /api/v1/posts/slug/{slug}
```

Example:
```bash
curl -X 'GET' \
  'https://postal.nesohq.org/api/v1/posts/slug/class-8-8-variables-and-data-types' \
  -H 'accept: application/json'
```

## Build Status

✅ Build successful
✅ TypeScript compilation passed
✅ Route generated: `/blogs/[slug]`

## Testing

### Local Testing
1. Start Postal service: `cd postal && make run`
2. Start Next.js dev server: `cd archive-client && pnpm dev`
3. Visit: `http://localhost:3000/blogs`
4. Click on any blog to see the slug-based URL

### Example URLs
- Listing: `http://localhost:3000/blogs`
- Details: `http://localhost:3000/blogs/class-8-8-variables-and-data-types`

---

**Status:** ✅ Complete
**Date:** 2026-02-26
**Build:** Successful
