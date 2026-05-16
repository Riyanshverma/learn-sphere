import { Elysia } from 'elysia';
import { CustomAuthError } from '@supabase/supabase-js';

export const webhookAuthorizationPlugin = (app: Elysia) =>
  app.derive(async ({ request }) => {

    const signature = request.headers.get('x-razorpay-signature');
    if(!signature) {
        throw new CustomAuthError('Missing razorpay signature', 'UnauthenticatedError', 401, 'UNAUTHENTICATED');
    }

    const raw_body = await request.clone().text();
    
    const expected_signature = new Bun.CryptoHasher("sha256", Bun.env.RAZORPAY_WEBHOOK_SECRET).update(raw_body).digest("hex");
    if (expected_signature !== signature) {
      throw new CustomAuthError('Invalid razorpay signature', 'UnauthorizedError', 403, 'UNAUTHORIZED');
    }
    const body = JSON.parse(raw_body);
    
    return {
      webhook_data: body.payload.payout.entity 
    };
  });
