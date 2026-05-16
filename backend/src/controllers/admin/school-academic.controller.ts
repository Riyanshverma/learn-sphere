import { type Context } from "elysia";

import type { EmployeeSignupType, ExistingUserAsStaffType, CreateSchoolClassType, SendInvitationType, UpdateInvitationStatusType, UpdateClassTeacherType, AddClassSubjectType, StudentWithExistingUserParentType, StudentWithNewParentType, AddStudentToClassAndAcceptInvitationType, SearchType } from "../../validations";

import { createDatabaseUser, uploadDocument, getDocumentURL, getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationBySupabase, sendTeacherInvitationByResend, createInvitation, getTeacherInvitations, updateInvitationStatus, createClass, updateClassTeacher, sendStudentInvitationByResend, sendStudentInvitationBySupabase, getParentInvitations, createStudentWithExistingUserParentByAdmin, createNewStudentByAdmin, updateStudentClassAndInvitationStatus, getAllClassesDetails, getSearchedTeachers, createClassSubject, razorpayService, getSearchedTeachersForClassTeacher } from "../../services";

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

    const razorpay_contact_id = await razorpayService.createRazorpayContact({ name: bank_account_holder_name, email: user.email as string, contact: (user.phone as string).slice(2), type: 'employee', reference_id: user.id, notes: { role: 'staff' } })

    const razorpay_fund_account_id = await razorpayService.createRazorpayFundAccount({ contact_id: razorpay_contact_id, account_type: 'bank_account', bank_account: { name: bank_account_holder_name, ifsc: bank_ifsc_code, account_number: bank_account_number } })

    await createNewSchoolStaff({ id: user.id, email: user.email || email, phone: user.phone || phone, date_of_birth, blood_group, gender, full_name: user.user_metadata.full_name, emergency_contact, address, city, state, pincode, qualifications, specialization, monthly_salary, experience_years, timings, identity_proof, bank_details, razorpay_contact_id, razorpay_fund_account_id })

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

    const razorpay_contact_id = await razorpayService.createRazorpayContact({ name: bank_account_holder_name, email, contact: phone.slice(3), type: 'employee', reference_id: user_id, notes: { role: 'staff' } })

    const razorpay_fund_account_id = await razorpayService.createRazorpayFundAccount({ contact_id: razorpay_contact_id, account_type: 'bank_account', bank_account: { name: bank_account_holder_name, ifsc: bank_ifsc_code, account_number: bank_account_number } })

    await createExistingUserAsSchoolStaff({ id: user_id, qualifications, specialization, monthly_salary, experience_years, timings, identity_proof, bank_details, razorpay_contact_id, razorpay_fund_account_id  })

    return context.status(201, { success: true, message: "School staff signed up successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const addStudentWithNewParent = async (context: Context<{ body: StudentWithNewParentType }>) => {
  try {
    const { email, password, full_name, phone, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, address, city, state, pincode, occupation, annual_income, student_relation, student_date_of_birth, student_blood_group, student_full_name, student_gender, student_medical_notes, class: student_class } = context.body
    
    const user = await createDatabaseUser({ email, password, full_name, phone })

    const emergency_contact = { name: emergency_contact_name, relation: emergency_contact_relation, phone: emergency_contact_phone }

    await createNewStudentByAdmin({ id: user.id, email: user.email || email, phone: user.phone || phone, date_of_birth, blood_group, gender, full_name: user.user_metadata.full_name, emergency_contact, address, city, state, pincode, occupation, annual_income, student_relation, student_date_of_birth, student_blood_group, student_full_name, student_gender, student_medical_notes, class_standard: parseInt(student_class.slice(0, -1)), class_section: student_class.slice(-1) })
    
    return context.status(201, { success: true, message: "Student signed up successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}

export const addStudentWithExistingUserParent = async (context: Context<{ body: StudentWithExistingUserParentType }>) => {
  try {
    const { email, phone, occupation, annual_income, student_relation, student_date_of_birth, student_blood_group, student_full_name, student_gender, student_medical_notes, class: student_class } = context.body

    const user_id = await getDatabaseUserId(email, phone)
    
    if(!user_id) {
      return context.status(404, { success: false, error: "User not found", code: "user_not_found" });
    }

    await createStudentWithExistingUserParentByAdmin({ id: user_id, occupation, annual_income, student_relation, student_date_of_birth, student_blood_group, student_full_name, student_gender, student_medical_notes, class_standard: parseInt(student_class.slice(0, -1)), class_section: student_class.slice(-1) })
    
    return context.status(201, { success: true, message: "Student signed up successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}

export const sendTeacherInvitation = async (context: Context<{ body: SendInvitationType }>) => {
  try {
    const { full_name, email } = context.body

    const existing_user = await checkExistingUser(email, full_name)

    if (existing_user) {
      await createInvitation(existing_user.id, email, existing_user.full_name, "teacher")
      
      await sendTeacherInvitationByResend((context as any).jwt, email, existing_user.full_name, existing_user.id, existing_user.phone)
    } else {
      const teacher = await sendTeacherInvitationBySupabase(email, full_name)

      await createInvitation(teacher.id, teacher.email || email, teacher.user_metadata.full_name, "teacher")
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

export const changeInvitationStatus = async (context: Context<{ body: UpdateInvitationStatusType }>) => {
  try {    
    await updateInvitationStatus(context.body)
    
    return context.status(200, { success: true, message: "Teacher invitation status updated successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const sendStudentInvitation = async (context: Context<{ body: SendInvitationType }>) => {
  try {
    const { full_name, email } = context.body

    const existing_user = await checkExistingUser(email, full_name)
    
    if(existing_user) {
      await createInvitation(existing_user.id, email, existing_user.full_name, "parent")

      await sendStudentInvitationByResend((context as any).jwt, email, existing_user.full_name, existing_user.id)
    } else {
      const student = await sendStudentInvitationBySupabase(email, full_name)

      await createInvitation(student.id, student.email || email, student.user_metadata.full_name, "parent")
    }
    
    return context.status(200, { success: true, message: "Student invitation sent successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const fetchParentInvitations = async (context: Context) => {
  try {
    const parent_invitations = await getParentInvitations()
    
    return context.status(200, { success: true, message: "Parent invitations fetched successfully", data: parent_invitations })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const createSchoolClass = async (context: Context<{ body: CreateSchoolClassType }>) => {
  try {
    await createClass(context.body)
    
    return context.status(201, { success: true, message: "Class created successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const addStudentToClassAndAcceptInvitation = async (context: Context<{ body: AddStudentToClassAndAcceptInvitationType }>) => {
  try {

    await updateStudentClassAndInvitationStatus(context.body)

    return context.status(200, { success: true, message: "Student added to class successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const changeClassTeacher = async (context: Context<{body: UpdateClassTeacherType}>) => {
  try {
    await updateClassTeacher(context.body)

    return context.status(200, { success: true, message: "Class teacher updated successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const fetchAllClassesDetails = async (context: Context) => {
  try {
    const classes_details = await getAllClassesDetails()

    return context.status(200, { success: true, message: "Classes details fetched successfully", data: classes_details })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const searchTeachers = async (context: Context<{query: SearchType}>) => {
  try {
    const searched_techers = await getSearchedTeachers(context.query.search)
    
    return context.status(200, { success: true, message: "Searched teachers fetched successfully", data: searched_techers })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const addClassSubject = async (context: Context<{ body: AddClassSubjectType }>) => {
  try {
    const { syllabus, subject_name, class_id, subject_teacher, academic_year, class_standard, class_section } = context.body

    const uploaded_document = await uploadDocument({ name: `${Date.now()}.${syllabus.type.split('/').pop()}`, mime_type: syllabus.type, buffer: await syllabus.arrayBuffer() })

    const syllabus_url = await getDocumentURL(uploaded_document.path)

    await createClassSubject({
      name: subject_name,
      syllabus: syllabus_url,
      subject_code: `${subject_name.slice(0, 4).toUpperCase()}-${class_standard}${class_section}`,
      class_id,
      subject_teacher,
      academic_year
    })

    return context.status(201, { success: true, message: "Class subject added successfully" })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}

export const searchTeachersForClassTeacher = async (context: Context<{query: SearchType}>) => {
  try {
    const searched_teachers = await getSearchedTeachersForClassTeacher(context.query.search)
    
    return context.status(200, { success: true, message: "Searched teachers fetched successfully", data: searched_teachers })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error" });
  }
}