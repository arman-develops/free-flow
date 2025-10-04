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

interface CreateExpenseRequest {
  project_id: string
  amount: number
  currency: string
  description: string
  category: string
  date: string
  vendor: string
}

interface CreateInvoiceRequest {
  project_id: string
  currency: string
  status: string
  due_date: string
  description: string
  notes: string
  payment_method: string
}

interface CreatePaymentRequest {
  invoice_id: string
  amount: number
  currency: string
  method: string
  transaction_ref: string
  status: string
  phoneNumber: string
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
  },

  getProjectByUser: async () => {
    const response = await apiClient.get("/project/u")
    return response.data
  },

  updateProject: async (projectID: string, data: any) => {
    const response = await apiClient.put(`/project/${projectID}`, data)
    return response.data
  }
}

export const tasksApi = {
  create: async (data: CreateTaskRequest): Promise<ApiResponse> => {
    const response = await apiClient.post("/task/", data)
    return response.data
  },

  getTasksByAssociateID: async (associateID: string) => {
    const response = await apiClient.get("/task/")
    return response.data
  },

  getTaskByProjectID: async (projectID: string) => {
    const response = await apiClient.get(`/task/p/${projectID}`)
    return response.data
  },

  getTaskByID: async (projectID: string) => {
    const response = await apiClient.get(`/task/${projectID}`)
    return response.data
  },

  updateTask: async (taskID: string, data: any) => {
    console.log(data)
    const response = await apiClient.put(`/task/${taskID}`, data)
    return response.data
  },

  deleteTask: async (projectID: string) => {
    const response = await apiClient.delete(`/task/${projectID}`)
    return response.data
  }

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

  getAssociateByID: async (associateID: string) => {
    const response = await apiClient.get(`/task/${associateID}`)
    return response.data
  },

  updateAssociate: async (associateID: string, data: any) => {
    const response = await apiClient.patch(`/task/${associateID}`, data)
    return response.data
  },
}

export const expensesApi = {
  create: async (data: CreateExpenseRequest) => {
    const response = await apiClient.post("/expense/", data)
    return response.data
  }
}

export const invoiceApi = {
  create: async (data: CreateInvoiceRequest) => {
    const response = await apiClient.post("/invoice/", data)
    return response.data
  },

  getInvoicesByUser: async () => {
    const response = await apiClient.get("/invoice/u")
    return response.data
  }
}

export const paymentApi = {
  create: async (data: CreatePaymentRequest) => {
    const response = await apiClient.post("/payment/", data)
    return response.data
  },

  getPayments: async() => {
    const response = await apiClient.get(`/payment/u`)
    return response.data
  }
}

export const statsApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get("/stats/dashboard")
    return response.data
  },
  getRevenueStats: async () => {
    const response = await apiClient.get("/stats/dashboard/revenue")
    return response.data
  },
  getProjectDataStats: async () => {
    const response = await apiClient.get("/stats/dashboard/projects")
    return response.data
  },
  getAssociateStats: async () => {
    const response = await apiClient.get("/stats/associates")
    return response.data
  }
}