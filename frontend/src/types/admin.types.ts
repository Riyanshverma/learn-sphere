import type { role, account_type } from "."

type invitation_status = "pending" | "accepted" | "allowed" | "expired" | "revoked";

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
