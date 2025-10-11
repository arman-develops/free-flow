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

interface CreateMilestoneRequest {
  title: string,
  description: string,
  due_date: string,
  priority: string,
  deliverables: string[],
  client_visible: boolean
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

  updateClient: async (clientID: string, data: any) => {
    const response = await apiClient.put(`/entity/${clientID}`, data)
    return response.data
  },
  
  deleteClient: async (clientID:string) => {
    const response = await apiClient.delete(`/entity/${clientID}`)
    return response.data
  }
}

export const projectsApi = {
  create: async (data: CreateProjectRequest) => {
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
  },
  deleteProject: async (projectID: string) => {
    const response = await apiClient.delete(`/project/${projectID}`)
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
    const response = await apiClient.put(`/task/${taskID}`, data)
    return response.data
  },

  deleteTask: async (projectID: string) => {
    const response = await apiClient.delete(`/task/${projectID}`)
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
  },
  getExpensesByUser: async () => {
    const response = await apiClient.get("/expense/u")
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
  },
  getFinanceStats: async () => {
    const response = await apiClient.get("/stats/finances")
    return response.data
  },
  getSettlementStats: async () => {
    const response = await apiClient.get("/stats/settlements")
    return response.data
  },
  getRecentSettlements: async () => {
    const response = await apiClient.get("/settlements/recent")
    return response.data
  },
  getSettlementHistory: async () => {
    const response = await apiClient.get("/settlements/history")
    return response.data
  }
}

export const milestoneApi = {
  create: async (data:CreateMilestoneRequest) => {
    const response = await apiClient.post("/milestone/", data)
    return response.data
  },
  milestonesByProject: async (projectID: string) => {
    const response = await apiClient.get(`/milestone/p/${projectID}`)
    return response.data
  },
  addTasks: async (milestone_id: string, task_ids: string[]) => {
    const response = await apiClient.put(`milestone/${milestone_id}/add`, {task_ids})
    return response.data
  },
  deleteMilestone: async (milestoneID: string) => {
    const response = await apiClient.delete(`/milestone/${milestoneID}`)
    return response.data
  }
}