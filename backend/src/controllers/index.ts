import { adminSignup, adminIdentityDetails } from "./admin/auth.controller";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, addClassSubject, sendStudentInvitation, fetchParentInvitations, addStudentWithNewParent, addStudentWithExistingUserParent, addStudentToClassAndAcceptInvitation, fetchAllClassesDetails, searchTeachers } from "./admin/school-academic.controller";
export { adminSignup, adminIdentityDetails, addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, addClassSubject, sendStudentInvitation, fetchParentInvitations, addStudentWithNewParent, addStudentWithExistingUserParent, addStudentToClassAndAcceptInvitation, fetchAllClassesDetails, searchTeachers }

import { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails } from "./teacher/auth.controller";
export { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails }

import { studentSignupWithSupabase, studentSignupWithResend, parentIdentityDetails } from "./parent/auth.controller";
export { studentSignupWithSupabase, studentSignupWithResend, parentIdentityDetails }
