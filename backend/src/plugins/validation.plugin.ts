import { type Elysia } from 'elysia';

export const validationErrorPlugin = (app: Elysia) => 
  app.onError(({ code, error, status }) => {
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
  });