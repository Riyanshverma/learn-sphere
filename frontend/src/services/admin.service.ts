import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse, TeacherInvitationsResponse } from "@/types";
import type { AddTeacherInvitationType } from "@/validation";

class AdminService {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }

  async addNewSchoolStaff(data: FormData): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/add-new-school-staff', data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async addExistingUserAsSchoolStaff(data: FormData): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/add-existing-user-as-school-staff', data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async sendTeacherInvitation(data: AddTeacherInvitationType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/send-teacher-invitation', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getTeacherInvitations(): Promise<ApiSuccessResponse<TeacherInvitationsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<TeacherInvitationsResponse[]>>('/school-academic/teacher-invitations');

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
}

export const adminService = new AdminService();
