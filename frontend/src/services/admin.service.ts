import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse, TeacherInvitationsResponse } from "@/types";
import type { InvitationType } from "@/validation";

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

  async sendTeacherInvitation(data: InvitationType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/send-teacher-invitation', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async sendStudentInvitation(data: InvitationType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/send-student-invitation', data);

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
  
  async updateInvitationStatus(invitation_id: string, new_status: "allowed" | "revoked"): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try{
      const response = await this.apiClient.patch<ApiSuccessResponse>('/school-academic/update-invitation-status', { invitation_id, new_status });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getParentInvitations(): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse>('/school-academic/parent-invitations');

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
} 

export const adminService = new AdminService();
