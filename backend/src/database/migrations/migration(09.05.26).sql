-- 09.05.26

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE users ADD COLUMN search_user_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(full_name, '')), 'A')
) STORED;

CREATE INDEX idx_users_search ON users USING GIN (search_user_vector);

CREATE INDEX idx_users_fullname_trgm ON users USING GIN (full_name gin_trgm_ops);

CREATE OR REPLACE FUNCTION get_searched_teachers(
  p_search TEXT
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH search_results AS (
    SELECT 
      u.email,
      u.full_name,
      u.phone,
      i.id AS identity_id,
      e.id AS employee_id,
      e.qualification,
      e.specialization,
      e.employee_code,
      ts_rank(u.search_user_vector, websearch_to_tsquery('english', p_search)) AS fts_rank,
      similarity(u.full_name, p_search) AS trigram_rank
    FROM users u
    JOIN identity i ON i.user_id = u.id
    LEFT JOIN employees e ON e.identity_id = i.id
    WHERE i.role = 'teacher'
      AND i.active = true
      AND i.verified = true
      AND (
        u.search_user_vector @@ websearch_to_tsquery('english', p_search)
        OR u.full_name % p_search
      )
    ORDER BY fts_rank DESC, trigram_rank DESC
    LIMIT 10
  )
  SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'email', email,
        'full_name', full_name,
        'phone_number', phone,
        'identity_id', identity_id,
        'employee_id', employee_id,
        'qualification', qualification,
        'specialization', specialization,
        'employee_code', employee_code
      )
    ), 
  '[]'::jsonb)
  FROM search_results;
$$;

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