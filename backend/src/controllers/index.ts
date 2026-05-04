import { adminSignup, adminIdentityDetails } from "./admin/auth.controller";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeTeacherInvitationStatus, createSchoolClass, changeClassTeacher } from "./admin/school-academic.controller";
export { adminSignup, adminIdentityDetails, addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeTeacherInvitationStatus, createSchoolClass, changeClassTeacher }

import { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails } from "./teacher/auth.controller";
export { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails }
