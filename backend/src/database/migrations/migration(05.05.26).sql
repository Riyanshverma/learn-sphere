-- 05.05.26

CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- parent_id
  identity_id UUID NOT NULL UNIQUE REFERENCES identity(id) ON DELETE CASCADE,
  occupation TEXT,
  annual_income NUMERIC(12,2),
  student_relation TEXT, -- e.g. "father", "mother", "guardian"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (annual_income IS NULL OR annual_income >= 0)
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- student_id
  date_of_birth DATE,
  full_name TEXT NOT NULL,
  blood_group blood_group_type,
  gender gender_type,
  admission_number SERIAL UNIQUE,
  admission_date DATE DEFAULT CURRENT_DATE,
  parent_id UUID REFERENCES parents(id) ON DELETE SET NULL,
  medical_notes TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  class_roll_number SMALLINT, -- usually 1 to 60
  student_status student_status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (class_roll_number IS NULL OR class_roll_number BETWEEN 1 AND 60)
);

CREATE OR REPLACE FUNCTION create_new_student(
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
  p_occupation TEXT,
  p_annual_income NUMERIC,
  p_student_relation TEXT,
  p_student_date_of_birth DATE,
  p_student_full_name TEXT,
  p_student_blood_group blood_group_type,
  p_student_gender gender_type,
  p_student_medical_notes TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_parent_id UUID;
BEGIN
  INSERT INTO users (id, email, phone_number, full_name, date_of_birth, blood_group, gender, emergency_contact, address, city, state, pincode)
  VALUES (p_id, p_email, p_phone, p_full_name, p_date_of_birth, p_blood_group, p_gender, p_emergency_contact, p_address, p_city, p_state, p_pincode);

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'parent')
  RETURNING id INTO v_identity_id;

  INSERT INTO parents (identity_id, occupation, annual_income, student_relation)
  VALUES (v_identity_id, p_occupation, p_annual_income, p_student_relation)
  RETURNING id INTO v_parent_id;

  INSERT INTO students (date_of_birth, full_name, blood_group, gender, parent_id, medical_notes)
  VALUES (p_student_date_of_birth, p_student_full_name, p_student_blood_group, p_student_gender, v_parent_id, p_student_medical_notes);

  UPDATE invitations
  SET status = 'accepted'
  WHERE user_id = p_id AND status = 'pending' AND role = 'parent';
END;
$$;

CREATE OR REPLACE FUNCTION create_student_existing_user(
  p_id UUID,
  p_occupation TEXT,
  p_annual_income NUMERIC,
  p_student_relation TEXT,
  p_student_date_of_birth DATE,
  p_student_full_name TEXT,
  p_student_blood_group blood_group_type,
  p_student_gender gender_type,
  p_student_medical_notes TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_parent_id UUID;
BEGIN
  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'parent')
  RETURNING id INTO v_identity_id;

  INSERT INTO parents (identity_id, occupation, annual_income, student_relation)
  VALUES (v_identity_id, p_occupation, p_annual_income, p_student_relation)
  RETURNING id INTO v_parent_id;

  INSERT INTO students (date_of_birth, full_name, blood_group, gender, parent_id, medical_notes)
  VALUES (p_student_date_of_birth, p_student_full_name, p_student_blood_group, p_student_gender, v_parent_id, p_student_medical_notes);

  UPDATE invitations
  SET status = 'accepted'
  WHERE user_id = p_id AND status = 'pending' AND role = 'parent';
END;
$$;
