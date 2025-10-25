import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

interface User {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const dummyAuthenticatedUser = { id: '123', email: 'admin@archive.com' }

  const handleLogin = (userData: User, token: string) => {
    if (userData.email === dummyAuthenticatedUser.email) {
      user.value = userData
      localStorage.setItem('auth-token', token)

      toast.success('Login Successfull', {
        description: 'You will be redirecting to dashboard',
      })

      setTimeout(() => {
        router.push({ name: 'dashboard' })
      }, 100)
    } else {
      user.value = null
      localStorage.removeItem('auth-token')

      toast.error('Login Failed', {
        description: 'Wrong credentials, try again.',
      })
    }
  }

  const handleLogout = () => {
    user.value = null
    localStorage.removeItem('auth-token')

    router.push({ name: 'login' })
  }

  // An action to initialize the store from a token (e.g., on app load)
  const initializeAuth = () => {
    const token = localStorage.getItem('auth-token')

    if (token) {
      user.value
    }
  }

  return {
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,
    initializeAuth,
  }
})
