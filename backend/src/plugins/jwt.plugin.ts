import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import type { ZodObject } from 'zod';

export const jwtPlugin = (schema: ZodObject) => (app: Elysia) =>
  app.use(
    jwt({
      name: 'jwt',
      secret: Bun.env.JWT_SECRET_KEY!,
      exp: '1d',
      schema
    })
  );