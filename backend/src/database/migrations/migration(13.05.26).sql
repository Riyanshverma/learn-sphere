-- 13.05.26

CREATE OR REPLACE FUNCTION get_searched_staffs(
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
      e.designation,
      e.employee_code,
      e.leaves,
      ts_rank(u.search_user_vector, websearch_to_tsquery('english', p_search)) AS fts_rank,
      similarity(u.full_name, p_search) AS trigram_rank
    FROM users u
    JOIN identity i ON i.user_id = u.id
    LEFT JOIN employees e ON e.identity_id = i.id
    WHERE i.role = 'staff'
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
        'designation', designation,
        'employee_code', employee_code,
        'leaves', leaves
      )
    ), 
  '[]'::jsonb)
  FROM search_results;
$$;
