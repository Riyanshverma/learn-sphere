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

CREATE OR REPLACE FUNCTION cancel_leave_application(p_leave_application_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_applicant_id UUID;
    v_leave_days INT;
BEGIN
    UPDATE leave_applications 
    SET leave_status = 'cancelled', updated_at = now()
    WHERE id = p_leave_application_id AND leave_status = 'pending'
    RETURNING applicant_id, (leave_to_date - leave_from_date + 1) INTO v_applicant_id, v_leave_days;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave application not found or already processed';
    END IF;

    UPDATE employees
    SET leaves = jsonb_set(
        leaves, 
        '{leaves_taken}', 
        ((GREATEST(0, (COALESCE(leaves->>'leaves_taken', '0')::int - v_leave_days)))::text)::jsonb
    ), 
    updated_at = now()
    WHERE id = v_applicant_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_employees_leave_applications(
  p_page_number INT,
  p_limit INT
)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'leave_application_id', la.id,
      'applicant_id', la.applicant_id,
      'leave_from_date', la.leave_from_date,
      'leave_to_date', la.leave_to_date,
      'leave_type', la.leave_type,
      'leave_reason', la.leave_reason,
      'leave_status', la.leave_status,
      'review_comment', la.review_comment,
      'reviewed_by', la.reviewed_by,
      'reviewed_at', la.reviewed_at,
      'created_at', la.created_at,
      'designation', e.designation,
      'employee_code', e.employee_code,
      'leaves', e.leaves,
      'email', u.email,
      'phone_number', u.phone,
      'full_name', u.full_name
    )
  FROM leave_applications la
  JOIN employees e ON la.applicant_id = e.id
  JOIN identity i ON e.identity_id = i.id
  JOIN users u ON i.user_id = u.id
  WHERE i.verified = true AND i.active = true
  ORDER BY la.created_at DESC
  LIMIT p_limit
  OFFSET (p_page_number - 1) * p_limit;
END;
$$;
