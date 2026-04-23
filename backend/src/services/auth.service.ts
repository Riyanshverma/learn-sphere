import { supabaseAdmin, supabaseUser, createUserClient } from '../database';
import { type Session, CustomAuthError } from '@supabase/supabase-js';
import { type userLoginType } from '../validations';

export const userSignin = async ({ email, password }: userLoginType): Promise<Session> => {
  try {
    const { data, error } = await supabaseUser.auth.signInWithPassword({ email, password })

    if(error) {
      throw error
    } else if (!data.session) {
      throw new CustomAuthError('No session was returned', 'SessionNotFoundError', 401, 'session_not_found');
    }

    return data.session
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}