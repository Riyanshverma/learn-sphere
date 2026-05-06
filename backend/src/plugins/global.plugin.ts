import { type Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';

export const globalPlugin = (app: Elysia) => 
  app.error({ UNAUTHENTICATED: CustomAuthError, UNAUTHORIZED: CustomAuthError }).onError(({ code, error, status }) => {
    if (code === 'VALIDATION') {
      return status(400, {
        success: false,
        error: 'Validation failed',
        errors: error.all.map((issue) => ({
          field: issue.path,
          message: issue.message,
        })),
      });
    }

    if (code === 'UNAUTHENTICATED') {      
      return status(401, {
        success: false,
        error: error.message,
        code: 'unauthenticated'
      });
    }

    if(code === "UNAUTHORIZED") {
      return status(403, {
        success: false,
        error: error.message,
        code: 'unauthorized'
      });
    }
    if(code === "INVALID_COOKIE_SIGNATURE") {
      return status(401, {
        success: false,
        error: error.message,
        code: 'invalid_token'
      });
    }

    return status(500, {
      success: false,
      error: 'Internal server error',
      code: 'internal_server_error'
    });
  });
