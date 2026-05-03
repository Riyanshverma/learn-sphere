import { type Context } from "elysia";
import type { EmployeeSignupType, ExistingUserAsStaffType, SendTeacherInvitationType, UpdateTeacherInvitationStatusType } from "../../validations";
import { createDatabaseUser, uploadDocument, getDocumentURL, getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationBySupabase, sendTeacherInvitationByResend, createTeacherInvitation, getTeacherInvitations, updateTeacherInvitationStatus } from "../../services";

export const addNewSchoolStaff = async (context: Context<{ body: EmployeeSignupType }>) => {
  try {
    const { email, password, full_name, phone, aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo, emergency_contact_name, emergency_contact_relation, emergency_contact_phone, timings_days, timings_from, timings_to, aadhar_card_number, pan_card_number, bank_account_holder_name, bank_branch_name, bank_name, bank_account_number, bank_ifsc_code, bank_upi_id, bank_account_type, date_of_birth, address, city, state, pincode, qualifications, specialization, monthly_salary, experience_years, gender, blood_group } = context.body

    const user = await createDatabaseUser({ email, password, full_name, phone })

    const uploaded_documents = await Promise.all(([aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo] as const).map(async (file) => {
      return uploadDocument({ name: `${Date.now()}.${file.type.split('/').pop()}`, mime_type: file.type, buffer: await file.arrayBuffer() });
    }));

    const [aadhar_card_url, pan_card_url, bank_cancelled_cheque_url] = await Promise.all(uploaded_documents.map((document) => getDocumentURL(document.path)));

    const emergency_contact = { name: emergency_contact_name, relation: emergency_contact_relation, phone: emergency_contact_phone }

    const timings = { days: timings_days, from: timings_from, to: timings_to }

    const identity_proof = { aadhar_card: { number: aadhar_card_number, url: aadhar_card_url }, pan_card: { number: pan_card_number, url: pan_card_url }}

    const bank_details = { account_holder_name: bank_account_holder_name, branch_name: bank_branch_name, bank_name, account_number: bank_account_number, ifsc_code: bank_ifsc_code, cancelled_cheque_url: bank_cancelled_cheque_url, upi_id: bank_upi_id, account_type: bank_account_type }

    await createNewSchoolStaff({ id: user.id, email: user.email || email, phone: user.phone || phone, date_of_birth, blood_group, gender, full_name: user.user_metadata.full_name, emergency_contact, address, city, state, pincode, qualifications, specialization, monthly_salary, experience_years, timings, identity_proof, bank_details })

    // TODO: Send reset password link

    return context.status(201, { success: true, message: "School staff signed up successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const addExistingUserAsSchoolStaff = async (context: Context<{ body: ExistingUserAsStaffType }>) => {
  try {
    const { email, phone, aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo, timings_days, timings_from, timings_to, aadhar_card_number, pan_card_number, bank_account_holder_name, bank_branch_name, bank_name, bank_account_number, bank_ifsc_code, bank_upi_id, bank_account_type, qualifications, specialization, monthly_salary, experience_years } = context.body    

    const user_id = await getDatabaseUserId(email, phone)
    
    if(!user_id) {
      return context.status(404, { success: false, error: "User not found", code: "user_not_found" });
    }

    const uploaded_documents = await Promise.all(([aadhar_card_photo, pan_card_photo, bank_cancelled_cheque_photo] as const).map(async (file) => {
      return uploadDocument({ name: `${Date.now()}.${file.type.split('/').pop()}`, mime_type: file.type, buffer: await file.arrayBuffer() });
    }));

    const [aadhar_card_url, pan_card_url, bank_cancelled_cheque_url] = await Promise.all(uploaded_documents.map((document) => getDocumentURL(document.path)));

    const timings = { days: timings_days, from: timings_from, to: timings_to }

    const identity_proof = { aadhar_card: { number: aadhar_card_number, url: aadhar_card_url }, pan_card: { number: pan_card_number, url: pan_card_url }}

    const bank_details = { account_holder_name: bank_account_holder_name, branch_name: bank_branch_name, bank_name, account_number: bank_account_number, ifsc_code: bank_ifsc_code, cancelled_cheque_url: bank_cancelled_cheque_url, upi_id: bank_upi_id, account_type: bank_account_type }

    await createExistingUserAsSchoolStaff({ id: user_id, qualifications, specialization, monthly_salary, experience_years, timings, identity_proof, bank_details  })

    return context.status(201, { success: true, message: "School staff signed up successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const sendTeacherInvitation = async (context: Context<{ body: SendTeacherInvitationType }>) => {
  try {
    const { full_name, email } = context.body

    const existing_user = await checkExistingUser(email, full_name)

    if (existing_user) {
      await createTeacherInvitation(existing_user.id, email, existing_user.full_name, "teacher")
      
      await sendTeacherInvitationByResend((context as any).jwt, email, existing_user.full_name, existing_user.id)

    } else {
      const teacher = await sendTeacherInvitationBySupabase(email, full_name)

      await createTeacherInvitation(teacher.id, teacher.email || email, teacher.user_metadata.full_name || full_name, "teacher")
    }

    return context.status(200, { success: true, message: "Teacher invitation sent successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const fetchTeacherInvitations = async (context: Context) => {
  try {
    const teacher_invitations = await getTeacherInvitations()
    
    return context.status(200, { success: true, message: "Teacher invitations fetched successfully", data: teacher_invitations })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const changeTeacherInvitationStatus = async (context: Context<{ body: UpdateTeacherInvitationStatusType }>) => {
  try {
    const { user_id, new_status } = context.body

    await updateTeacherInvitationStatus(user_id, new_status)
    
    return context.status(200, { success: true, message: "Teacher invitation status updated successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}