import { type userLoginType } from "../validations";

export const login = async ({ body }: { body: userLoginType }) => {
  try {
    const { email, password } = body
    console.log(email, password);
    
  } catch (error: any) {

  }
};