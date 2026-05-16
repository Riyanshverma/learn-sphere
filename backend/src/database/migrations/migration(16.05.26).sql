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