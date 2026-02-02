import { api } from './api'
import type {
    ApiResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
} from '@/types/api'

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<ApiResponse<User>> {
        const response = await api.post<ApiResponse<User>>('/auth/register', data)
        return response.data
    },

    /**
     * Login user
     */
    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data)
        return response.data
    },

    /**
     * Logout user (client-side only for now)
     */
    async logout(): Promise<void> {
        // Clear local storage
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
    },
}
