import { z } from "zod"

const email = z.string().trim().toLowerCase().email('Invalid email').or(z.literal(''))
const password = z.string().trim().min(6, 'Must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'Must contain at least an uppercase letter, a number, and a special character')
const phone = z.string().trim().regex(/^\+91[6-9]\d{9}$/, 'Invalid').or(z.literal(''))
const blood_group = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid')
const gender = z.enum(['male', 'female', 'other'], 'Invalid')
const date = z.coerce.date({ error: 'Invalid' })
const word = z.string().trim().min(1, 'Invalid').toLowerCase()
const number = z.coerce.number().int('Invalid').min(0, 'Invalid') as z.ZodNumber
const pincode = z.coerce.number().int('Invalid').refine((val) => /^\d{6}$/.test(String(val)), { message: 'Must be 6 digits' })
const days = z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).min(1, 'Select at least one day');
const uuid = z.uuid('Invalid')
const otp = z.string().trim().length(8, 'Must be 8 digits').regex(/^[0-9]+$/, 'Invalid')
const time = z.iso.time('Invalid')
const file = z.instanceof(File).refine((file) => file.size > 0, 'Invalid')
const role = z.enum(['teacher', 'student', 'admin', 'staff'], 'Invalid')
const timestamp = z.iso.datetime({ offset: true })

export const UpdateInvitationStatusSchema = z.strictObject({
  invitation_id: uuid,
  new_status: z.enum(['allowed', 'revoked'], 'Invalid'),
})
export type UpdateInvitationStatusType = z.infer<typeof UpdateInvitationStatusSchema>

export const ExistingUserAsStaffSchema = z.strictObject({
  email: email,
  phone: phone,
  qualifications: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  specialization: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  monthly_salary: number,
  experience_years: number,
  timings_days: days,
  timings_from: time,
  timings_to: time,
  aadhar_card_number: word.regex(/^\d{12}$/, 'Must be exactly 12 digits'),
  aadhar_card_photo: file,
  pan_card_number: z.string().trim().min(3, 'Invalid').regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  pan_card_photo: file,
  bank_account_holder_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  bank_branch_name: word,
  bank_name: word,
  bank_account_number: word.min(9, 'Too short').max(18, 'Too long'),
  bank_ifsc_code: z.string().trim().min(3, 'Invalid').regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  bank_account_type: z.enum(['savings', 'current'], 'Invalid'),
  bank_upi_id: word,
  bank_cancelled_cheque_photo: file,
})
export type ExistingUserAsStaffType = z.infer<typeof ExistingUserAsStaffSchema>

export const SendInvitationSchema = z.strictObject({
  full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  email: email,
})
export type SendInvitationType = z.infer<typeof SendInvitationSchema>

export const InvitationJWTSchema = z.strictObject({
  user_id: uuid,
  email: email,
  full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
})
export type InvitationJWTType = z.infer<typeof InvitationJWTSchema>

export const CreateSchoolClassSchema = z.strictObject({
  class_standard: number.max(12, 'Invalid'),
  class_section: z.string().trim().length(1).regex(/^[A-Za-z]$/, 'Must be a letter').toUpperCase(),
  academic_year: word.regex(/^\d{4}-\d{2}$/, 'Invalid format (e.g. 2026-27)'),
})
export type CreateSchoolClassType = z.infer<typeof CreateSchoolClassSchema>

export const UpdateClassTeacherSchema = z.strictObject({
  class_id: uuid,
  employee_id: uuid,
})
export type UpdateClassTeacherType = z.infer<typeof UpdateClassTeacherSchema>

export const CreateClassSubjectSchema = z.strictObject({
  name: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  class_id: uuid,
  subject_teacher: uuid,
  syllabus: file,
  subject_code: word.toUpperCase().regex(/^[A-Z0-9\-]+$/, 'Invalid format (e.g. MATH-8A)'),
  academic_year: word.regex(/^\d{4}-\d{2}$/, 'Invalid format (e.g. 2026-27)'),
})
export type CreateClassSubjectType = z.infer<typeof CreateClassSubjectSchema>

export const StudentWithExistingUserParentSchema = z.strictObject({
  email: email,
  phone: phone,
  occupation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  annual_income: number,
  student_relation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  student_date_of_birth: date,
  student_full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  student_blood_group: blood_group,
  student_gender: gender,
  student_medical_notes: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods').or(z.literal('')),
  class: word.toUpperCase().regex(/^[A-Z0-9]+$/, 'Must contain only alphabets and numbers')
})
export type StudentWithExistingUserParentType = z.infer<typeof StudentWithExistingUserParentSchema>

export const StudentWithNewParentSchema = z.strictObject({
  email: email,
  phone: phone,
  password: password,
  full_name: word,
  date_of_birth: date,
  blood_group: blood_group,
  gender: gender,
  emergency_contact_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_relation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_phone: phone,
  address: word,
  city: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets'),
  state: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets'),
  pincode: pincode,
  occupation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  annual_income: number,
  student_relation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  student_date_of_birth: date,
  student_full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  student_blood_group: blood_group,
  student_gender: gender,
  student_medical_notes: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods').or(z.literal('')),
  class: word.toUpperCase().regex(/^[A-Z0-9]+$/, 'Must contain only alphabets and numbers')
})
export type StudentWithNewParentType = z.infer<typeof StudentWithNewParentSchema>