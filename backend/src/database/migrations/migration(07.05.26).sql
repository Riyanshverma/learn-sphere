-- 07.05.26

CREATE OR REPLACE FUNCTION update_student_class_and_invitation_status(
  p_invitation_id UUID,
  p_student_id UUID,
  p_class_standard SMALLINT,
  p_class_section CHAR(1),
  p_new_status invitation_status_type
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
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

  UPDATE students
  SET class_id = v_class_id,
      class_roll_number = v_roll_number
  WHERE id = p_student_id;

  UPDATE invitations
  SET status = p_new_status
  WHERE id = p_invitation_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_classes_details()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'class_id', class_data.id,
        'class_standard', class_data.class_standard,
        'class_section', class_data.class_section,
        'teacher_name', class_data.full_name,
        'academic_year', class_data.academic_year,
        'class_students', class_data.student_count
      )
    ),
    '[]'::jsonb
  ) INTO v_result
  FROM (
    SELECT 
      c.id,
      c.class_standard,
      c.class_section,
      u.full_name,
      c.academic_year,
      COUNT(s.id) as student_count
    FROM classes c
    LEFT JOIN employees e ON c.class_teacher = e.id
    LEFT JOIN identity i ON e.identity_id = i.id
    LEFT JOIN users u ON i.user_id = u.id
    LEFT JOIN students s ON c.id = s.class_id
    GROUP BY c.id, u.full_name
  ) class_data;

  RETURN v_result;
END;
$$;
