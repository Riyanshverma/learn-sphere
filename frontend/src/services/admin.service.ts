import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiSuccessResponse, ApiErrorResponse, TeacherInvitationsResponse, ParentInvitationsResponse, AllClassesDetailsResponse, SearchedTeachersResponse, EmployeesAttendanceResponse } from "@/types";
import type { InvitationType, SelectStudentClassType, StudentWithExistingUserParentType, StudentWithNewParentType, SearchType } from "@/validation";

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

  async getParentInvitations(): Promise<ApiSuccessResponse<ParentInvitationsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<ParentInvitationsResponse[]>>('/school-academic/parent-invitations');

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async addNewstudent (data: StudentWithNewParentType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/add-new-student', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async addStudentWithExistingUserParent(data: StudentWithExistingUserParentType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/add-student-with-existing-user-parent', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async updateStudentClassAndInvitationStatus(data: SelectStudentClassType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.patch<ApiSuccessResponse>('/school-academic/update-student-class-and-invitation-status', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getAllClassesDetails(): Promise<ApiSuccessResponse<AllClassesDetailsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<AllClassesDetailsResponse[]>>('/school-academic/all-classes-details');

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getSearchTeachers(data: SearchType): Promise<ApiSuccessResponse<SearchedTeachersResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse>('/school-academic/search-teachers', { params: data });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async addClassSubject(data: FormData): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.post<ApiSuccessResponse>('/school-academic/add-class-subject', data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getEmployeesAttendance(date: Date): Promise<ApiSuccessResponse<EmployeesAttendanceResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<EmployeesAttendanceResponse[]>>('/quick-actions/employees-attendance', { params: { date: date.toISOString().split('T')[0] } });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
} 

export const adminService = new AdminService();
