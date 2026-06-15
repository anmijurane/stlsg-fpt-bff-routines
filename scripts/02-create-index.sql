CREATE INDEX IF NOT EXISTS idx_sessions_club_time
  ON sessions (club_id, first_seen_at);

CREATE INDEX IF NOT EXISTS idx_page_views_session
  ON page_views (session_id);

CREATE INDEX IF NOT EXISTS idx_page_views_routine_level_time
  ON page_views (routine, level_id, visited_at);

CREATE INDEX IF NOT EXISTS idx_events_session_time
  ON events (session_id, created_at);

CREATE INDEX IF NOT EXISTS idx_events_exercise_time
  ON events (exercise_id, created_at);

CREATE INDEX IF NOT EXISTS idx_events_routine_level
  ON events (routine, level_id);

CREATE INDEX IF NOT EXISTS idx_credentials_role
  ON credentials (role_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credentials_username_unique
  ON credentials (LOWER(username))
  WHERE username IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credentials_access_key_hash
  ON credentials (access_key_hash)
  WHERE access_key_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_credentials_active_role_expires
  ON credentials (role_id, expires_at)
  WHERE active = TRUE;
