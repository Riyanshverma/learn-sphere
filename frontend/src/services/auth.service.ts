import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse, UserLoginResponse, CreateAdminResponse } from "@/types";
import type { UserLoginWithPasswordType, UserLoginWithOtpType } from "@/validation";

class UserAuthService {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }

  async loginWithPassword(data: UserLoginWithPasswordType): Promise<ApiSuccessResponse<UserLoginResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse<UserLoginResponse[]>>('/auth/log-in-with-password', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getIdentityDetails(identity_id: string, role: string): Promise<ApiSuccessResponse<CreateAdminResponse | any> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<CreateAdminResponse | any>>(`/${role}/auth/identity-details`, { params: { identity_id } })

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async logout() {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/auth/log-out');

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async loginWithOtp(data: UserLoginWithOtpType): Promise<ApiSuccessResponse<UserLoginResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse<UserLoginResponse[]>>('/auth/log-in-with-otp', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
}

export const userAuthService = new UserAuthService();
