CREATE INDEX idx_sessions_club_time
  ON sessions (club_id, first_seen_at);

CREATE INDEX idx_page_views_session
  ON page_views (session_id);

CREATE INDEX idx_page_views_routine_level_time
  ON page_views (routine, level_id, visited_at);

CREATE INDEX idx_events_session_time
  ON events (session_id, created_at);

CREATE INDEX idx_events_exercise_time
  ON events (exercise_id, created_at);

CREATE INDEX idx_events_routine_level
  ON events (routine, level_id);

