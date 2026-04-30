-- 30.04.26

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
  VALUES (p_id, 'staff')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'staff', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details)
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
    'role', 'staff',
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
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_user_row users%ROWTYPE;
  v_employee_row employees%ROWTYPE;
BEGIN
  SELECT * INTO v_user_row FROM users WHERE id = p_id;
  
  IF v_user_row.id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'staff')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'staff', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details)
  RETURNING * INTO v_employee_row;

  RETURN jsonb_build_object(
    'email', v_user_row.email,
    'phone', v_user_row.phone,
    'date_of_birth', v_user_row.date_of_birth,
    'blood_group', v_user_row.blood_group,
    'gender', v_user_row.gender,
    'full_name', v_user_row.full_name,
    'emergency_contact', v_user_row.emergency_contact,
    'address', v_user_row.address,
    'identity_id', v_identity_id,
    'role', 'staff',
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
