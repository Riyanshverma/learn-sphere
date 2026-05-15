import axios, { type AxiosInstance, type AxiosError } from "axios";

import type { ApiSuccessResponse, ApiErrorResponse, TeacherInvitationsResponse, ParentInvitationsResponse, AllClassesDetailsResponse, SearchedTeachersResponse, SearchedStaffsResponse, EmployeesAttendanceResponse, UpdateSingleEmployeeAttendanceType, MyLeaveApplicationsResponse, EmployeeLeaveApplicationsResponse, MyAttendanceResponse, EmployeesPayrollsDetailsResponse } from "@/types";

import type { InvitationType, SelectStudentClassType, StudentWithExistingUserParentType, StudentWithNewParentType, SearchType, ApplyForLeaveType, UpdateEmployeeLeaveApplicationStatusType } from "@/validation";

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

  async updateSingleEmployeeAttendance(data: UpdateSingleEmployeeAttendanceType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.patch<ApiSuccessResponse>('/quick-actions/update-employee-attendance', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async applyForLeaveApplication({ applicant_id, leave_days, leave_from_date, leave_to_date, leave_reason, leave_type }: ApplyForLeaveType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {    
      const response = await this.apiClient.post<ApiSuccessResponse>('/quick-actions/apply-for-leave-application', {
        applicant_id,
        leave_days,
        leave_from_date: new Date(leave_from_date.getTime() - (leave_from_date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
        leave_to_date: new Date(leave_to_date.getTime() - (leave_to_date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
        leave_reason,
        leave_type
      });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getMyLeaveApplications(employee_id: string): Promise<ApiSuccessResponse<MyLeaveApplicationsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<MyLeaveApplicationsResponse[]>>('/quick-actions/my-leave-applications', { params: { employee_id } });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async cancelLeaveApplication(leave_application_id: string): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.patch<ApiSuccessResponse>('/quick-actions/cancel-leave-application', { leave_application_id });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getEmployeesLeaveApplications(page_number: number, limit: string): Promise<ApiSuccessResponse<EmployeeLeaveApplicationsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<EmployeeLeaveApplicationsResponse[]>>('/quick-actions/employees-leave-applications', { params: { page_number, limit } });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getSearchStaffs(data: SearchType): Promise<ApiSuccessResponse<SearchedStaffsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<SearchedStaffsResponse[]>>('/quick-actions/search-staff', { params: data });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async updateEmployeeLeaveApplicationStatus(data: UpdateEmployeeLeaveApplicationStatusType): Promise<ApiSuccessResponse | ApiErrorResponse> {
    try {
      const response = await this.apiClient.patch<ApiSuccessResponse>('/quick-actions/update-employee-leave-application-status', data);

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getMyAttendance(employee_id: string): Promise<ApiSuccessResponse<MyAttendanceResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<MyAttendanceResponse[]>>('/quick-actions/my-attendance', { params: { employee_id } });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }

  async getEmployeesPayrollsDetails(page_number: number, limit: string): Promise<ApiSuccessResponse<EmployeesPayrollsDetailsResponse[]> | ApiErrorResponse> {
    try {
      const response = await this.apiClient.get<ApiSuccessResponse<EmployeesPayrollsDetailsResponse[]>>('/finance/employees-payrolls-details', { params: { page_number, limit } });

      return response.data;
    } catch (error: any) {
      return (error as AxiosError<ApiErrorResponse>).response?.data as ApiErrorResponse;
    }
  }
}

export const adminService = new AdminService();
