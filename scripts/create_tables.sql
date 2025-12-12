CREATE TABLE clubs (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  city        TEXT NOT NULL,
  address     TEXT,
);

CREATE TABLE exercises (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  muscle_group TEXT,
  zone        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE routine_levels (
  id        SMALLINT PRIMARY KEY,
  label     TEXT NOT NULL
);

CREATE TABLE sessions (
  id                  BIGSERIAL PRIMARY KEY,
  session_ref         UUID NOT NULL UNIQUE,
  slug                TEXT,
  club_id             TEXT REFERENCES clubs(id),
  client_ip           INET,
  user_agent_browser  TEXT,
  user_agent_os       TEXT,
  user_agent_device   TEXT,
  first_seen_at       TIMESTAMPTZ NOT NULL,
  last_seen_at        TIMESTAMPTZ NOT NULL
);

CREATE TYPE routine_type AS ENUM (
  'adaptation',
  'muscle-gain',
  'health',
  'fat-burning'
);

CREATE TABLE page_views (
  id              BIGSERIAL PRIMARY KEY,
  session_id      BIGINT NOT NULL REFERENCES sessions(id),
  page_path       TEXT NOT NULL,
  query_string    TEXT,        
  routine         routine_type,
  level_id        SMALLINT REFERENCES routine_levels(id),
  visited_at      TIMESTAMPTZ NOT NULL
);

CREATE TYPE event_type AS ENUM (
  'exercise_view',
  'exercise_start',
  'exercise_finish',
  'feedback',
  'click',
  'other'
);

CREATE TABLE events (
	id BIGSERIAL PRIMARY KEY,
	session_id BIGINT NOT NULL REFERENCES sessions (id),
	page_view_id BIGINT REFERENCES page_views (id),
	type event_type NOT NULL,
	exercise_id TEXT REFERENCES exercises (id),
	exercise_name TEXT, -- denormalizado por si cambia el nombre
	routine routine_type,
	level_id SMALLINT REFERENCES routine_levels (id),
	created_at TIMESTAMPTZ NOT NULL
);

