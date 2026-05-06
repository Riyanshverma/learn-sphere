-- 06.05.26

CREATE OR REPLACE FUNCTION get_parent_invitations()
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
          'invitation_id', i.id,
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
          'parent_id', p.id,
          'occupation', p.occupation,
          'annual_income', p.annual_income,
          'student_relation', p.student_relation,
          'student_id', s.id,
          'student_date_of_birth', s.date_of_birth,
          'student_full_name', s.full_name,
          'student_blood_group', s.blood_group,
          'student_gender', s.gender,
          'admission_number', s.admission_number,
          'admission_date', s.admission_date,
          'medical_notes', s.medical_notes
        )
      )
      ORDER BY i.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM invitations i
  LEFT JOIN users u ON i.user_id = u.id AND i.status = 'accepted'
  LEFT JOIN identity id ON i.user_id = id.user_id AND id.role = 'parent' AND i.status = 'accepted'
  LEFT JOIN parents p ON id.id = p.identity_id AND i.status = 'accepted'
  LEFT JOIN students s ON p.id = s.parent_id AND i.status = 'accepted'
  WHERE i.role = 'parent';

  RETURN v_result;

END;
$$;

CREATE OR REPLACE FUNCTION create_new_student_by_admin(
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
  p_student_medical_notes TEXT,
  p_class_standard SMALLINT,
  p_class_section CHAR(1)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_parent_id UUID;
  v_class_id UUID;
  v_roll_number SMALLINT;
BEGIN
  SELECT id INTO v_class_id
  FROM classes
  WHERE class_standard = p_class_standard AND class_section = p_class_section;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Class % % not found', p_class_standard, p_class_section;
  END IF;

  SELECT COALESCE(MAX(class_roll_number), 0) + 1 INTO v_roll_number
  FROM students
  WHERE class_id = v_class_id;

  INSERT INTO users (id, email, phone, full_name, date_of_birth, blood_group, gender, emergency_contact, address, city, state, pincode)
  VALUES (p_id, p_email, p_phone, p_full_name, p_date_of_birth, p_blood_group, p_gender, p_emergency_contact, p_address, p_city, p_state, p_pincode);

  INSERT INTO identity (user_id, role)
  VALUES (p_id, 'parent')
  RETURNING id INTO v_identity_id;

  INSERT INTO parents (identity_id, occupation, annual_income, student_relation)
  VALUES (v_identity_id, p_occupation, p_annual_income, p_student_relation)
  RETURNING id INTO v_parent_id;

  INSERT INTO students (date_of_birth, full_name, blood_group, gender, parent_id, medical_notes, class_id, class_roll_number)
  VALUES (p_student_date_of_birth, p_student_full_name, p_student_blood_group, p_student_gender, v_parent_id, p_student_medical_notes, v_class_id, v_roll_number);
  
END;
$$;

CREATE OR REPLACE FUNCTION create_student_with_existing_user_parent_by_admin(
  p_id UUID,
  p_occupation TEXT,
  p_annual_income NUMERIC,
  p_student_relation TEXT,
  p_student_date_of_birth DATE,
  p_student_full_name TEXT,
  p_student_blood_group blood_group_type,
  p_student_gender gender_type,
  p_student_medical_notes TEXT,
  p_class_standard SMALLINT,
  p_class_section CHAR(1)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_identity_id UUID;
  v_parent_id UUID;
  v_class_id UUID;
  v_roll_number SMALLINT;
BEGIN
  SELECT id INTO v_class_id
  FROM classes
  WHERE class_standard = p_class_standard AND class_section = p_class_section;

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Class % % not found', p_class_standard, p_class_section;
  END IF;

  SELECT COALESCE(MAX(class_roll_number), 0) + 1 INTO v_roll_number
  FROM students
  WHERE class_id = v_class_id;

  SELECT id INTO v_identity_id
  FROM identity
  WHERE user_id = p_id AND role = 'parent';

  IF v_identity_id IS NULL THEN
    INSERT INTO identity (user_id, role)
    VALUES (p_id, 'parent')
    RETURNING id INTO v_identity_id;
  END IF;

  SELECT id INTO v_parent_id
  FROM parents
  WHERE identity_id = v_identity_id;

  IF v_parent_id IS NULL THEN
    INSERT INTO parents (identity_id, occupation, annual_income, student_relation)
    VALUES (v_identity_id, p_occupation, p_annual_income, p_student_relation)
    RETURNING id INTO v_parent_id;
  END IF;

  INSERT INTO students (date_of_birth, full_name, blood_group, gender, parent_id, medical_notes, class_id, class_roll_number)
  VALUES (p_student_date_of_birth, p_student_full_name, p_student_blood_group, p_student_gender, v_parent_id, p_student_medical_notes, v_class_id, v_roll_number);

END;
$$;
