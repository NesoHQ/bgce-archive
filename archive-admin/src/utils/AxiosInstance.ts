import axios, { type AxiosInstance } from 'axios'

const baseURL = import.meta.env.VUE_APP_BASE_URL || 'http://localhost:5000'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
  timeout: 15000,
})

export default axiosInstance
