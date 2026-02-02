import { api } from './api'
import type {
    ApiResponse,
    User,
    UpdateUserRequest,
    ChangePasswordRequest,
} from '@/types/api'

export const userService = {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/users/profile')
        return response.data
    },

    /**
     * Update current user profile
     */
    async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<User>> {
        const response = await api.put<ApiResponse<User>>('/users/profile', data)
        return response.data
    },

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
        const response = await api.post<ApiResponse<null>>('/users/change-password', data)
        return response.data
    },
}
