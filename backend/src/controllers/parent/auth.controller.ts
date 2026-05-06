import { type Context } from "elysia";
import type { StudentSignupResendType, StudentSignupSupabaseType, InvitationJWTType } from "../../validations";
import { createStudentWithExistingUserParent, createNewStudent, updateDatabaseUser } from "../../services";
import { type User } from "@supabase/supabase-js";

export const studentSignupWithSupabase = async (context: Context<{ body: StudentSignupSupabaseType }>) => {
  try {
    const { id: user_id } = (context as any).user as User;

    const { password, phone, date_of_birth, blood_group, gender, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, address, city, state, pincode, occupation, annual_income, student_relation, student_date_of_birth, student_full_name, student_blood_group, student_gender, student_medical_notes } = context.body;

    const updated_user = await updateDatabaseUser({ user_id, password, phone });

    const emergency_contact = { name: emergency_contact_name, relation: emergency_contact_relation, phone: emergency_contact_phone };

    await createNewStudent({ id: updated_user.id, email: updated_user.email as string, phone: updated_user.phone as string, date_of_birth, blood_group, gender, full_name: updated_user.user_metadata.full_name, emergency_contact, address, city, state, pincode, occupation, annual_income, student_relation, student_date_of_birth, student_full_name, student_blood_group, student_gender, student_medical_notes });

    return context.status(201, { success: true, message: "Parent signed up successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
};

export const studentSignupWithResend = async (context: Context<{ body: StudentSignupResendType }> ) => {
  try {
    const { user_id } = (context as any).user as InvitationJWTType;

    await createStudentWithExistingUserParent(context.body, user_id);

    return context.status(201, { success: true, message: "Parent signed up successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
};
