import { supabaseAdmin, supabaseUser, createUserClient } from "../database";
import type { CreateEmployeeType, CreateEmployeeResponse, CreateExistingUserAsSchoolStaffType } from "../types";

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
