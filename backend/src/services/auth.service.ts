import { supabaseAdmin, supabaseUser, createUserClient } from '../database';
import { type Session, CustomAuthError, type User } from '@supabase/supabase-js';
import { type userLoginType } from '../validations';
import type { createDatabaseUserType, uploadDocumentType, uploadDocumentResponse, createAdminType } from '../types';

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

export const createDatabaseUser = async ({ email, password, phone, full_name }: createDatabaseUserType): Promise<User> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, phone, email_confirm:true, phone_confirm: true, user_metadata: { full_name }});
    
    if (error) {
      throw error
    } else if(!data.user) {
      throw new CustomAuthError('No user was returned', 'UserCreationError', 500, 'user_creation_failed')
    }
    
    return data.user
  } catch (error: any) {
    console.error(error.message);
    throw error
  }
}

export const uploadDocument = async ({ name, buffer, mime_type }: uploadDocumentType): Promise<uploadDocumentResponse> => {
  try {
    const { data, error } = await supabaseAdmin.storage.from('learn-sphere').upload(`uploaded-documents/${name}`, buffer, {
        contentType: mime_type,
        upsert: false,
      });
    
    if (error) {
      throw error;
    }
    
    return data as uploadDocumentResponse
  } catch (error: any) {
    console.error(error.message)
    throw error
  }
}

export const getDocumentURL = async (document_path: string) => {
  try {
    const { data } = supabaseAdmin.storage.from('learn-sphere').getPublicUrl(document_path);

    return data.publicUrl as string;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const createAdmin = async ({ id, email, phone, date_of_birth, blood_group, gender, full_name, emergency_contact, address, city, state, pincode, qualifications, specialization, monthly_salary, experience_years, timings, identity_proof, bank_details }: createAdminType) => {
  try {


  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}