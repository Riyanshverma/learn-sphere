import { type Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';

export const globalPlugin = (app: Elysia) => 
  app.error({ AUTHENTICATION: CustomAuthError }).onError(({ code, error, status }) => {
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

    if (code === 'AUTHENTICATION') {      
      return status(401, {
        success: false,
        error: error.message,
        code: 'unauthenticated'
      });
    }

    return status(500, {
      success: false,
      error: 'Internal server error',
      code: 'internal_server_error'
    });
  });
