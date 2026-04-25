import { type Context } from "elysia";
import { userSignin } from "../services";
import { type userLoginType } from "../validations";

export const login = async (context: Context<{ body: userLoginType }>) => {
  try {
    const { email, password } = context.body
    
    const session = await userSignin({ email, password })

    // TODO: Get user identites

    // TODO: Set cookies

    // TODO: Send response
    
  } catch (error: any) {

  }
};