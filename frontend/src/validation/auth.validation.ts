import { z } from "zod"

const email = z.string().trim().toLowerCase().email('Invalid')
const password = z.string().trim().min(6, 'Must be at least 6 characters long').regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/,
'Must contain at least an uppercase letter, a number, and a special character')

export const UserLoginSchema = z.strictObject({
  email: email,
  password: password,
})
export type UserLoginType = z.infer<typeof UserLoginSchema>
