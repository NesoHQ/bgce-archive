import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { authService, userService } from '@/services'
import type { User, LoginRequest, RegisterRequest } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const isInitializing = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEditor = computed(() => user.value?.role === 'editor' || user.value?.role === 'admin')

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true
      const response = await authService.login(credentials)

      if (response.status && response.data) {
        user.value = response.data.user
        localStorage.setItem('auth-token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        toast.success('Login Successful', {
          description: 'Welcome back!',
        })

        router.push({ name: 'dashboard' })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login Failed', {
        description: error.response?.data?.message || 'Invalid credentials',
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      loading.value = true
      const response = await authService.register(data)

      if (response.status) {
        toast.success('Registration Successful', {
          description: 'Please login with your credentials',
        })

        router.push({ name: 'login' })
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Registration Failed', {
        description: error.response?.data?.message || 'Failed to register',
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout()
      user.value = null
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')

      toast.success('Logged out successfully')
      router.push({ name: 'login' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Initialize auth from stored token
   * This is called on app load - we just restore from localStorage
   * We don't validate the token here to avoid logout loops
   */
  const initializeAuth = () => {
    const token = localStorage.getItem('auth-token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        // Simply restore user from localStorage
        user.value = JSON.parse(storedUser)
        console.log('Auth initialized from localStorage')
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * Validate current session by fetching profile
   * Call this explicitly when you need to verify the token is still valid
   */
  const validateSession = async () => {
    try {
      isInitializing.value = true
      const response = await userService.getProfile()
      if (response.status && response.data) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return true
      }
      return false
    } catch (error) {
      console.error('Session validation failed:', error)
      // Don't auto-logout here - let the interceptor handle it
      return false
    } finally {
      isInitializing.value = false
    }
  }

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<User>) => {
    try {
      loading.value = true
      const response = await userService.updateProfile(data)

      if (response.status && response.data) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))

        toast.success('Profile Updated', {
          description: 'Your profile has been updated successfully',
        })
      }
    } catch (error: any) {
      console.error('Update profile error:', error)
      toast.error('Update Failed', {
        description: error.response?.data?.message || 'Failed to update profile',
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  // Legacy method for backward compatibility
  const handleLogin = (userData: any, token: string) => {
    user.value = userData
    localStorage.setItem('auth-token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    router.push({ name: 'dashboard' })
  }

  const handleLogout = logout

  return {
    user,
    loading,
    isInitializing,
    isAuthenticated,
    isAdmin,
    isEditor,
    login,
    register,
    logout,
    initializeAuth,
    validateSession,
    updateProfile,
    // Legacy methods
    handleLogin,
    handleLogout,
  }
})
