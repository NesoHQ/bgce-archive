/**
 * API Configuration
 * 
 * Toggle between mock data and real API endpoints
 * Set USE_MOCK to false when backend APIs are ready
 */

export const API_CONFIG = {
    // Base URLs from environment variables
    // For production: use /api/cortex and /api/postal (nginx proxies to different backends)
    CORTEX_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/cortex/v1',
    POSTAL_BASE_URL: import.meta.env.VITE_POSTAL_API_BASE_URL || '/api/postal/v1',

    // Mock data flags - set to false when backend is ready
    USE_MOCK_POSTS: false, // Now using real postal API
    USE_MOCK_COMMENTS: true,
    USE_MOCK_SUPPORT: true,
    USE_MOCK_MODERATION: true,

    // Real API endpoints are already configured for:
    // - Authentication (authService) - Cortex
    // - Categories (categoryService) - Cortex
    // - Subcategories (subcategoryService) - Cortex
    // - Users (userService) - Cortex
    // - Posts (postService) - Postal
}

/**
 * When backend APIs are ready:
 * 
 * 1. Set the corresponding USE_MOCK flag to false
 * 2. The service will automatically switch to real API calls
 * 3. No other code changes needed!
 * 
 * Example:
 * API_CONFIG.USE_MOCK_POSTS = false  // Now uses real /api/v1/posts endpoint
 */
