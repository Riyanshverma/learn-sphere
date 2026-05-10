CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- ENUMS
-- =========================
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE role_type AS ENUM ('admin', 'teacher', 'staff', 'parent', 'student');
CREATE TYPE leave_status_type AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE attendance_status_type AS ENUM ('present', 'absent', 'late', 'half_day', 'holiday', 'pending');
CREATE TYPE student_status_type AS ENUM ('active', 'inactive', 'transferred', 'graduated');
CREATE TYPE assignment_type AS ENUM ('homework', 'worksheet', 'quiz', 'project', 'lab', 'other');
CREATE TYPE submission_status_type AS ENUM ('submitted', 'late', 'reviewed', 'returned');
CREATE TYPE exam_type AS ENUM ('unit_test', 'mid_term', 'final', 'practical', 'assignment');

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- user_id
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT UNIQUE,
  date_of_birth DATE,
  blood_group blood_group_type,
  gender gender_type,
  full_name TEXT NOT NULL,
  emergency_contact JSONB, -- {"name":"...", "relation":"...", "phone_number":"..."}
  address TEXT,
  city TEXT,
  state TEXT,
  pincode CHAR(6), -- e.g. "110001"
  location POINT, -- e.g. (longitude, latitude)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$')
);

-- =========================
-- IDENTITY
-- =========================
CREATE TABLE identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- identity_id
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role role_type NOT NULL,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- =========================
-- EMPLOYEES
-- =========================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- employee_id
  identity_id UUID NOT NULL UNIQUE REFERENCES identity(id) ON DELETE CASCADE,
  qualification TEXT,
  specialization TEXT,
  designation TEXT,
  joined_date DATE NOT NULL,
  employee_code TEXT NOT NULL UNIQUE,
  monthly_salary NUMERIC(10,2),
  experience_years NUMERIC(4,1),
  timings JSONB, -- {"monday":{"from":"09:00","to":"17:00"}, ...}
  leaves JSONB, -- {"total_leaves_per_year":20, "leaves_taken":5}
  identity_proof JSONB, -- {"aadhar_card":{"number":"...", "url":"..."}, "pan_card":{"number":"...", "url":"..."}}
  bank_details JSONB, -- {"account_holder_name":"...", "branch_name":"...", "bank_name":"...", "account_number":"...", "ifsc_code":"...", "account_type":"savings", "upi_id":"...", "cancelled_cheque_url":"..."}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (monthly_salary IS NULL OR monthly_salary >= 0),
  CHECK (experience_years IS NULL OR experience_years >= 0),
  CHECK (timings IS NULL OR jsonb_typeof(timings) = 'object'),
  CHECK (leaves IS NULL OR jsonb_typeof(leaves) = 'object'),
  CHECK (identity_proof IS NULL OR jsonb_typeof(identity_proof) = 'object'),
  CHECK (bank_details IS NULL OR jsonb_typeof(bank_details) = 'object')
);

-- =========================
-- PARENTS
-- =========================
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- parent_id
  identity_id UUID NOT NULL UNIQUE REFERENCES identity(id) ON DELETE CASCADE,
  occupation TEXT,
  annual_income NUMERIC(12,2),
  student_relation TEXT, -- e.g. "father", "mother", "guardian"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (annual_income IS NULL OR annual_income >= 0)
);

-- =========================
-- LEAVE APPLICATIONS
-- =========================
CREATE TABLE leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- leave_application_id
  applicant_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_comment TEXT,
  leave_details JSONB NOT NULL, -- {"days":2, "from":"2026-04-21", "to":"2026-04-22", "leave_type":"sick", "reason":"fever"}
  leave_status leave_status_type DEFAULT 'pending',
  CHECK (jsonb_typeof(leave_details) = 'object')
);

