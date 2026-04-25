import { type Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';

export const validationPlugin = (app: Elysia) => 
  app.error({ AUTHENTICATION: CustomAuthError }).onError(({ code, error, status }) => {
    if (code === 'VALIDATION') {      
      return status(400, {
        success: false,
        message: 'Validation failed',
        errors: error.all.map((issue) => ({
          field: issue.path,
          message: issue.message,
        })),
      });
    }

    if (code === 'AUTHENTICATION') {
        return status(401, {
          success: false,
          message: error.message,
          code: error.code
        });
      }
  });
