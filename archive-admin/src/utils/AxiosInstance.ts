import axios, { type AxiosInstance } from 'axios'
import { API_CONFIG } from '@/config/api.config'

const baseURL = API_CONFIG.CORTEX_BASE_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
