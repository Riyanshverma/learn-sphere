import { z } from "zod"

const email = z.string().trim().toLowerCase().email('Invalid email').or(z.literal(''))
const password = z.string().trim().min(6, 'Must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, 'Must contain at least an uppercase letter, a number, and a special character')
const phone = z.string().trim().regex(/^\+91[6-9]\d{9}$/, 'Invalid').or(z.literal(''))
const blood_group = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid')
const gender = z.enum(['male', 'female', 'other'], 'Invalid')
const date = z.coerce.date({ error: 'Invalid' })
const word = z.string().trim().min(3, 'Invalid').toLowerCase()
const number = z.coerce.number().int('Invalid').min(0, 'Invalid') as z.ZodNumber
const pincode = z.coerce.number().int('Invalid').refine((val) => /^\d{6}$/.test(String(val)), { message: 'Must be 6 digits' })
const days = z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).min(1, 'Select at least one day');
const uuid = z.uuid('Invalid')
const otp = z.string().trim().length(8, 'Must be 8 digits').regex(/^[0-9]+$/, 'Invalid')
const time = z.iso.time('Invalid')
const file = z.instanceof(File).refine((file) => file.size > 0, 'Invalid')

export const UserLoginWithPasswordSchema = z.strictObject({
  email: email,
  phone: phone,
  password: password,
})
export type UserLoginWithPasswordType = z.infer<typeof UserLoginWithPasswordSchema>

export const UserLoginWithOtpSchema = z.strictObject({
  email: email,
  phone: phone,
})
export type UserLoginWithOtpType = z.infer<typeof UserLoginWithOtpSchema>

export const UserOtpVerificationSchema = z.strictObject({
  email: email,
  phone: phone,
  otp: otp,
})
export type UserOtpVerificationType = z.infer<typeof UserOtpVerificationSchema>

export const EmployeeSignupSchema = z.strictObject({
  email: email,
  password: password,
  full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  phone: phone,
  date_of_birth: date,
  blood_group: blood_group,
  gender: gender,
  emergency_contact_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_relation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_phone: phone,
  address: word,
  city: word.regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
  state: word.regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
  pincode: pincode,
  qualifications: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  specialization: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  monthly_salary: number,
  experience_years: number,
  timings_days: days,
  timings_from: time,
  timings_to: time,
  aadhar_card_number: word.regex(/^\d{12}$/, 'Must be 12 digits'),
  aadhar_card_photo: file,
  pan_card_number: z.string().trim().min(3, 'Invalid').regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  pan_card_photo: file,
  bank_account_holder_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  bank_branch_name: word,
  bank_name: word,
  bank_account_number: word.min(9, 'Too short').max(18, 'Too long'),
  bank_ifsc_code: z.string().trim().min(3, 'Invalid').regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  bank_account_type: z.enum(['savings', 'current'], 'Invalid'),
  bank_upi_id: word.optional(),
  bank_cancelled_cheque_photo: file,
})
export type EmployeeSignupType = z.infer<typeof EmployeeSignupSchema>

export const identityIdSchema = z.strictObject({
  identity_id: uuid,
})
export type identityIdType = z.infer<typeof identityIdSchema>

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

export const SendTeacherInvitationSchema = z.strictObject({
  full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  email: email,
})
export type SendTeacherInvitationType = z.infer<typeof SendTeacherInvitationSchema>

export const TeacherInviteJWTSchema = z.strictObject({
  user_id: uuid,
  email: email,
  full_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
})
export type TeacherInviteJWTType = z.infer<typeof TeacherInviteJWTSchema>

export const TeacherSignupSupabaseSchema = z.strictObject({
  password: password,
  phone: phone,
  date_of_birth: date,
  blood_group: blood_group,
  gender: gender,
  emergency_contact_name: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_relation: word.regex(/^[A-Za-z ]+$/, 'Must contain only alphabets and spaces'),
  emergency_contact_phone: phone,
  address: word,
  city: word.regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
  state: word.regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
  pincode: pincode,
  qualifications: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  specialization: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
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
export type TeacherSignupSupabaseType = z.infer<typeof TeacherSignupSupabaseSchema>

export const TeacherSignupResendSchema = z.strictObject({
  qualifications: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
  specialization: word.regex(/^[A-Za-z, \.\-]+$/, 'Must contain only alphabets, spaces, commas, hyphens, and periods'),
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
export type TeacherSignupResendType = z.infer<typeof TeacherSignupResendSchema>