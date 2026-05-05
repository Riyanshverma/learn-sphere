-- 02.05.26

CREATE TYPE invitation_status_type AS ENUM ('pending', 'accepted', 'allowed', 'expired', 'revoked');

CREATE TABLE invitations (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role role_type NOT NULL DEFAULT 'teacher',
  status invitation_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);