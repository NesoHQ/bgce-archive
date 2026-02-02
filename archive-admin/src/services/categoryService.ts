import { api } from './api'
import type {
    ApiResponse,
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    CategoryFilter,
} from '@/types/api'

export const categoryService = {
    /**
     * Get all categories
     */
    async getCategories(filter?: CategoryFilter): Promise<ApiResponse<Category[]>> {
        const params = new URLSearchParams()
        if (filter?.status) params.append('status', filter.status)
        if (filter?.search) params.append('search', filter.search)
        if (filter?.page) params.append('page', filter.page.toString())
        if (filter?.limit) params.append('limit', filter.limit.toString())

        const response = await api.get<ApiResponse<Category[]>>(
            `/categories?${params.toString()}`,
        )
        return response.data
    },

    /**
     * Get category by UUID
     */
    async getCategoryByUUID(uuid: string): Promise<ApiResponse<Category>> {
        const response = await api.get<ApiResponse<Category>>(`/categories/${uuid}`)
        return response.data
    },

    /**
     * Create a new category
     */
    async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<null>> {
        const response = await api.post<ApiResponse<null>>('/categories', data)
        return response.data
    },

    /**
     * Update category by slug
     */
    async updateCategory(
        slug: string,
        data: UpdateCategoryRequest,
    ): Promise<ApiResponse<null>> {
        const response = await api.put<ApiResponse<null>>(`/categories/${slug}`, data)
        return response.data
    },

    /**
     * Delete category by UUID
     */
    async deleteCategory(uuid: string): Promise<ApiResponse<null>> {
        const response = await api.delete<ApiResponse<null>>(`/categories/${uuid}`)
        return response.data
    },
}
