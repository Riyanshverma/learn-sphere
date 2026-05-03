-- 03.05.26

CREATE OR REPLACE FUNCTION create_new_school_teacher(
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
  INSERT INTO users (id, email, phone, full_name, date_of_birth, blood_group, gender, emergency_contact, address, city, state, pincode)
  VALUES (p_id, p_email, p_phone, p_full_name, p_date_of_birth, p_blood_group, p_gender, p_emergency_contact, p_address, p_city, p_state, p_pincode);

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'teacher')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'teacher', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details);

  UPDATE invitations
  SET status = 'accepted'
  WHERE user_id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_existing_user_as_school_teacher(
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
  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'teacher')
  RETURNING id INTO v_identity_id;

  INSERT INTO employees (identity_id, qualification, specialization, designation, monthly_salary, experience_years, timings, identity_proof, bank_details)
  VALUES (v_identity_id, p_qualifications, p_specialization, 'teacher', p_monthly_salary, p_experience_years, p_timings, p_identity_proof, p_bank_details);

  UPDATE invitations
  SET status = 'accepted'
  WHERE user_id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_teacher_invitations()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_strip_nulls(
        jsonb_build_object(
          'user_id', i.user_id,
          'email', i.email,
          'full_name', i.full_name,
          'role', i.role,
          'status', i.status,
          'created_at', i.created_at,
          'phone', u.phone,
          'date_of_birth', u.date_of_birth,
          'emergency_contact', u.emergency_contact,
          'address', u.address,
          'identity_id', id.id,
          'qualification', e.qualification,
          'specialization', e.specialization,
          'experience_years', e.experience_years,
          'identity_proof', e.identity_proof,
          'bank_details', e.bank_details
        )
      )
      ORDER BY i.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM invitations i
  LEFT JOIN users u ON i.user_id = u.id AND i.status = 'accepted'
  LEFT JOIN identity id ON i.user_id = id.user_id AND id.role = 'teacher' AND i.status = 'accepted'
  LEFT JOIN employees e ON id.id = e.identity_id AND i.status = 'accepted'
  WHERE i.role = 'teacher';

  RETURN v_result;
END;
$$;