-- =========================
-- CLASSES
-- =========================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- class_id
  class_standard SMALLINT NOT NULL, -- 1 to 12
  class_section CHAR(1) NOT NULL, -- A/B/C...
  class_teacher UUID REFERENCES employees(id) ON DELETE SET NULL,
  academic_year TEXT NOT NULL, -- e.g. "2026-27"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (class_standard, class_section, academic_year),
  CHECK (class_standard BETWEEN 1 AND 12),
  CHECK (class_section ~ '^[A-Za-z]$')
);

-- =========================
-- STUDENTS
-- =========================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- student_id
  date_of_birth DATE,
  full_name TEXT NOT NULL,
  blood_group blood_group_type,
  gender gender_type,
  admission_number TEXT NOT NULL UNIQUE,
  admission_date DATE NOT NULL,
  parent_id UUID REFERENCES parents(id) ON DELETE SET NULL,
  medical_notes TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  class_roll_number SMALLINT, -- usually 1 to 60
  student_status student_status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (class_roll_number IS NULL OR class_roll_number BETWEEN 1 AND 60)
);

-- =========================
-- SUBJECTS
-- =========================
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- subject_id
  name TEXT NOT NULL, -- e.g. "Mathematics"
  syllabus TEXT,
  subject_code TEXT NOT NULL, -- e.g. "MATH-8A"
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_teacher UUID REFERENCES employees(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  academic_year TEXT NOT NULL, -- e.g. "2026-27"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (class_id, subject_code, academic_year)
);

-- =========================
-- STUDENT ATTENDANCE
-- =========================
CREATE TABLE student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status_type NOT NULL DEFAULT 'present',
  remarks TEXT, -- e.g. "medical leave", "late by 10 mins"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, date)
);

-- =========================
-- EMPLOYEE ATTENDANCE
-- =========================
CREATE TABLE employee_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (employee_id, date)
);

-- =========================
-- SUBJECT ASSIGNMENTS
-- =========================
CREATE TABLE subject_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- assignment_id
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignment_type assignment_type NOT NULL DEFAULT 'homework',
  maximum_marks NUMERIC(6,2),
  assignment_start TIMESTAMPTZ NOT NULL,
  assignment_end TIMESTAMPTZ NOT NULL,
  assignment_content JSONB NOT NULL, -- {"instructions":"...", "questions":[...], "attachments":[...]}
  active BOOLEAN DEFAULT true,
  attempts_allowed SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (maximum_marks IS NULL OR maximum_marks >= 0),
  CHECK (assignment_end >= assignment_start),
  CHECK (attempts_allowed >= 1),
  CHECK (jsonb_typeof(assignment_content) = 'object')
);

-- =========================
-- ASSIGNMENT SUBMISSIONS
-- =========================
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- assignment_submission_id
  assignment_id UUID NOT NULL REFERENCES subject_assignments(id) ON DELETE CASCADE,
  submission_by UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE, -- student_id
  attempt SMALLINT NOT NULL DEFAULT 1,
  submission_content JSONB, -- {"answers":[...], "files":[...], "links":[...]}
  student_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), -- submitted_at
  feedback TEXT,
  submission_status submission_status_type NOT NULL DEFAULT 'submitted',
  marks_obtained NUMERIC(6,2),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (assignment_id, submission_by, attempt),
  CHECK (attempt >= 1),
  CHECK (marks_obtained IS NULL OR marks_obtained >= 0),
  CHECK (submission_content IS NULL OR jsonb_typeof(submission_content) IN ('object', 'array'))
);

-- =========================
-- EXAMS (as is) 
-- =========================
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type exam_type NOT NULL,
  academic_year TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  exam_date DATE,
  max_marks NUMERIC(6,2) NOT NULL,
  passing_marks NUMERIC(6,2),
  created_by UUID REFERENCES identity(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================
-- EXAM RESULTS (as is)
-- =========================
CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(6,2),
  grade TEXT,
  remarks TEXT,
  is_published BOOLEAN DEFAULT false,
  entered_by UUID REFERENCES identity(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (exam_id, student_id)
);