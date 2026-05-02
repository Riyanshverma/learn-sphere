import { adminSignup, adminIdentityDetails } from "./admin/auth.controller";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation } from "./admin/school-academic.controller";

export { adminSignup, adminIdentityDetails, addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation }

import { teacherSignupWithSupabase, teacherSignupWithResend } from "./teacher/auth.controller";

export { teacherSignupWithSupabase, teacherSignupWithResend }
