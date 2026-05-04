-- 04.05.26

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
