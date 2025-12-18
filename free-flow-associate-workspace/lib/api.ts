import { LoginCredentials, LoginResponse } from "@/types/associate"
import { apiClient } from "./api-client"

export const AuthApi = {
    login: async (data: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post("/user/associate/login", data)
        return response.data
    }
}

export const InviteApi = {
    getInviteDetails: async (token: string) => {
        const response = await apiClient.get(`/associate/invite/${token}`)
        return response.data
    },

    inviteResponse: async(token:string, data:any) => {
        const response = await apiClient.post(`/associate/invite/response/${token}`, data)
        return response.data
    }
}

export const tasksApi = {
    getTasks: async () => {
        const response = await apiClient.get("/associate/tasks")
        return response.data
    }
}