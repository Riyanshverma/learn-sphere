-- 25.04.26

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE role_type AS ENUM ('admin', 'teacher', 'staff', 'parent');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group blood_group_type NOT NULL,
  gender gender_type NOT NULL,
  full_name TEXT NOT NULL,
  emergency_contact JSONB NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode CHAR(6) NOT NULL,
  location POINT DEFAULT POINT(26.9237692, 75.7233795), -- default location
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$')
);

CREATE TABLE identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role role_type NOT NULL,
  verified BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL UNIQUE REFERENCES identity(id) ON DELETE CASCADE,
  qualification TEXT NOT NULL,
  specialization TEXT NOT NULL,
  designation TEXT NOT NULL,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  employee_code SERIAL UNIQUE,
  monthly_salary NUMERIC(10,2) NOT NULL,
  experience_years NUMERIC(4,1),
  timings JSONB NOT NULL,
  leaves JSONB NOT NULL DEFAULT '{"total_leaves_per_year": 20, "leaves_taken": 0}'::JSONB,
  identity_proof JSONB NOT NULL,
  bank_details JSONB NOT NULL,
  razorpay_contact_id TEXT NOT NULL,
  razorpay_fund_account_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION create_admin(
  p_id UUID,
  p_email TEXT,
  p_phone TEXT,
  p_full_name TEXT,
  p_date_of_birth DATE,
  p_blood_group blood_group_type,
  p_gender gender_type,
  p_emergency_contact JSONB,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_pincode CHAR(6),
  p_qualifications TEXT,
  p_specialization TEXT,
  p_monthly_salary NUMERIC,
  p_experience_years NUMERIC,
  p_timings JSONB,
  p_identity_proof JSONB,
  p_bank_details JSONB,
  p_razorpay_contact_id TEXT,
  p_razorpay_fund_account_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_employee_row employees%ROWTYPE;
BEGIN
  INSERT INTO users (id, email, phone, full_name, date_of_birth, blood_group, gender, emergency_contact, address, city, state, pincode)
  VALUES (p_id, p_email, p_phone, p_full_name, p_date_of_birth, p_blood_group, p_gender, p_emergency_contact, p_address, p_city, p_state, p_pincode);

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'admin')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details, razorpay_contact_id, razorpay_fund_account_id)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'admin', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details, p_razorpay_contact_id, p_razorpay_fund_account_id)
  RETURNING * INTO v_employee_row;

  RETURN jsonb_build_object(
    'email', p_email,
    'phone', p_phone,
    'date_of_birth', p_date_of_birth,
    'blood_group', p_blood_group,
    'gender', p_gender,
    'full_name', p_full_name,
    'emergency_contact', p_emergency_contact,
    'address', p_address,
    'identity_id', v_identity_id,
    'role', 'admin',
    'verified', true,
    'active', true,
    'employee_id', v_employee_row.id,
    'qualification', v_employee_row.qualification,
    'specialization', v_employee_row.specialization,
    'designation', v_employee_row.designation,
    'joined_date', v_employee_row.joined_date,
    'employee_code', v_employee_row.employee_code,
    'monthly_salary', v_employee_row.monthly_salary,
    'experience_years', v_employee_row.experience_years,
    'timings', v_employee_row.timings,
    'leaves', v_employee_row.leaves,
    'identity_proof', v_employee_row.identity_proof,
    'bank_details', v_employee_row.bank_details
  );
END;
$$;
