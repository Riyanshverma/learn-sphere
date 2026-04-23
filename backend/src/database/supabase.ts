import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export const supabaseAdmin: SupabaseClient = createClient(
  Bun.env.DB_URL,
  Bun.env.DB_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const supabaseUser: SupabaseClient = createClient(
  Bun.env.DB_URL,
  Bun.env.DB_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const createUserClient = (token: string): SupabaseClient => {
  return createClient(Bun.env.DB_URL, Bun.env.DB_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
