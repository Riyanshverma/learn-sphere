-- 17.05.26

CREATE OR REPLACE FUNCTION get_all_school_teachers()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH teacher_subjects AS (
    SELECT 
      subject_teacher,
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'name', name,
          'subject_code', subject_code,
          'class_id', class_id,
          'academic_year', academic_year
        )
      ) AS subjects
    FROM subjects
    WHERE active = true
    GROUP BY subject_teacher
  )
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'email', u.email,
      'full_name', u.full_name,
      'identity_id', i.id,
      'employee_id', e.id,
      'qualification', e.qualification,
      'specialization', e.specialization,
      'designation', e.designation,
      'joined_date', e.joined_date,
      'employee_code', e.employee_code,
      'monthly_salary', e.monthly_salary,
      'leaves', e.leaves,
      'class', CASE 
        WHEN c.id IS NOT NULL THEN jsonb_build_object(
          'class_id', c.id,
          'class_standard', c.class_standard,
          'class_section', c.class_section
        ) 
        ELSE null 
      END,
      'subjects', COALESCE(ts.subjects, '[]'::jsonb)
    )
  ), '[]'::jsonb)
  FROM users u
  JOIN identity i ON i.user_id = u.id
  JOIN employees e ON e.identity_id = i.id
  LEFT JOIN classes c ON c.class_teacher = e.id
  LEFT JOIN teacher_subjects ts ON ts.subject_teacher = e.id
  WHERE i.role = 'teacher' AND i.active = true AND i.verified = true;
$$;
