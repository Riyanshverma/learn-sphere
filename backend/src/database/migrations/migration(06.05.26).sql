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
