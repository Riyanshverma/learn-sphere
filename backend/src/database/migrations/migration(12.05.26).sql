-- 12.05.26

CREATE TYPE leave_type AS ENUM ('sick', 'casual', 'maternity', 'paternity', 'unpaid', 'bereavement', 'other');
CREATE TYPE leave_status_type AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

CREATE TABLE leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_from_date DATE NOT NULL,
  leave_to_date DATE NOT NULL,
  leave_type leave_type NOT NULL,
  leave_reason TEXT NOT NULL,
  leave_status leave_status_type DEFAULT 'pending',
  review_comment TEXT,
  reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (leave_from_date <= leave_to_date)
);

CREATE OR REPLACE FUNCTION create_leave_application(
  p_applicant_id UUID,
  p_leave_from_date DATE,
  p_leave_to_date DATE,
  p_leave_type leave_type,
  p_leave_reason TEXT,
  p_leave_days INT
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO leave_applications (applicant_id, leave_from_date, leave_to_date, leave_type, leave_reason, leave_status) 
    VALUES (p_applicant_id, p_leave_from_date, p_leave_to_date, p_leave_type, p_leave_reason, 'pending');

    UPDATE employees
    SET leaves = jsonb_set(leaves, '{leaves_taken}', ((COALESCE((leaves->>'leaves_taken')::int, 0) + p_leave_days)::text)::jsonb), updated_at = now()
    WHERE id = p_applicant_id;
END;
$$;

-- ! Not implemented yet.
CREATE OR REPLACE FUNCTION get_approved_leaves_by_date(p_date DATE)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    result JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'employee_id', applicant_id,
        'leave_type', leave_type,
        'leave_reason', leave_reason
      )
    ), '[]'::jsonb
  ) INTO result
  FROM leave_applications
  WHERE leave_status = 'approved' 
    AND p_date BETWEEN leave_from_date AND leave_to_date;

  RETURN result;
END;
$$;
