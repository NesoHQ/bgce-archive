# API Quick Reference Guide

## Quick Start

### Making API Calls

```typescript
// Import the service
import { categoryService } from '@/services'

// Use in component
const categories = await categoryService.getCategories()
```

### Using Stores

```typescript
// Import the store
import { useCategoryStore } from '@/stores/category'

// Use in component
const categoryStore = useCategoryStore()
await categoryStore.fetchCategories()
```

## Available Services

### 1. Authentication Service

```typescript
import { authService } from '@/services'

// Register new user
await authService.register({
  username: 'john',
  email: 'john@example.com',
  password: 'password123',
  full_name: 'John Doe'
})

// Login
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123'
})
// Returns: { token, user }
```

### 2. User Service

```typescript
import { userService } from '@/services'

// Get current user profile
const profile = await userService.getProfile()

// Update profile
await userService.updateProfile({
  username: 'newusername',
  email: 'newemail@example.com',
  full_name: 'New Name'
})

// Change password
await userService.changePassword({
  old_password: 'oldpass',
  new_password: 'newpass'
})
```

### 3. Category Service

```typescript
import { categoryService } from '@/services'

// Get all categories
const categories = await categoryService.getCategories()

// Get category by UUID
const category = await categoryService.getCategoryByUUID('uuid-here')

// Get category by slug
const category = await categoryService.getCategoryBySlug('my-category')

// Create category
await categoryService.createCategory({
  slug: 'new-category',
  label: 'New Category',
  description: 'Category description'
})

// Update category
await categoryService.updateCategory('category-slug', {
  label: 'Updated Label',
  description: 'Updated description'
})

// Delete category
await categoryService.deleteCategory(categoryId)
```

### 4. Subcategory Service

```typescript
import { subcategoryService } from '@/services'

// Get all subcategories
const subcategories = await subcategoryService.getSubcategories()

// Get subcategories by parent ID
const subcategories = await subcategoryService.getSubcategories(parentId)

// Get subcategory by ID
const subcategory = await subcategoryService.getSubcategoryById(id)

// Create subcategory
await subcategoryService.createSubcategory({
  slug: 'new-subcategory',
  label: 'New Subcategory',
  description: 'Subcategory description',
  parent_id: 1
})

// Update subcategory
await subcategoryService.updateSubcategory(id, {
  label: 'Updated Label',
  description: 'Updated description'
})

// Delete subcategory
await subcategoryService.deleteSubcategory(id)
```

### 5. Post Service

```typescript
import { postService } from '@/services'

// Get all posts
const posts = await postService.getPosts()

// Get posts with filters
const posts = await postService.getPosts({
  status: 'published',
  category_id: 1,
  sub_category_id: 2,
  limit: 10,
  offset: 0
})

// Get post by ID
const post = await postService.getPostById(id)

// Get post by slug
const post = await postService.getPostBySlug('my-post')

// Create post
await postService.createPost({
  title: 'New Post',
  slug: 'new-post',
  content: 'Post content here...',
  excerpt: 'Short excerpt',
  category_id: 1,
  sub_category_id: 2,
  status: 'draft',
  tags: ['tag1', 'tag2']
})

// Update post
await postService.updatePost(id, {
  title: 'Updated Title',
  content: 'Updated content'
})

// Delete post
await postService.deletePost(id)

// Publish post
await postService.publishPost(id)

// Unpublish post
await postService.unpublishPost(id)

// Archive post
await postService.archivePost(id)
```

### 6. Stats Service

```typescript
import { statsService } from '@/services'

// Get comprehensive dashboard stats
const stats = await statsService.getDashboardStats()
// Returns: {
//   categories: number,
//   subcategories: number,
//   posts: number,
//   publishedPosts: number,
//   draftPosts: number,
//   archivedPosts: number,
//   pendingComments: number,
//   openTickets: number
// }

// Get category count only
const count = await statsService.getCategoryCount()

// Get subcategory count only
const count = await statsService.getSubcategoryCount()

// Get post statistics
const stats = await statsService.getPostStats()
// Returns: {
//   total: number,
//   published: number,
//   draft: number,
//   archived: number
// }
```

## Using Stores (Recommended)

### Category Store

```typescript
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

// Fetch categories
await categoryStore.fetchCategories()

// Access categories
const categories = categoryStore.categories

// Create category
await categoryStore.createCategory({
  slug: 'new-category',
  label: 'New Category'
})

// Update category
await categoryStore.updateCategory('slug', {
  label: 'Updated Label'
})

// Delete category
await categoryStore.deleteCategory(id)

// Check loading state
if (categoryStore.loading) {
  // Show loading spinner
}

// Check for errors
if (categoryStore.error) {
  // Show error message
}
```

### Post Store

