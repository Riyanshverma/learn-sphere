import { supabaseAdmin, supabaseUser, createUserClient } from "../database";
import type { CreateSchoolClassType } from "../validations";
import type { CreateEmployeeType, CreateExistingUserAsSchoolStaffType, role, TeacherInvitationsResponse } from "../types";
import { CustomAuthError, type User } from "@supabase/supabase-js";
import { signJWT, resend, TeacherInvitationMailTemplate } from "../utils";

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
      p_bank_details: params.bank_details
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const checkExistingUser = async (email: string, full_name: string): Promise<{ id: string; full_name: string; } | null> => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("id, full_name").eq("email", email).eq("full_name", full_name).maybeSingle();

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

export const sendTeacherInvitationByResend = async (jwt: any, email: string, full_name: string, user_id: string): Promise<void> => {
  try {
    const token = await signJWT(jwt, { user_id, email, full_name });

    const { error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'You have been invited',
      react: TeacherInvitationMailTemplate({ token }),
    })

    if (error) {
      throw new CustomAuthError(error.message, 'InvitationError', error.statusCode ?? 500, error.name ?? 'invitation_failed');
    }
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createTeacherInvitation = async (user_id: string, email: string, full_name: string, role: role): Promise<void> => {
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

export const updateTeacherInvitationStatus = async (user_id: string, new_status: "allowed" | "revoked"): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from("invitations").update({ status: new_status }).eq("user_id", user_id).eq("role", "teacher").eq("status", "accepted");

    if (error) {
      throw error;
    }
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