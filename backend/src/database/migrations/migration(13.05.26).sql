-- 13.05.26

CREATE OR REPLACE FUNCTION get_searched_staffs(
  p_search TEXT
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH search_results AS (
    SELECT 
      u.email,
      u.full_name,
      u.phone,
      i.id AS identity_id,
      e.id AS employee_id,
      e.designation,
      e.employee_code,
      e.leaves,
      ts_rank(u.search_user_vector, websearch_to_tsquery('english', p_search)) AS fts_rank,
      similarity(u.full_name, p_search) AS trigram_rank
    FROM users u
    JOIN identity i ON i.user_id = u.id
    LEFT JOIN employees e ON e.identity_id = i.id
    WHERE i.role = 'staff'
      AND i.active = true
      AND i.verified = true
      AND (
        u.search_user_vector @@ websearch_to_tsquery('english', p_search)
        OR u.full_name % p_search
      )
    ORDER BY fts_rank DESC, trigram_rank DESC
    LIMIT 10
  )
  SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'email', email,
        'full_name', full_name,
        'phone_number', phone,
        'identity_id', identity_id,
        'employee_id', employee_id,
        'designation', designation,
        'employee_code', employee_code,
        'leaves', leaves
      )
    ), 
  '[]'::jsonb)
  FROM search_results;
$$;

CREATE OR REPLACE FUNCTION update_employee_leave_application_status(
  p_leave_application_id UUID,
  p_new_status leave_status_type,
  p_review_comment TEXT,
  p_reviewed_by UUID
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_applicant_id UUID;
    v_leave_days INT;
    v_current_status leave_status_type;
BEGIN
    SELECT applicant_id, (leave_to_date - leave_from_date + 1), leave_status 
    INTO v_applicant_id, v_leave_days, v_current_status
    FROM leave_applications
    WHERE id = p_leave_application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave application not found';
    END IF;

    IF v_current_status != 'pending' THEN
        RETURN;
    END IF;

    UPDATE leave_applications 
    SET 
      leave_status = p_new_status, 
      review_comment = p_review_comment, 
      reviewed_by = p_reviewed_by, 
      reviewed_at = now(), 
      updated_at = now()
    WHERE id = p_leave_application_id;

    IF p_new_status = 'rejected' THEN
        UPDATE employees
        SET leaves = jsonb_set(
            leaves, 
            '{leaves_taken}', 
            ((GREATEST(0, (COALESCE(leaves->>'leaves_taken', '0')::int - v_leave_days)))::text)::jsonb
        ), 
        updated_at = now()
        WHERE id = v_applicant_id;
    END IF;
END;
$$;
