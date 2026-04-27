import { type Context } from "elysia";
import { userSignin, getUserIdentities, userSignout } from "../services";
import { type userLoginType } from "../validations";
import { setAuthCookies, clearAuthCookies } from "../utils";

export const userLogin = async (context: Context<{ body: userLoginType }>) => {
  try {
    const { email, password } = context.body
    
    const session = await userSignin({ email, password })

    const user_identities = await getUserIdentities(session.user.id)

    setAuthCookies(context, session.access_token, session.refresh_token)

    return context.status(200, { success: true, message: 'Choose an identity', data: user_identities })
    
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