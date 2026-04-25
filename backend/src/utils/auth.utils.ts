import { type Context } from "elysia";
import { userSignin, getUserIdentities } from "../services";
import { type userLoginType } from "../validations";
import { setAuthCookies } from "../utils";

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