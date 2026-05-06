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