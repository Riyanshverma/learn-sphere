-- 25.04.26

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE role_type AS ENUM ('admin', 'teacher', 'staff', 'parent', 'student');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group blood_group_type NOT NULL,
  gender gender_type NOT NULL,
  full_name TEXT NOT NULL,
  emergency_contact JSONB NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode CHAR(6) NOT NULL,
  location POINT, -- (longitude, latitude)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$')
);

CREATE TABLE identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role role_type NOT NULL,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL UNIQUE REFERENCES identity(id) ON DELETE CASCADE,
  qualification TEXT,
  specialization TEXT,
  designation TEXT,
  joined_date DATE NOT NULL,
  employee_code TEXT NOT NULL UNIQUE,
  monthly_salary NUMERIC(10,2),
  experience_years NUMERIC(4,1),
  timings JSONB,
  leaves JSONB, -- TODO: pass it in the rpc function
  identity_proof JSONB,
  bank_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
