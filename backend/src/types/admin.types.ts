import type { days, account_type, role } from ".";

type invitation_status = "pending" | "accepted" | "allowed" | "expired" | "revoked";
type attendance_status = "present" | "absent" | "late" | "half_day" | "holiday" | "pending";
type leave_type = 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid' | 'bereavement' | 'other';
type leave_status = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type payroll_status = 'pending' | 'processing' | 'paid' | 'failed' | 'reversed';

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

export interface EmployeeLeaveApplicationsResponse {
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
  designation: string;
  employee_code: number;
  leaves: {
    total_leaves_per_month: number;
    leaves_taken: number;
  };
  email: string;
  phone: string;
  full_name: string;
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
  on_leave: boolean;
}

export interface CreateExistingUserAsSchoolStaffType {
  id: string;
  qualifications: string;
  specialization: string;
  monthly_salary: number;
  experience_years: number;
  timings: {
    days: days[];
    from: string;
    to: string;
  };
  identity_proof: {
    aadhar_card: { number: string; url: string };
    pan_card: { number: string; url: string };
  };
  bank_details: {
    account_holder_name: string;
    branch_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    cancelled_cheque_url: string;
    upi_id?: string;
    account_type: account_type;
  };
  razorpay_contact_id: string;
  razorpay_fund_account_id: string;
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

export interface CreateNewStudentByAdmin {
  id: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  blood_group: string;
  gender: string;
  full_name: string;
  emergency_contact: { name: string; relation: string; phone: string };
  address: string;
  city: string;
  state: string;
  pincode: number;
  occupation: string;
  annual_income: number;
  student_relation: string;
  student_date_of_birth: Date;
  student_full_name: string;
  student_blood_group: string;
  student_gender: string;
  student_medical_notes: string;
  class_standard: number;
  class_section: string;
}

export interface CreateStudentWithExistingUserParentByAdmin {
  id: string;
  occupation: string;
  annual_income: number;
  student_relation: string;
  student_date_of_birth: Date;
  student_full_name: string;
  student_blood_group: string;
  student_gender: string;
  student_medical_notes: string;
  class_standard: number;
  class_section: string;
}

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
  phone: string;
  identity_id: string;
  employee_id: string;
  qualification: string;
  specialization: string;
  employee_code: number;
}

export interface SearchedStaffsResponse {
  email: string;
  full_name: string;
  phone: string;
  identity_id: string;
  employee_id: string;
  designation: string;
  employee_code: number;
  leaves: {
    total_leaves_per_month: number;
    leaves_taken: number;
  };
}

export interface CreateClassSubjectType {
  name: string;
  syllabus: string;
  subject_code: string;
  class_id: string;
  subject_teacher: string;
  academic_year: string;
}

export interface MyAttendanceResponse {
  attendance_id: string;
  date: Date;
  status: attendance_status;
  remarks: string | null;
}

export interface EmployeesPayrollsDetailsResponse {
  payroll_id: string;
  employee_id: string;
  payroll_month: string;
  due_date: string;
  base_salary: number;
  deductions: number | null;
  net_salary: number | null;
  payment_status: payroll_status;
  payment_method: 'cash' | 'online' | null;
  razorpay_payout_id: string | null;
  paid_at: string | null;
  identity_id: string;
  qualification: string;
  designation: string;
  joined_date: string;
  employee_code: number;
  monthly_salary: number;
  leaves: {
    total_leaves_per_month: number;
    leaves_taken: number;
  };
  bank_details: {
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    branch_name: string;
    ifsc_code: string;
    upi_id: string;
    account_type: string;
    cancelled_cheque_url: string;
  };
  razorpay_contact_id: string;
  razorpay_fund_account_id: string;
  email: string;
  phone: string;
  full_name: string;
}

export interface ConfirmEmployeePayrollByOnlineType {
  payroll_id: string;
  employee_id: string;
  net_salary: number;
  deductions: number;
  razorpay_payout_id: string;
  status: string;
  utr_id: string | null;
  paid_at: Date;
}

export interface UpdateEmployeePayrollStatusFromWebhookType {
  razorpay_payout_id: string;
  status: string;
  utr_id: string | null;
  paid_at: Date;
}

export interface AllSchoolTeachersResponse {
  email: string;
  full_name: string;
  identity_id: string;
  employee_id: string;
  qualification: string;
  specialization: string;
  designation: string;
  joined_date: string;
  employee_code: number;
  monthly_salary: number;
  leaves: {
    total_leaves_per_month: number;
    leaves_taken: number;
  };
  class: {
    class_id: string;
    class_standard: number;
    class_section: string;
  } | null;
  subjects: {
    id: string;
    name: string;
    subject_code: string;
    class_id: string;
    academic_year: string;
  }[];
}