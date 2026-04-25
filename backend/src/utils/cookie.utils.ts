import { type Context } from "elysia";

export const setAuthCookies = (context: Context, access_token: string, refresh_token: string): void => {
  const { cookie } = context;
  
  cookie.access_token.value = access_token;
  cookie.access_token.set({
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60,
  });

  cookie.refresh_token.value = refresh_token;
  cookie.refresh_token.set({
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
};

export const setIdentityRoleCookie = (context: Context, role: string): void => {
  const { cookie } = context;
  
  cookie.identity_role.value = role;
  cookie.identity_role.set({
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, 
  });
};

export const clearAuthCookies = (context: Context): void => {
  const { cookie } = context;
  
  cookie.access_token.remove();
  cookie.refresh_token.remove();
  cookie.identity_role.remove();
};
