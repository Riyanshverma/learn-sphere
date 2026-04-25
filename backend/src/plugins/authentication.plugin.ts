import { Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';
import { getUser } from '../services/auth.service';

export const authenticationPlugin = (app: Elysia) =>
  app.error({ AUTHENTICATION: CustomAuthError }).derive(async ({ cookie: { access_token }, request }) => {
    const token = access_token.value ?? (request.headers.get('Authentication')?.startsWith('Bearer ') ? request.headers.get('Authentication')?.slice(7) : undefined)

    if (!token || token === 'null' || token === 'undefined') {
      throw new CustomAuthError('Missing or malformed token', 'UnauthenticatedError', 401, 'unauthenticated');
    }

    const user = await getUser(token as string);

    return { user };
  });
