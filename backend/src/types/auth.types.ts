type blood_group = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

type gender = 'male' | 'female' | 'other';

type account_type = 'savings' | 'current';

type days = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface createDatabaseUserType { email: string; password: string; phone: string; full_name: string; };

export interface uploadDocumentType { name: string; buffer: ArrayBuffer; mime_type: string; };

export interface uploadDocumentResponse { id: string; path: string; fullPath: string; }; 

export interface createAdminType {
  id: string;
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
  city: string;
  state: string;
  pincode: number;
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
    bank_branch_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    cancelled_cheque_url: string;
    upi_id?: string;
    account_type: account_type;
  };
}