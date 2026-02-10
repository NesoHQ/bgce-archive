import { postalApi } from './postalApi'
import { postMockService } from './mocks/postMock'
import { API_CONFIG } from '@/config/api.config'
import type {
    ApiResponse,
    Post,
    PostListResponse,
    CreatePostRequest,
    UpdatePostRequest,
} from '@/types/api'

export const postService = {
    async getPosts(params?: { status?: string; category_id?: number; sub_category_id?: number; limit?: number; offset?: number }): Promise<PostListResponse> {
        if (API_CONFIG.USE_MOCK_POSTS) {
            const mockResponse = await postMockService.getPosts(params)
            return {
                ...mockResponse,
                meta: {
                    total: mockResponse.data.length,
                    limit: params?.limit || 10,
                    offset: params?.offset || 0,
                }
            }
        }
        const response = await postalApi.get<PostListResponse>('/posts', { params })
        return response.data
    },

    async getPostById(id: number): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.getPostById(id)
        const response = await postalApi.get<ApiResponse<Post>>(`/posts/${id}`)
        return response.data
    },

    async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.getPostById(0) // Mock doesn't support slug
        const response = await postalApi.get<ApiResponse<Post>>(`/posts/slug/${slug}`)
        return response.data
    },

    async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.createPost(data)
        const response = await postalApi.post<ApiResponse<Post>>('/posts', data)
        return response.data
    },

    async updatePost(id: number, data: UpdatePostRequest): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.updatePost(id, data)
        const response = await postalApi.put<ApiResponse<Post>>(`/posts/${id}`, data)
        return response.data
    },

    async deletePost(id: number): Promise<ApiResponse<null>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.deletePost(id)
        const response = await postalApi.delete<ApiResponse<null>>(`/posts/${id}`)
        return response.data
    },

    async publishPost(id: number): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.publishPost(id)
        const response = await postalApi.post<ApiResponse<Post>>(`/posts/${id}/publish`)
        return response.data
    },

    async unpublishPost(id: number): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.rejectPost(id)
        const response = await postalApi.post<ApiResponse<Post>>(`/posts/${id}/unpublish`)
        return response.data
    },

    async archivePost(id: number): Promise<ApiResponse<Post>> {
        if (API_CONFIG.USE_MOCK_POSTS) return postMockService.rejectPost(id)
        const response = await postalApi.post<ApiResponse<Post>>(`/posts/${id}/archive`)
        return response.data
    },

    // Legacy method for compatibility
    async rejectPost(id: number, reason?: string): Promise<ApiResponse<Post>> {
        return this.unpublishPost(id)
    },

    async bulkUploadPosts(file: File): Promise<ApiResponse<{ total_created: number }>> {
        if (API_CONFIG.USE_MOCK_POSTS) {
            // Mock response for testing
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        status: true,
                        message: "Posts uploaded successfully",
                        data: {
                            total_created: 10
                        }
                    })
                }, 2000)
            })
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await postalApi.post<ApiResponse<{ total_created: number }>>(
            '/posts/batch',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        return response.data
    }
}
