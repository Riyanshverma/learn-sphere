import { type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";
import { CustomAuthError } from "@supabase/supabase-js";

export const signJWT = async (jwt: any, payload: JWTPayloadInput): Promise<string> => {
  return await jwt.sign(payload);
};

export const verifyJWT = async (jwt: any, token: string): Promise<JWTPayloadSpec> => {
  try {
    const payload = await jwt.verify(token);

    if(!payload) {
      throw new CustomAuthError('Invalid or expired token', 'TokenError', 401, 'invalid_token');
    }
    return payload;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
