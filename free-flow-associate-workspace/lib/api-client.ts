import { useAssociateStore } from "@/stores/associate-store"
import axios from "axios"

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config:any) => {
    const token = useAssociateStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error:any) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response:any) => response,
  (error:any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      useAssociateStore.getState().logout()
      // window.location.href = "/associate/login"
    }
    return Promise.reject(error)
  },
)
