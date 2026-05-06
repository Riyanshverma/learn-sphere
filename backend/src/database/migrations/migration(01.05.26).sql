-- 01.05.26

CREATE OR REPLACE FUNCTION create_new_school_staff(
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
  p_bank_details JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
BEGIN
  INSERT INTO users (id, email, phone_number, full_name, date_of_birth, blood_group, gender, emergency_contact, address, city, state, pincode)
  VALUES (p_id, p_email, p_phone, p_full_name, p_date_of_birth, p_blood_group, p_gender, p_emergency_contact, p_address, p_city, p_state, p_pincode);

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'staff')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'staff', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details);
END;
$$;

CREATE OR REPLACE FUNCTION create_existing_user_as_school_staff(
  p_id UUID,
  p_qualifications TEXT,
  p_specialization TEXT,
  p_monthly_salary NUMERIC,
  p_experience_years NUMERIC,
  p_timings JSONB,
  p_identity_proof JSONB,
  p_bank_details JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'staff')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'staff', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details);
END;
$$;
