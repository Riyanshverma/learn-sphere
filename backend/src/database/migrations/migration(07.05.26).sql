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
