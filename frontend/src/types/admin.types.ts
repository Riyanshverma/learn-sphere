import type { role, account_type } from "."

type invitation_status = "pending" | "accepted" | "allowed" | "expired" | "revoked";
export type attendance_status = "present" | "absent" | "late" | "half_day" | "holiday" | "pending";
type leave_type = 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid' | 'bereavement' | 'other';
type leave_status = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface MyLeaveApplicationsResponse {
  leave_application_id: string;
  applicant_id: string;
  leave_from_date: string;
  leave_to_date: string;
  leave_type: leave_type;
  leave_reason: string;
  leave_status: leave_status;
  review_comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface EmployeesAttendanceResponse {
  attendance_id: string | null;
  employee_id: string;
  date: string | null;
  status: attendance_status | null;
  remarks: string | null;
  designation: string;
  employee_code: number;
  full_name: string;
}

export interface TeacherInvitationsResponse {
  invitation_id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: role;
  status: invitation_status;
  created_at: Date;
  phone?: string;
  date_of_birth?: Date;
  emergency_contact?: { name: string; relation: string; phone: string; };
  address?: string;
  identity_id?: string;
  qualification?: string;
  specialization?: string;
  experience_years?: number;
  identity_proof?: { aadhar_card: { number: string; url: string }; pan_card: { number: string; url: string }; };
  bank_details?: { account_holder_name: string; branch_name: string; bank_name: string; account_number: string; ifsc_code: string; cancelled_cheque_url: string; upi_id?: string; account_type: account_type; };
};

export interface ParentInvitationsResponse {
  invitation_id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: role;
  status: invitation_status;
  created_at: Date;
  phone?: string;
  date_of_birth?: Date;
  emergency_contact?: { name: string; relation: string; phone: string; };
  address?: string;
  parent_id?: string;
  occupation?: string;
  annual_income?: number;
  student_relation?: string;
  student_id?: string;
  student_date_of_birth?: Date;
  student_full_name?: string;
  student_blood_group?: string;
  student_gender?: string;
  admission_number?: number;
  admission_date?: Date;
  medical_notes?: string;
};

export interface AllClassesDetailsResponse {
  class_id: string
  class_standard: number
  class_section: string
  teacher_name: string
  academic_year: string
  class_students: number
}

export interface SearchedTeachersResponse {
  email: string;
  full_name: string;
  phone_number: string;
  identity_id: string;
  employee_id: string;
  qualification: string;
  specialization: string;
  employee_code: number;
}

export interface UpdateSingleEmployeeAttendanceType {
  attendance_id: string | null;
  employee_id: string;
  date: string;
  status: attendance_status;
  remarks: string | null;
}