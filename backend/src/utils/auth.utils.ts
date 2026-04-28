import { type Context } from "elysia";
import { userSigninWithEmailPassword, getUserIdentities, userSignout, userSigninWithPhonePassword, userSigninWithEmailOtp, userSigninWithPhoneOtp } from "../services";
import { type UserLoginWithPasswordType, type UserLoginWithOtpType } from "../validations";
import { setAuthCookies, clearAuthCookies } from "../utils";
import { Session } from "@supabase/supabase-js";

export const userLoginWithPassword = async (context: Context<{ body: UserLoginWithPasswordType }>) => {
  try {
    const { email, phone, password } = context.body

    let session: Session

    if (email.length === 0) {
      session = await userSigninWithPhonePassword({ email, password, phone })
    } else {
      session = await userSigninWithEmailPassword({ email, password, phone })
    }

    const user_identities = await getUserIdentities(session.user.id)

    setAuthCookies(context, session.access_token, session.refresh_token)

    return context.status(200, { success: true, message: 'Choose an identity', data: user_identities })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, message: error.message || "Internal server error", code: error.code || 'internal_server_error' });
  }
};

export const userLoginWithOtp = async (context: Context<{ body: UserLoginWithOtpType }>) => {
  try {
    const { phone, email } = context.body

    if(email.length === 0) {
      await userSigninWithPhoneOtp({ phone, email })
    } else {
      await userSigninWithEmailOtp({ phone, email })
    }

    return context.status(200, { success: true, message: 'OTP sent successfully' })

  } catch (error: any) {
    return context.status(error.status || 500, { success: false, message: error.message || "Internal server error", code: error.code || 'internal_server_error' });
  }
};

export const userLogout = async (context: Context) => {
  try {
    const token = context.cookie.access_token.value as string

    await userSignout(token);

    clearAuthCookies(context);

    return context.status(200, { success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, message: error.message || "Internal server error", code: error.code || 'internal_server_error' });
  }
}