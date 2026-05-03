export type role = "admin" | "teacher" | "staff" | "parent" | "student";

type days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type account_type = "savings" | "current";

type gender = "male" | "female" | "other";

type blood_group = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface UserLoginResponse {
  identity_id: string;
  role: role;
  verified: boolean;
  active: boolean;
}

export interface CreateAdminResponse {
  email: string;
  phone: string;
  date_of_birth: Date;
  blood_group: blood_group;
  gender: gender;
  full_name: string;
  emergency_contact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  identity_id: string;
  role: role;
  verified: boolean;
  active: boolean;
  employee_id: string;
  qualification: string;
  specialization: string;
  designation: string;
  joined_date: Date;
  employee_code: number;
  monthly_salary: number;
  experience_years: number;
  timings: {
    days: days[];
    from: string;
    to: string;
  };
  leaves: {
    total_leaves_per_year: number;
    leaves_taken: number;
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
}