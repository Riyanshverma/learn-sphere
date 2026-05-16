-- 16.05.26

CREATE OR REPLACE FUNCTION confirm_employee_payroll_by_cash(
    p_employee_id UUID,
    p_payroll_id UUID,
    p_deductions NUMERIC,
    p_net_salary NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE employee_payrolls
    SET 
        deductions = p_deductions,
        net_salary = p_net_salary,
        status = 'paid',
        payment_method = 'cash',
        paid_at = now(),
        updated_at = now()
    WHERE id = p_payroll_id;

    UPDATE employees
    SET 
        leaves = jsonb_set(leaves, '{leaves_taken}', '0'::jsonb),
        updated_at = now()
    WHERE id = p_employee_id;
END;
$$;

CREATE OR REPLACE FUNCTION confirm_employee_payroll_by_online(
    p_employee_id UUID,
    p_payroll_id UUID,
    p_deductions NUMERIC,
    p_net_salary NUMERIC,
    p_razorpay_payout_id TEXT,
    p_status TEXT,
    p_utr_id TEXT,
    p_paid_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE employee_payrolls
    SET 
        deductions = p_deductions,
        net_salary = p_net_salary,
        status = CASE 
            WHEN p_status = 'processed' THEN 'paid'::payroll_status
            WHEN p_status = 'queued' THEN 'processing'::payroll_status
            ELSE p_status::payroll_status
        END,
        payment_method = 'online',
        razorpay_payout_id = p_razorpay_payout_id,
        utr_id = p_utr_id,
        paid_at = p_paid_at,
        updated_at = now()
    WHERE id = p_payroll_id;

    UPDATE employees
    SET 
        leaves = jsonb_set(leaves, '{leaves_taken}', '0'::jsonb),
        updated_at = now()
    WHERE id = p_employee_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_searched_teachers_for_class_teacher(
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
      e.qualification,
      e.specialization,
      e.employee_code,
      ts_rank(u.search_user_vector, websearch_to_tsquery('english', p_search)) AS fts_rank,
      similarity(u.full_name, p_search) AS trigram_rank
    FROM users u
    JOIN identity i ON i.user_id = u.id
    JOIN employees e ON e.identity_id = i.id
    WHERE i.role = 'teacher'
      AND i.active = true
      AND i.verified = true
      AND NOT EXISTS (
        SELECT 1 FROM classes c WHERE c.class_teacher = e.id
      )
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
        'phone', phone,
        'identity_id', identity_id,
        'employee_id', employee_id,
        'qualification', qualification,
        'specialization', specialization,
        'employee_code', employee_code
      )
    ), 
  '[]'::jsonb)
  FROM search_results;
$$;