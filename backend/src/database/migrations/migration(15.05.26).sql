-- 15.05.26
CREATE TYPE payroll_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'reversed');
CREATE TYPE payment_method_type AS ENUM ('cash', 'online');

CREATE TABLE employee_payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_month DATE NOT NULL,
  due_date DATE NOT NULL,
  base_salary NUMERIC(10,2) NOT NULL,
  deductions NUMERIC(10,2),
  net_salary NUMERIC(10,2),
  status payroll_status DEFAULT 'pending',
  payment_method payment_method_type,
  razorpay_payout_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (employee_id, payroll_month)
);

SELECT cron.schedule(
  'generate-monthly-employee-payrolls',
  '0 0 1 * *',
  $$
    INSERT INTO employee_payrolls (employee_id, payroll_month, due_date, base_salary, status)
    SELECT 
      e.id, 
      (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::DATE as payroll_month,
      make_date(
        CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INT),
        CAST(EXTRACT(MONTH FROM CURRENT_DATE) AS INT),
        CAST(LEAST(
          EXTRACT(DAY FROM e.joined_date),
          EXTRACT(DAY FROM (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'))
        ) AS INT)
      ) as due_date,
      e.monthly_salary,
      'pending'::payroll_status
    FROM employees e
    JOIN identity i ON e.identity_id = i.id
    WHERE i.active = true
    ON CONFLICT (employee_id, payroll_month) DO NOTHING;
  $$
);

CREATE OR REPLACE FUNCTION get_employees_payrolls_details(
  p_page_number INT,
  p_limit INT
)
RETURNS SETOF JSONB AS $$
BEGIN
  RETURN QUERY
  SELECT 
      jsonb_build_object(
        'payroll_id', ep.id,
        'employee_id', ep.employee_id,
        'payroll_month', ep.payroll_month,
        'due_date', ep.due_date,
        'base_salary', ep.base_salary,
        'deductions', ep.deductions,
        'net_salary', ep.net_salary,
        'payroll_status', ep.status,
        'payment_method', ep.payment_method,
        'razorpay_payout_id', ep.razorpay_payout_id,
        'paid_at', ep.paid_at,
        'identity_id', e.identity_id,
        'qualification', e.qualification,
        'designation', e.designation,
        'joined_date', e.joined_date,
        'employee_code', e.employee_code,
        'monthly_salary', e.monthly_salary,
        'leaves', e.leaves,
        'bank_details', e.bank_details,
        'razorpay_contact_id', e.razorpay_contact_id,
        'razorpay_fund_account_id', e.razorpay_fund_account_id,
        'email', u.email,
        'phone', u.phone,
        'full_name', u.full_name
      )
  FROM employee_payrolls ep
  JOIN employees e ON ep.employee_id = e.id
  JOIN identity i ON e.identity_id = i.id
  JOIN users u ON i.user_id = u.id
  WHERE ep.payroll_month = (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::DATE
    AND i.active = true
    AND i.verified = true
  ORDER BY ep.due_date ASC
  LIMIT p_limit
  OFFSET (p_page_number - 1) * p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;