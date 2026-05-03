import { userSigninWithEmailPassword, userSigninWithPhonePassword, createDatabaseUser, uploadDocument, getDocumentURL, createAdmin, getUserIdentities, getAdminIdentityDetails, userSignout, userSigninWithEmailOtp, userSigninWithPhoneOtp, verifyEmailOtp, verifyPhoneOtp, getDatabaseUser, updateDatabaseUser, createNewTeacher, createExistingUserAsTeacher } from "./auth.service";

export { userSigninWithEmailPassword, userSigninWithPhonePassword, createDatabaseUser, uploadDocument, getDocumentURL, createAdmin, getUserIdentities, getAdminIdentityDetails, userSignout, userSigninWithEmailOtp, userSigninWithPhoneOtp, verifyEmailOtp, verifyPhoneOtp, getDatabaseUser, updateDatabaseUser, createNewTeacher, createExistingUserAsTeacher }

import { getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationByResend, sendTeacherInvitationBySupabase, createTeacherInvitation } from "./admin.service";

export { getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationByResend, sendTeacherInvitationBySupabase, createTeacherInvitation }
