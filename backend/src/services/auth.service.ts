import { supabaseAdmin, supabaseUser, createUserClient } from '../database';
import { type Session, CustomAuthError, type User } from '@supabase/supabase-js';
import { type UserLoginWithPasswordType, StudentSignupResendType, UserLoginWithOtpType, UserOtpVerificationType } from '../validations';
import type { createDatabaseUserType, uploadDocumentType, uploadDocumentResponse, CreateEmployeeType, CreateEmployeeResponse, getUserIdentitiesResponse, UpdateDatabaseUserType, CreateExistingUserAsTeacherType, CreateNewStudentType } from '../types';

export const userSigninWithEmailPassword = async ({ email, password }: UserLoginWithPasswordType): Promise<Session> => {
  try {
    const { data, error } = await supabaseUser.auth.signInWithPassword({ email, password })

    if(error) {
      throw error
    } else if (!data.session) {
      throw new CustomAuthError('No session was returned', 'SessionNotFoundError', 401, 'session_not_found');
    }

    return data.session;
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const userSigninWithPhonePassword = async ({ password, phone }: UserLoginWithPasswordType): Promise<Session> => {
  try {
    const { data, error } = await supabaseUser.auth.signInWithPassword({ phone, password })

    if(error) {
      throw error
    } else if (!data.session) {
      throw new CustomAuthError('No session was returned', 'SessionNotFoundError', 401, 'session_not_found');
    }

    return data.session;
  } catch (error: any) {    
    console.error(error.message)
    throw error
  }
}

export const userSigninWithEmailOtp = async ({ email }: UserLoginWithOtpType): Promise<void> => {
  try {

    const { error } = await supabaseUser.auth.signInWithOtp({ email, options: { shouldCreateUser: false }})

    if(error) {
      throw error
    }
  } catch (error: any) {    
    console.error(error.message)
    throw error
  }
}

export const userSigninWithPhoneOtp = async ({ phone }: UserLoginWithOtpType): Promise<void> => {
  try {
    const { error } = await supabaseUser.auth.signInWithOtp({ phone, options: { shouldCreateUser: false }})

    if(error) {
      throw error
    }
  } catch (error: any) {    
    console.error(error.message)
    throw error
  }
}

export const verifyEmailOtp = async ({ email, otp }: UserOtpVerificationType): Promise<Session> => {
  try {
    const { data, error } = await supabaseUser.auth.verifyOtp({ email, token: otp, type: 'email' })

    if(error) {
      throw error
    } else if (!data.session) {
      throw new CustomAuthError('No session was returned', 'SessionNotFoundError', 401, 'session_not_found');
    }

    return data.session;
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const verifyPhoneOtp = async ({ phone, otp }: UserOtpVerificationType): Promise<Session> => {
  try {
    const { data, error } = await supabaseUser.auth.verifyOtp({ phone, token: otp.slice(0, 6), type: 'sms' })

    if(error) {
      throw error
    } else if (!data.session) {
      throw new CustomAuthError('No session was returned', 'SessionNotFoundError', 401, 'session_not_found');
    }

    return data.session;
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const createDatabaseUser = async ({ email, password, phone, full_name }: createDatabaseUserType): Promise<User> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, phone, email_confirm:true, phone_confirm: true, user_metadata: { full_name }});
    
    if (error) {
      throw error
    } else if(!data.user) {
      throw new CustomAuthError('No user was returned', 'UserCreationError', 500, 'user_creation_failed')
    }
    
    return data.user;
  } catch (error: any) {
    console.error(error.message);
    throw error
  }
}

export const uploadDocument = async ({ name, buffer, mime_type }: uploadDocumentType): Promise<uploadDocumentResponse> => {
  try {
    const { data, error } = await supabaseAdmin.storage.from('learn-sphere').upload(`uploaded-documents/${name}`, buffer, {
        contentType: mime_type,
        upsert: false,
      });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const getDocumentURL = async (document_path: string): Promise<string> => {
  try {
    const { data } = supabaseAdmin.storage.from('learn-sphere').getPublicUrl(document_path)

    return data.publicUrl;
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const createAdmin = async (params: CreateEmployeeType): Promise<CreateEmployeeResponse> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('create_admin', {
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
      p_bank_details: params.bank_details
    });

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(params.id);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error
  }
}

export const getUserIdentities = async (user_id: string): Promise<getUserIdentitiesResponse[]> => {
  try {
    const { data, error } = await supabaseAdmin.from('identity').select('identity_id:id, role, verified, active').eq('user_id', user_id)

    if(error) {
      throw error
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error
  }
}

export const getDatabaseUser = async (token: string): Promise<User> => {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      throw error;
    } else if (!data.user) {
      throw new CustomAuthError('Invalid or expired token', 'TokenInvalidError', 401, 'token_invalid');
    }

    return data.user;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const getAdminIdentityDetails = async (identity_id: string, user_id: string): Promise<CreateEmployeeResponse> => {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_admin_identity_details', { p_identity_id: identity_id, p_user_id: user_id });

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error
  }
}

export const userSignout = async (token: string): Promise<void> => {
  try {
    const client = createUserClient(token);
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const updateDatabaseUser= async ({ user_id, password, phone }: UpdateDatabaseUserType): Promise<User>  => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password, phone, phone_confirm: true })

    if (error) {
      throw error;
    } else if (!data.user) {
      throw new CustomAuthError('No user returned', 'UpdateUserError', 500, 'update_user_failed');
    }

    return data.user;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createNewTeacher = async (params: CreateEmployeeType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_new_school_teacher', {
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
      p_bank_details: params.bank_details
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

export const createExistingUserAsTeacher = async (params: CreateExistingUserAsTeacherType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_existing_user_as_school_teacher', {
      p_id: params.user_id,
      p_qualifications: params.qualifications,
      p_specialization: params.specialization,
      p_monthly_salary: params.monthly_salary,
      p_experience_years: params.experience_years,
      p_timings: params.timings,
      p_identity_proof: params.identity_proof,
      p_bank_details: params.bank_details
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const checkTeacherInvitationAllowed = async (user_id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin.from("invitations").select("status").eq("user_id", user_id).eq("role", "teacher").maybeSingle();

    if (error) {
      throw error;
    } else if(!data) {
      throw new CustomAuthError('No invitation found', 'InvitationNotFoundError', 404, 'invitation_not_found');
    }

    return data.status === "allowed";
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createNewStudent = async (params: CreateNewStudentType): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_new_student', {
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
      p_student_medical_notes: params.student_medical_notes
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

export const createStudentWithExistingUserParent = async (params: StudentSignupResendType, user_id: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.rpc('create_student_existing_user', {
      p_id: user_id,
      p_occupation: params.occupation,
      p_annual_income: params.annual_income,
      p_student_relation: params.student_relation,
      p_student_date_of_birth: params.student_date_of_birth,
      p_student_full_name: params.student_full_name,
      p_student_blood_group: params.student_blood_group,
      p_student_gender: params.student_gender,
      p_student_medical_notes: params.student_medical_notes
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

