import type { days, account_type } from ".";

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
}
