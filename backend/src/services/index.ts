import { userSigninWithEmailPassword, userSigninWithPhonePassword, createDatabaseUser, uploadDocument, getDocumentURL, createAdmin, getUserIdentities, getAdminIdentityDetails, userSignout, userSigninWithEmailOtp, userSigninWithPhoneOtp, verifyEmailOtp, verifyPhoneOtp } from "./auth.service";

export { userSigninWithEmailPassword, userSigninWithPhonePassword, createDatabaseUser, uploadDocument, getDocumentURL, createAdmin, getUserIdentities, getAdminIdentityDetails, userSignout, userSigninWithEmailOtp, userSigninWithPhoneOtp, verifyEmailOtp, verifyPhoneOtp }

import { getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationByResend, sendTeacherInvitationBySupabase, createTeacherInvitation } from "./admin.service";

export { getDatabaseUserId, createExistingUserAsSchoolStaff, createNewSchoolStaff, checkExistingUser, sendTeacherInvitationByResend, sendTeacherInvitationBySupabase, createTeacherInvitation }
