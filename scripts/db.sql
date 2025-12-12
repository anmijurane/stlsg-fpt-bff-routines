-- create a database
CREATE DATABASE db_test;

CREATE TABLE clubs (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  city        TEXT NOT NULL,
  address     TEXT
);

CREATE TABLE exercises (
  id           TEXT PRIMARY KEY,         -- tu id tipo 'y7z8a9b1'
  name         TEXT NOT NULL,
  muscle_group TEXT,
  zone         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE routine_type AS ENUM (
  'adaptation',
  'muscle-gain',
  'health',
  'fat-burning'
);

CREATE TABLE routine_levels (
  id        SMALLINT PRIMARY KEY,   -- 1, 2, 3, 4...
  label     TEXT NOT NULL           -- 'Básico', 'Intermedio', etc. si quieres
);

CREATE TABLE sessions (
  id                  BIGSERIAL PRIMARY KEY,
  session_ref         UUID NOT NULL UNIQUE,      -- sessionRef
  slug                TEXT,                     -- tu slug '257d3e6a8b'
  club_id             TEXT REFERENCES clubs(id),
  with_cookie         BOOLEAN NOT NULL,
  client_ip           INET,
  user_agent_browser  TEXT,
  user_agent_os       TEXT,
  user_agent_device   TEXT,
  first_seen_at       TIMESTAMPTZ NOT NULL,     -- primer evento
  last_seen_at        TIMESTAMPTZ NOT NULL,     -- se va actualizando
);

CREATE INDEX idx_sessions_club_time
  ON sessions (club_id, first_seen_at);

CREATE TABLE page_views (
  id              BIGSERIAL PRIMARY KEY,
  session_id      BIGINT NOT NULL REFERENCES sessions(id),
  page_path       TEXT NOT NULL,          -- '/routine/adaptation/'
  query_string    TEXT,                   -- 'level=2'
  routine         routine_type,           -- 'adaptation' / 'muscle-gain', etc.
  level_id        SMALLINT REFERENCES routine_levels(id),
  visited_at      TIMESTAMPTZ NOT NULL,
);

CREATE INDEX idx_page_views_session
  ON page_views (session_id);

CREATE INDEX idx_page_views_routine_level_time
  ON page_views (routine, level_id, visited_at);

CREATE TYPE event_type AS ENUM (
  'exercise_view',
  'exercise_start',
  'exercise_finish',
  'feedback',
  'click',
  'other'
);

CREATE TABLE events (
  id              BIGSERIAL PRIMARY KEY,
  session_id      BIGINT NOT NULL REFERENCES sessions(id),
  page_view_id    BIGINT REFERENCES page_views(id),
  type            event_type NOT NULL,
  exercise_id     TEXT REFERENCES exercises(id),
  exercise_name   TEXT,                   -- denormalizado por si cambia el nombre
  routine         routine_type,
  level_id        SMALLINT REFERENCES routine_levels(id),
  created_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_events_session_time
  ON events (session_id, created_at);

CREATE INDEX idx_events_exercise_time
  ON events (exercise_id, created_at);

CREATE INDEX idx_events_routine_level
  ON events (routine, level_id);



