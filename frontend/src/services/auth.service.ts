import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types";
import { type userLoginType } from "@/validation";

class UserAuthService {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }

  async login(data: userLoginType): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse<any>>('/auth/log-in', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
}

export const userAuthService = new UserAuthService();
