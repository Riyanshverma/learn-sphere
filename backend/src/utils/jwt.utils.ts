import { type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";

export const signJWT = async (jwt: any, payload: JWTPayloadInput): Promise<string> => {
  return await jwt.sign(payload);
};

export const verifyJWT = async (jwt: any, token: string): Promise<JWTPayloadSpec | false> => {
  try {
    const payload = await jwt.verify(token);
    if (!payload) {
      return false;
    }
    return payload;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
