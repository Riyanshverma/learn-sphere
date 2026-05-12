import { z } from "zod"

const email = z.string().trim().toLowerCase().email('Invalid').or(z.literal(''))
const password = z.string().trim().min(6, 'Must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/,
'Must contain at least an uppercase letter, a number, and a special character')
const phone = z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid').or(z.literal(''))
const otp = z.string().trim().length(8, 'Must be 8 digits').regex(/^[0-9]+$/, 'Invalid')
const blood_group = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid')
const gender = z.enum(['male', 'female', 'other'], 'Invalid')
const date = z.date({ error: 'Invalid' })
const word = z.string().trim().min(1, 'Invalid').toLowerCase()
const number = z.coerce.number().int('Invalid').min(0, 'Invalid') as z.ZodNumber
const pincode = z.coerce.number().int('Invalid').refine((val) => /^\d{6}$/.test(String(val)), { message: 'Must be 6 digits' }) as z.ZodNumber
const days = z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).min(1, 'Select at least one day');
const time = z.iso.time('Invalid')
const file = z.instanceof(FileList).refine((list) => list.length > 0, 'Invalid')
const uuid = z.uuid('Invalid')
const role = z.enum(['teacher', 'student', 'admin', 'staff'], 'Invalid')
const timestamp = z.iso.datetime({ offset: true })
const iso_date = z.iso.date('Invalid')
const attendance_status = z.enum(['present', 'absent', 'late', 'half_day', 'holiday', 'pending'], 'Invalid')
const leave_type = z.enum(['sick', 'casual', 'maternity', 'paternity', 'unpaid', 'bereavement', 'other'], 'Invalid')

export const AddClassSubjectSchema = z.object({
  subject_name: word,
  syllabus: file,
  class_id: uuid,
  subject_teacher: uuid,
  academic_year: word.regex(/^\d{4}-\d{2}$/, 'Invalid format (e.g. 2026-27)'),
  teacher_specialization: word,
  teacher_qualification: word,
  teacher_email: email,
  teacher_full_name: word,
  teacher_phone: phone,
  class_standard: number,
  class_section: word.toUpperCase(),
})
export type AddClassSubjectType = z.infer<typeof AddClassSubjectSchema>

export const SearchSchema = z.object({
  search: word
})
export type SearchType = z.infer<typeof SearchSchema>

export const ApplyForLeaveSchema = z.object({
  applicant_id: uuid,
  leave_from_date: date,
  leave_to_date: date,
  leave_type: leave_type,
  leave_reason: word.regex(/^[a-zA-Z0-9 ]+$/, 'Invalid').or(z.literal('')),
})
export type ApplyForLeaveType = z.infer<typeof ApplyForLeaveSchema>