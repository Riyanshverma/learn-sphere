import { type userLoginType } from "../validations";
import { userSignin } from "../services";

export const login = async ({ body }: { body: userLoginType }) => {
  try {
    const { email, password } = body
    
    const session = await userSignin({ email, password })

    // TODO: Get user identites

    // TODO: Set cookies

    // TODO: Send response
    
  } catch (error: any) {

  }
};