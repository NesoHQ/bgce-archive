import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error) => {
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.message || 'An error occurred'

            // Handle specific error codes
            switch (status) {
                case 401:
                    // Unauthorized - clear auth and redirect to login
                    // Only auto-logout if we're not on the login page already
                    if (window.location.pathname !== '/login') {
                        // Use dynamic import to avoid circular dependency
                        const { useAuthStore } = await import('@/stores/auth')
                        const authStore = useAuthStore()

                        // Clear auth state
                        authStore.user = null
                        localStorage.removeItem('auth-token')
                        localStorage.removeItem('user')

                        toast.error('Session expired', {
                            description: 'Please login again',
                        })

                        // Redirect to login
                        window.location.href = '/login'
                    }
                    break
                case 403:
                    toast.error('Access denied', {
                        description: 'You do not have permission to perform this action',
                    })
                    break
                case 404:
                    toast.error('Not found', {
                        description: message,
                    })
                    break
                case 500:
                    toast.error('Server error', {
                        description: 'Something went wrong on our end',
                    })
                    break
                default:
                    toast.error('Error', {
                        description: message,
                    })
            }
        } else if (error.request) {
            toast.error('Network error', {
                description: 'Please check your internet connection',
            })
        }

        return Promise.reject(error)
    },
)

// Generic API methods
export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.get<T>(url, config)
    },

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.post<T>(url, data, config)
    },

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.put<T>(url, data, config)
    },

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.delete<T>(url, config)
    },

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.patch<T>(url, data, config)
    },
}

export default apiClient
