import { Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';
import type { role } from '../types';

export const authorizationPlugin = (...roles: role[]) => (app: Elysia) =>
  app.derive(async ({ cookie: { role } }) => {
    if (!role.value || !roles.includes(role.value as role)) {
      throw new CustomAuthError('Access denied', 'UnauthorizedError', 403, 'UNAUTHORIZED');
    }
  });
