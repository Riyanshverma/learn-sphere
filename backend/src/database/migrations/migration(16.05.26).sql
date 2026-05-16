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
