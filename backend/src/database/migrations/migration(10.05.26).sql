-- 10.05.26

CREATE TYPE attendance_status_type AS ENUM ('present', 'absent', 'late', 'half_day', 'holiday', 'pending');

CREATE TABLE employee_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status_type NOT NULL DEFAULT 'pending',
  remarks TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (employee_id, date)
);

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'generate-daily-employee-attendance',
  '30 5 * * *',
  $$
    INSERT INTO employee_attendance (employee_id, date, status)
    SELECT e.id, CURRENT_DATE, 'pending'::attendance_status_type
    FROM employees e
    JOIN identity i ON e.identity_id = i.id
    WHERE i.active = true
    ON CONFLICT (employee_id, date) DO NOTHING;
  $$
);

SELECT * FROM cron.job_run_details ORDER BY start_time DESC;

SELECT cron.unschedule('generate-daily-employee-attendance');
