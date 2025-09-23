import { apiClient } from "./axios-config"

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  token: string
}

interface CreateClientRequest {
  companyName: string
  email: string
  contact: string
}

interface CreateProjectRequest {
  name: string
  description: string
  estimated_value: number
  notes: string
  entityID: string
}

interface CreateTaskRequest {
  title: string
  description: string
  estimated_hours: number
  project_id: string
}

interface CreateAssociateRequest {
  name: string
  email: string
  phone: string
  skills: string[]
}

interface ApiResponse {
  success: boolean
  data: {
    message: string
  }
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/user/login", credentials)
    return response.data
  },

  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/user/signup", userData)
    return response.data
  },

  verifyToken: async (token: string): Promise<{ user: AuthResponse["user"] }> => {
    const response = await apiClient.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
}

export const clientsApi = {
  create: async (data: CreateClientRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/entity/", data)
    return response.data
  },

  getClientsByUserID: async () => {
    const response = await apiClient.get("/entity/u")
    return response.data
  },

  getAll: async () => {
    const response = await apiClient.get("/clients")
    return response.data
  },
}

export const projectsApi = {
  create: async (data: CreateProjectRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/project/", data)
    return response.data
  },

  getProjectByClientID: async (id: string) => {
    const response = await apiClient.get(`/project/e/${id}`)
    return response.data
  },

  getProjectByID: async (id: string) => {
    const response = await apiClient.get(`/project/${id}`)
    return response.data
  }
}

export const tasksApi = {
  create: async (data: CreateTaskRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/tasks", data)
    return response.data
  },

  getTaskByProjectID: async (projectID: string) => {
    const response = await apiClient.get(`/tasks/p/${projectID}`)
    return response.data
  },
}

export const associatesApi = {
  create: async (data: CreateAssociateRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/associate/", data)
    return response.data
  },

  getAssociatesByUserID: async () => {
    const response = await apiClient.get("/associate/u")
    return response.data
  },
}
