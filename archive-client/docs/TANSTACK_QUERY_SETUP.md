# TanStack Query Setup

This document describes the TanStack Query (React Query) setup in the archive-client application.

## Installation

```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
```

## Architecture

### 1. Query Client Setup (`lib/get-query-client.ts`)

Creates and manages the QueryClient instance with proper SSR support:
- Server: Creates a new client for each request
- Browser: Reuses a single client instance
- Configured with 60s staleTime to avoid immediate refetching on client
- Supports dehydrating pending queries for streaming

### 2. Query Provider (`components/providers/query-provider.tsx`)

Client component that wraps the app with QueryClientProvider:
- Provides the QueryClient to all child components
- Includes React Query DevTools in development

### 3. Root Layout Integration (`app/layout.tsx`)

The QueryProvider wraps the entire application at the root level.

## Usage in Server Components

### Prefetching Data (app/(home)/blogs/page.tsx)

```tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

export default async function BlogsPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  // Wrap client components with HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsClient />
    </HydrationBoundary>
  );
}
```

## Usage in Client Components

### Fetching Data (app/(home)/blogs/BlogsClientOptimized.tsx)

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";

export default function BlogsClient() {
  // Fetch categories - will use prefetched data from server
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  // Fetch posts with filters
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["posts", postFilters],
    queryFn: () => api.getPosts(postFilters),
  });

  // Conditional query - only runs when enabled
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategoryUuid],
    queryFn: () => api.getSubcategories(selectedCategoryUuid!),
    enabled: !!selectedCategoryUuid,
  });
}
```

## Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Refetching**: Stale data is automatically refetched
3. **Request Deduplication**: Multiple components requesting the same data trigger only one request
4. **SSR Support**: Data prefetched on server is hydrated on client
5. **DevTools**: Built-in debugging tools for query inspection
6. **Optimistic Updates**: Easy to implement optimistic UI updates
7. **Automatic Retries**: Failed requests are automatically retried

## Query Keys

Query keys should be descriptive and include all parameters that affect the data:

- `["categories"]` - All categories
- `["posts", filters]` - Posts with specific filters
- `["subcategories", parentUuid]` - Subcategories for a parent category

## Configuration

Default options are set in `lib/get-query-client.ts`:

- `staleTime: 60 * 1000` (60 seconds) - Data is considered fresh for 60s
- Pending queries are dehydrated for streaming support
- Errors are not redacted (Next.js handles this)

## DevTools

React Query DevTools are available in development mode. Click the floating icon to inspect:
- Active queries
- Query states (loading, success, error)
- Cache contents
- Query timelines

## References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router Guide](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
