-- 11.05.26

CREATE OR REPLACE FUNCTION get_employees_attendance(p_date DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'attendance_id', ea.id,
        'employee_id', e.id,
        'date', p_date,
        'status', ea.status,
        'remarks', ea.remarks,
        'designation', e.designation,
        'employee_code', e.employee_code,
        'full_name', u.full_name
      )
    ),
    '[]'::jsonb
  ) INTO result
  FROM employees e
    JOIN identity i ON e.identity_id = i.id
    JOIN users u ON i.user_id = u.id
    JOIN employee_attendance ea ON e.id = ea.employee_id AND ea.date = p_date
    WHERE i.active = true AND i.verified = true;

    RETURN result;
END;
$$;
