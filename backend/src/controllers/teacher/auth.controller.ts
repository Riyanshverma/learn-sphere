import { type Context } from "elysia";
import type { InvitationJWTType, TeacherSignupResendType, TeacherSignupSupabaseType, IdentityIdType } from "../../validations";
import { uploadDocument, getDocumentURL, updateDatabaseUser, createNewTeacher, createExistingUserAsTeacher, checkInvitationAllowed } from "../../services";
import { type User } from "@supabase/supabase-js";
import { type JWTPayloadSpec } from "@elysiajs/jwt";
import { setRoleCookie } from "../../utils";

export const teacherSignupWithSupabase = async (context: Context<{body: TeacherSignupSupabaseType}>) => {
    try {
      const { id: user_id } = (context as any).user as User
        
      const { password, phone, aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo, emergency_contact_name, emergency_contact_relation, emergency_contact_phone, timings_days, timings_from, timings_to, aadhar_card_number, pan_card_number, bank_account_holder_name, bank_branch_name, bank_name, bank_account_number, bank_ifsc_code, bank_upi_id, bank_account_type, date_of_birth, blood_group, gender, address, city, state, pincode, qualifications, specialization, experience_years } = context.body

      const updated_user = await updateDatabaseUser({ user_id, password, phone })

      const uploaded_documents = await Promise.all(([aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo] as const).map(async (file) => {
        return uploadDocument({ name: `${Date.now()}.${file.type.split('/').pop()}`, mime_type: file.type, buffer: await file.arrayBuffer() });
      }));

      const [aadhar_card_url, pan_card_url, bank_cancelled_cheque_url] = await Promise.all(uploaded_documents.map((document) => getDocumentURL(document.path)));

      const emergency_contact = { name: emergency_contact_name, relation: emergency_contact_relation, phone: emergency_contact_phone }

      const timings = { days: timings_days, from: timings_from, to: timings_to }

      const identity_proof = { aadhar_card: { number: aadhar_card_number, url: aadhar_card_url }, pan_card: { number: pan_card_number, url: pan_card_url }}

      const bank_details = { account_holder_name: bank_account_holder_name, branch_name: bank_branch_name, bank_name, account_number: bank_account_number, ifsc_code: bank_ifsc_code, cancelled_cheque_url: bank_cancelled_cheque_url, upi_id: bank_upi_id, account_type: bank_account_type }

      await createNewTeacher({ id: updated_user.id, email: updated_user.email as string, phone: updated_user.phone as string, date_of_birth, blood_group, gender, full_name: updated_user.user_metadata.full_name, emergency_contact, address, city, state, pincode, qualifications, specialization, experience_years, timings, identity_proof, bank_details, monthly_salary: 15000 })
      
      return context.status(201, { success: true, message: "Teacher signed up successfully" });
    } catch (error: any) {
      return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || 'internal_server_error' });
    }
}

export const teacherSignupWithResend = async (context: Context<{body: TeacherSignupResendType}>) => {
    try {
      const { user_id } = (context as any).user as InvitationJWTType

      const { aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo, timings_days, timings_from, timings_to, aadhar_card_number, pan_card_number, bank_account_holder_name, bank_branch_name, bank_name, bank_account_number, bank_ifsc_code, bank_upi_id, bank_account_type, qualifications, specialization, experience_years } = context.body

      const uploaded_documents = await Promise.all(([aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo] as const).map(async (file) => {
        return uploadDocument({ name: `${Date.now()}.${file.type.split('/').pop()}`, mime_type: file.type, buffer: await file.arrayBuffer() });
      }));

      const [aadhar_card_url, pan_card_url, bank_cancelled_cheque_url] = await Promise.all(uploaded_documents.map((document) => getDocumentURL(document.path)));

      const timings = { days: timings_days, from: timings_from, to: timings_to }

      const identity_proof = { aadhar_card: { number: aadhar_card_number, url: aadhar_card_url }, pan_card: { number: pan_card_number, url: pan_card_url }}

      const bank_details = { account_holder_name: bank_account_holder_name, branch_name: bank_branch_name, bank_name, account_number: bank_account_number, ifsc_code: bank_ifsc_code, cancelled_cheque_url: bank_cancelled_cheque_url, upi_id: bank_upi_id, account_type: bank_account_type }

      await createExistingUserAsTeacher({ user_id, qualifications, specialization, experience_years, timings, identity_proof, bank_details, monthly_salary: 15000 })

      return context.status(201, { success: true, message: "Teacher signed up successfully" });
    } catch (error: any) {
      return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || 'internal_server_error' });
    }
}

export const teacherIdentityDetails = async (context: Context<{query: IdentityIdType}> & { user: User | JWTPayloadSpec } ) => {
  try {
    const { identity_id } = context.query
    const { id: user_id } = context.user as User

    const invitation_allowed = await checkInvitationAllowed(user_id, "teacher");

    if(!invitation_allowed) {
      return context.status(403, { success: false, error: "Not allowed to login", code: 'invitation_not_allowed' });
    }

    const teacher: any = {} // TODO: Get the data for teacher

    setRoleCookie(context, teacher.role)

    return context.status(200, { success: true, message: "Logged in successfully", data: teacher })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || 'internal_server_error' });
  }
}