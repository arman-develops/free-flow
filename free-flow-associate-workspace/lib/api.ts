import { LoginCredentials, LoginResponse } from "@/types/associate"
import { apiClient } from "./api-client"

export const AuthApi = {
    login: async (data: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post("/user/associate/login", data)
        return response.data
    }
}