```typescript
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()

// Fetch posts
await postStore.fetchPosts()

// Fetch with filters
await postStore.fetchPosts({
  status: 'published',
  category_id: 1
})

// Access posts
const posts = postStore.posts

// Create post
await postStore.createPost({
  title: 'New Post',
  content: 'Content here'
})

// Update post
await postStore.updatePost(id, {
  title: 'Updated Title'
})

// Delete post
await postStore.deletePost(id)

// Publish post
await postStore.publishPost(id)
```

### User Store

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Update profile
await userStore.updateProfile({
  username: 'newusername',
  email: 'newemail@example.com'
})

// Change password
await userStore.changePassword({
  old_password: 'oldpass',
  new_password: 'newpass'
})

// Check loading state
if (userStore.loading) {
  // Show loading spinner
}
```

## Common Patterns

### Loading State

```vue
<script setup>
import { ref } from 'vue'
import { categoryService } from '@/services'

const loading = ref(false)
const categories = ref([])

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await categoryService.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <!-- Show categories -->
  </div>
</template>
```

### Error Handling

```typescript
try {
  await categoryService.createCategory(data)
  toast.success('Category created successfully')
} catch (error) {
  // Error is already handled by interceptor
  // Just log or show additional UI feedback
  console.error('Failed to create category:', error)
}
```

### Parallel Requests

```typescript
// Load multiple resources in parallel
const [categories, posts, stats] = await Promise.all([
  categoryService.getCategories(),
  postService.getPosts(),
  statsService.getDashboardStats()
])
```

### Conditional Requests

```typescript
// Only fetch if not already loaded
if (categoryStore.categories.length === 0) {
  await categoryStore.fetchCategories()
}
```

## API Response Format

### Success Response
```typescript
{
  status: true,
  message: "Success message",
  data: { ... } // or [ ... ] for lists
}
```

### Error Response
```typescript
{
  status: false,
  message: "Error message",
  error: "Error details"
}
```

## Authentication

### Token Management

```typescript
// Token is automatically added to requests
// via axios interceptor in api.ts

// Manual token access (if needed)
const token = localStorage.getItem('auth-token')

// Token is automatically removed on 401 errors
```

### Protected Routes

```typescript
// Routes are protected in router/index.ts
// No additional code needed in components
```

## Environment Variables

```bash
# .env.local
VITE_API_BASE_URL=/api/cortex/v1
VITE_POSTAL_API_BASE_URL=/api/postal/v1
```

## TypeScript Types

```typescript
// Import types
import type {
  Category,
  Subcategory,
  Post,
  User,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreatePostRequest,
  UpdatePostRequest,
  ApiResponse
} from '@/types/api'

// Use in component
const category: Category = {
  id: 1,
  uuid: 'uuid-here',
  slug: 'my-category',
  label: 'My Category',
  description: 'Description',
  status: 'approved',
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}
```

## Debugging

### Check Network Requests

```typescript
// Open browser DevTools → Network tab
// Filter by XHR/Fetch
// Check request/response details
```

### Log API Responses

```typescript
const response = await categoryService.getCategories()
console.log('Categories:', response)
```

### Check Store State

```typescript
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
console.log('Categories:', categoryStore.categories)
console.log('Loading:', categoryStore.loading)
console.log('Error:', categoryStore.error)
```

## Best Practices

1. **Use Stores for State Management**
   - Don't call services directly in components
   - Use stores to manage state and API calls

2. **Handle Loading States**
   - Always show loading indicators
   - Disable buttons during API calls

3. **Handle Errors Gracefully**
   - Errors are automatically toasted
   - Add additional UI feedback if needed

4. **Use TypeScript Types**
   - Import and use proper types
   - Avoid `any` type

5. **Parallel Requests**
   - Use `Promise.all()` for independent requests
   - Improves performance

6. **Cache When Possible**
   - Check if data is already loaded
   - Avoid unnecessary API calls

## Common Issues

### 401 Unauthorized
- Token expired or invalid
- User is automatically logged out
- Redirect to login page

### 403 Forbidden
- User doesn't have permission
- Check user role

### 404 Not Found
- Resource doesn't exist
- Check ID/slug

### Network Error
- Backend is down
- Check internet connection
- Check API base URL

## Quick Troubleshooting

```typescript
// 1. Check if backend is running
// Visit: http://localhost:8080/api/v1/hello

// 2. Check API configuration
import { API_CONFIG } from '@/config/api.config'
console.log('Cortex URL:', API_CONFIG.CORTEX_BASE_URL)
console.log('Postal URL:', API_CONFIG.POSTAL_BASE_URL)

// 3. Check authentication
const token = localStorage.getItem('auth-token')
console.log('Token:', token)

// 4. Check store state
const categoryStore = useCategoryStore()
console.log('Store state:', categoryStore.$state)
```

---

**Need Help?**
- Check `API_INTEGRATION_STATUS.md` for detailed integration status
- Review service files in `src/services/`
- Check store files in `src/stores/`
- Review API documentation at `/api/cortex/swagger/` and `/api/postal/swagger/`
