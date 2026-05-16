import { adminSignup, adminIdentityDetails } from "./admin/auth.controller";
export { adminSignup, adminIdentityDetails }

import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, addClassSubject, sendStudentInvitation, fetchParentInvitations, addStudentWithNewParent, addStudentWithExistingUserParent, addStudentToClassAndAcceptInvitation, fetchAllClassesDetails, searchTeachers, searchTeachersForClassTeacher } from "./admin/school-academic.controller";
export { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, addClassSubject, sendStudentInvitation, fetchParentInvitations, addStudentWithNewParent, addStudentWithExistingUserParent, addStudentToClassAndAcceptInvitation, fetchAllClassesDetails, searchTeachers, searchTeachersForClassTeacher }

import { fetchEmployeesAttendance, changeEmployeeAttendance, applyForLeaveApplication, fetchMyLeaveApplications, cancelLeaveApplication, fetchEmployeesLeaveApplications, searchStaff, changeEmployeeLeaveApplicationStatus, fetchMyAttendance } from "./admin/quick-actions.controller";
export { fetchEmployeesAttendance, changeEmployeeAttendance, applyForLeaveApplication, fetchMyLeaveApplications, cancelLeaveApplication, fetchEmployeesLeaveApplications, searchStaff, changeEmployeeLeaveApplicationStatus, fetchMyAttendance }

import { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails } from "./teacher/auth.controller";
export { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails }

import { studentSignupWithSupabase, studentSignupWithResend, parentIdentityDetails } from "./parent/auth.controller";
export { studentSignupWithSupabase, studentSignupWithResend, parentIdentityDetails }

import { fetchEmployeesPayrollsDetails, employeePayrollByCash, employeePayrollByOnline, employeePayrollByOnlineWebhook } from "./admin/finance.controller";
export { fetchEmployeesPayrollsDetails, employeePayrollByCash, employeePayrollByOnline, employeePayrollByOnlineWebhook }
