-- 26.04.26

CREATE OR REPLACE FUNCTION get_admin_identity_details(
  p_user_id UUID,
  p_identity_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_row users%ROWTYPE;
  v_identity_row identity%ROWTYPE;
  v_employee_row employees%ROWTYPE;
BEGIN
  SELECT * INTO v_user_row FROM users WHERE id = p_user_id;
  
  SELECT * INTO v_identity_row FROM identity WHERE id = p_identity_id;
  
  SELECT * INTO v_employee_row FROM employees WHERE identity_id = p_identity_id;

  RETURN jsonb_build_object(
    'email', v_user_row.email,
    'phone', v_user_row.phone,
    'date_of_birth', v_user_row.date_of_birth,
    'blood_group', v_user_row.blood_group,
    'gender', v_user_row.gender,
    'full_name', v_user_row.full_name,
    'emergency_contact', v_user_row.emergency_contact,
    'address', v_user_row.address,
    'identity_id', v_identity_row.id,
    'role', v_identity_row.role,
    'verified', v_identity_row.verified,
    'active', v_identity_row.active,
    'employee_id', v_employee_row.id,
    'qualification', v_employee_row.qualification,
    'specialization', v_employee_row.specialization,
    'designation', v_employee_row.designation,
    'joined_date', v_employee_row.joined_date,
    'employee_code', v_employee_row.employee_code,
    'monthly_salary', v_employee_row.monthly_salary,
    'experience_years', v_employee_row.experience_years,
    'timings', v_employee_row.timings,
    'leaves', v_employee_row.leaves,
    'identity_proof', v_employee_row.identity_proof,
    'bank_details', v_employee_row.bank_details
  );
END;
$$;
