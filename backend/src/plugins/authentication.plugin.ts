import { Elysia } from 'elysia';
import { CustomAuthError, User } from '@supabase/supabase-js';
import { getUser } from '../services/auth.service';
import { type JWTPayloadSpec, jwt } from '@elysiajs/jwt';
import { verifyJWT } from '../utils';

export const authenticationPlugin = (app: Elysia) =>
  app.use(jwt({name: 'jwt', secret: 'placeholder'})).derive(async ({ cookie: { access_token }, request, jwt }) => {
    const token = access_token.value ?? (request.headers.get('Authentication')?.startsWith('Bearer ') ? request.headers.get('Authentication')?.slice(7) : undefined)
    

    if (!token || token === 'null' || token === 'undefined') {            
      throw new CustomAuthError('Missing or malformed token', 'UnauthenticatedError', 401, 'UNAUTHENTICATED');
    }
    
    let user: User | JWTPayloadSpec    

    if(request.url.includes('resend')) {      
      user = await verifyJWT(jwt, token as string)
    } else {
      user = await getUser(token as string)
    }

    return { user };
  });