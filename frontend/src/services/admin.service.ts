import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types";

class AdminService {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }

  async addNewSchoolStaff(data: FormData): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse<any>>('/school-academic/add-new-school-staff', data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
}

export const adminService = new AdminService();
