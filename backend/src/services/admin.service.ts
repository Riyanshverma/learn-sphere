import { supabaseAdmin, supabaseUser, createUserClient } from "../database";

import type { AddStudentToClassAndAcceptInvitationType, ApplyForLeaveType, CreateSchoolClassType, UpdateClassTeacherType, UpdateInvitationStatusType, UpdateSingleEmployeeAttendanceType, PaginationType, UpdateEmployeeLeaveApplicationStatusType, ConfirmEmployeePayrollByCashType } from "../validations";

import type { CreateEmployeeType, CreateExistingUserAsSchoolStaffType, role, TeacherInvitationsResponse, ParentInvitationsResponse, CreateNewStudentByAdmin, CreateStudentWithExistingUserParentByAdmin, AllClassesDetailsResponse, SearchedTeachersResponse, CreateClassSubjectType, EmployeesAttendanceResponse, MyLeaveApplicationsResponse, EmployeeLeaveApplicationsResponse, SearchedStaffsResponse, MyAttendanceResponse, EmployeesPayrollsDetailsResponse, ConfirmEmployeePayrollByOnlineType } from "../types";

import { CustomAuthError, type User } from "@supabase/supabase-js";

import { signJWT, resend, InvitationMailTemplate } from "../utils";

export const getDatabaseUserId = async (email: string, phone: string): Promise<string | null> => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("id").or(`email.eq.${email},phone.eq.${phone}`).maybeSingle();

    if (error) {
      throw error;
    } else if (!data) {
      return null;
    }

    return data.id;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const createNewSchoolStaff = async (params: CreateEmployeeType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_new_school_staff', {
      p_id: params.id,
      p_email: params.email,
      p_phone: params.phone,
      p_full_name: params.full_name,
      p_date_of_birth: params.date_of_birth,
      p_blood_group: params.blood_group,
      p_gender: params.gender,
      p_emergency_contact: params.emergency_contact,
      p_address: params.address,
      p_city: params.city,
      p_state: params.state,
      p_pincode: String(params.pincode),
      p_qualifications: params.qualifications,
      p_specialization: params.specialization,
      p_monthly_salary: params.monthly_salary,
      p_experience_years: params.experience_years,
      p_timings: params.timings,
      p_identity_proof: params.identity_proof,
      p_bank_details: params.bank_details,
      p_razorpay_contact_id: params.razorpay_contact_id,
      p_razorpay_fund_account_id: params.razorpay_fund_account_id
    });

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(params.id);
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const createExistingUserAsSchoolStaff = async (params: CreateExistingUserAsSchoolStaffType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_existing_user_as_school_staff', {
      p_id: params.id,
      p_qualifications: params.qualifications,
      p_specialization: params.specialization,
      p_monthly_salary: params.monthly_salary,
      p_experience_years: params.experience_years,
      p_timings: params.timings,
      p_identity_proof: params.identity_proof,
      p_bank_details: params.bank_details,
      p_razorpay_contact_id: params.razorpay_contact_id,
      p_razorpay_fund_account_id: params.razorpay_fund_account_id
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const checkExistingUser = async (email: string, full_name: string): Promise<{ id: string; full_name: string; phone: string } | null> => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("id, full_name, phone").eq("email", email).eq("full_name", full_name).maybeSingle();

    if (error) {
      throw error;
    } else if (!data) {
      return null;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const sendTeacherInvitationBySupabase = async (email: string, full_name: string): Promise<User> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${Bun.env.FRONTEND_URL}/teacher-signup?invite=supabase`,
      data: { full_name }
    })

    if (error) {
      throw error;
    } else if (!data.user) {
      throw new CustomAuthError('No user returned', 'InvitationError', 500, 'invitation_failed');
    }

    return data.user;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const sendTeacherInvitationByResend = async (jwt: any, email: string, full_name: string, user_id: string, phone: string | null): Promise<void> => {
  try {
    const token = await signJWT(jwt, { user_id, email, full_name, phone });

    const { error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'You have been invited',
      react: InvitationMailTemplate({ url: `${Bun.env.FRONTEND_URL}/teacher-signup?invite=resend#access_token=${token}` }),
    })

    if (error) {
      throw new CustomAuthError(error.message, 'InvitationError', error.statusCode ?? 500, error.name ?? 'invitation_failed');
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createInvitation = async (user_id: string, email: string, full_name: string, role: role): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from("invitations").insert({ user_id, email, full_name, role });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getTeacherInvitations = async (): Promise<TeacherInvitationsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_teacher_invitations');

    if (error) {
      throw error;
    }

    return data as TeacherInvitationsResponse[];
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateInvitationStatus = async ({ new_status, invitation_id }: UpdateInvitationStatusType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from("invitations").update({ status: new_status }).eq("id", invitation_id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const sendStudentInvitationBySupabase = async (email: string, full_name: string): Promise<User> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${Bun.env.FRONTEND_URL}/student-signup?invite=supabase`,
      data: { full_name }
    })

    if (error) {
      throw error;
    } else if (!data.user) {
      throw new CustomAuthError('No user returned', 'InvitationError', 500, 'invitation_failed');
    }

    return data.user;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const sendStudentInvitationByResend = async (jwt: any, email: string, full_name: string, user_id: string): Promise<void> => {
  try {
    const token = await signJWT(jwt, { user_id, email, full_name });
    
    const { error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'You have been invited',
      react: InvitationMailTemplate({ url: `${Bun.env.FRONTEND_URL}/student-signup?invite=resend#access_token=${token}` }),
    })

    if (error) {
      throw new CustomAuthError(error.message, 'InvitationError', error.statusCode ?? 500, error.name ?? 'invitation_failed');
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getParentInvitations = async (): Promise<ParentInvitationsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_parent_invitations');

    if (error) {
      throw error;
    }

    return data as ParentInvitationsResponse[];
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createClass = async ({ class_section, class_standard, academic_year }: CreateSchoolClassType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from("classes").insert({ class_standard, class_section, academic_year });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateClassTeacher = async ({ class_id, employee_id }: UpdateClassTeacherType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from("classes").update({ class_teacher: employee_id }).eq("id", class_id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createStudentWithExistingUserParentByAdmin = async (params: CreateStudentWithExistingUserParentByAdmin): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc("create_student_with_existing_user_parent_by_admin", {
      p_id: params.id,
      p_occupation: params.occupation,
      p_annual_income: params.annual_income,
      p_student_relation: params.student_relation,
      p_student_date_of_birth: params.student_date_of_birth,
      p_student_full_name: params.student_full_name,
      p_student_blood_group: params.student_blood_group,
      p_student_gender: params.student_gender,
      p_student_medical_notes: params.student_medical_notes,
      p_class_standard: params.class_standard,
      p_class_section: params.class_section
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createNewStudentByAdmin = async (params: CreateNewStudentByAdmin): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc("create_new_student_by_admin", {
      p_id: params.id,
      p_email: params.email,
      p_phone: params.phone,
      p_full_name: params.full_name,
      p_date_of_birth: params.date_of_birth,
      p_blood_group: params.blood_group,
      p_gender: params.gender,
      p_emergency_contact: params.emergency_contact,
      p_address: params.address,
      p_city: params.city,
      p_state: params.state,
      p_pincode: String(params.pincode),
      p_occupation: params.occupation,
      p_annual_income: params.annual_income,
      p_student_relation: params.student_relation,
      p_student_date_of_birth: params.student_date_of_birth,
      p_student_full_name: params.student_full_name,
      p_student_blood_group: params.student_blood_group,
      p_student_gender: params.student_gender,
      p_student_medical_notes: params.student_medical_notes,
      p_class_standard: params.class_standard,
      p_class_section: params.class_section
    });

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(params.id);
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateStudentClassAndInvitationStatus = async (params: AddStudentToClassAndAcceptInvitationType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc("update_student_class_and_invitation_status", {
      p_invitation_id: params.invitation_id,
      p_student_id: params.student_id,
      p_class_standard: parseInt(params.class.slice(0, -1)),
      p_class_section: params.class.slice(-1),
      p_new_status: params.new_status
    });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getAllClassesDetails = async (): Promise<AllClassesDetailsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_all_classes_details');

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getSearchedTeachers = async (search: string): Promise<SearchedTeachersResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_searched_teachers', { p_search: search });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createClassSubject = async (params: CreateClassSubjectType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from('subjects').insert(params);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getEmployeesAttendance = async (date: string): Promise<EmployeesAttendanceResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_employees_attendance', { p_date: date });

    if (error) {
      throw error;
    }

    return data;
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateSingleEmployeeAttendance = async ({ attendance_id, employee_id, date, status, remarks }: UpdateSingleEmployeeAttendanceType) => {
  try {
    const { error } = await supabaseAdmin.from('employee_attendance').upsert({ id: attendance_id, employee_id, date, status, remarks }, { onConflict: 'employee_id, date' });

    if (error) {
      throw error;
    }

  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createLeaveApplication = async (params: ApplyForLeaveType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_leave_application', {
      p_applicant_id: params.applicant_id,
      p_leave_from_date: params.leave_from_date,
      p_leave_to_date: params.leave_to_date,
      p_leave_type: params.leave_type,
      p_leave_reason: params.leave_reason,
      p_leave_days: params.leave_days
    });

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getMyLeaveApplications = async (employee_id: string): Promise<MyLeaveApplicationsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.from('leave_applications').select('id, applicant_id, leave_from_date, leave_to_date, leave_type, leave_reason, leave_status, review_comment, reviewed_by, reviewed_at, created_at').eq('applicant_id', employee_id).order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item) => ({
      leave_application_id: item.id,
      applicant_id: item.applicant_id,
      leave_from_date: item.leave_from_date,
      leave_to_date: item.leave_to_date,
      leave_type: item.leave_type,
      leave_reason: item.leave_reason,
      leave_status: item.leave_status,
      review_comment: item.review_comment,
      reviewed_by: item.reviewed_by,
      reviewed_at: item.reviewed_at,
      created_at: item.created_at,
    }));
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const cancelMyLeaveApplication = async (leave_application_id: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('cancel_leave_application', { p_leave_application_id: leave_application_id });

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getEmployeesLeaveApplications = async (params: PaginationType): Promise<EmployeeLeaveApplicationsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_employees_leave_applications', {
      p_page_number: params.page_number,
      p_limit: params.limit
    });

    if (error) {
      throw error;
    }

    return data;
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getSearchedStaffs = async (search: string): Promise<SearchedStaffsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_searched_staffs', { p_search: search });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateEmployeeLeaveApplicationStatus = async (params: UpdateEmployeeLeaveApplicationStatusType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('update_employee_leave_application_status', {
      p_leave_application_id: params.leave_application_id,
      p_new_status: params.new_leave_status,
      p_review_comment: params.review_comment,
      p_reviewed_by: params.reviewed_by
    });

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getMyAttendance = async (employee_id: string): Promise<MyAttendanceResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.from('employee_attendance').select('id, date, status, remarks').eq('employee_id', employee_id);

    if (error) {
      throw error;
    }

    return (data || []).map((attendance) => ({
      attendance_id: attendance.id,
      date: attendance.date,
      status: attendance.status,
      remarks: attendance.remarks,
    }));
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const getEmployeesPayrollsDetails = async (page_number: number, limit: number): Promise<EmployeesPayrollsDetailsResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_employees_payrolls_details', {
      p_page_number: page_number,
      p_limit: limit
    });

    if (error) {
      throw error;
    }

    return data;
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const confirmEmployeePayrollByCash = async (params: ConfirmEmployeePayrollByCashType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('confirm_employee_payroll_by_cash', {
      p_employee_id: params.employee_id,
      p_payroll_id: params.payroll_id,
      p_deductions: params.deductions,
      p_net_salary: params.net_salary
    });

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const confirmEmployeePayrollByOnline = async (params: ConfirmEmployeePayrollByOnlineType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('confirm_employee_payroll_by_online', {
      p_employee_id: params.employee_id,
      p_payroll_id: params.payroll_id,
      p_deductions: params.deductions,
      p_net_salary: params.net_salary,
      p_razorpay_payout_id: params.razorpay_payout_id,
      p_status: params.status,
      p_utr_id: params.utr_id,
      p_paid_at: params.paid_at.toISOString()
    });

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateEmployeePayrollStatusFromWebhook = async (params: { razorpay_payout_id: string, status: string, utr_id: string | null }): Promise<void> => {
  try {
    let mappedStatus = params.status;
    if (params.status === 'processed') mappedStatus = 'paid';
    else if (params.status === 'queued') mappedStatus = 'processing';
    else if (params.status === 'rejected') mappedStatus = 'failed';
    
    const { error } = await supabaseAdmin
      .from('employee_payrolls')
      .update({ 
        status: mappedStatus,
        utr_id: params.utr_id,
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_payout_id', params.razorpay_payout_id);

    if (error) {
      throw error;
    }
  } catch(error: any) {
    console.error(error.message);
    throw error;
  }
}