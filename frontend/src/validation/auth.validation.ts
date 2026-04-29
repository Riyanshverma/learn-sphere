import { z } from "zod"

const email = z.string().trim().toLowerCase().email('Invalid').or(z.literal(''))
const password = z.string().trim().min(6, 'Must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/,
'Must contain at least an uppercase letter, a number, and a special character')
const phone = z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid').or(z.literal(''))
const otp = z.string().trim().length(8, 'Must be 8 digits').regex(/^[0-9]+$/, 'Invalid')

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