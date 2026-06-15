-- Create tables with idempotency checks

CREATE TABLE IF NOT EXISTS clubs (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  city        TEXT NOT NULL,
  address     TEXT
);

CREATE TABLE IF NOT EXISTS exercises (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  muscle_group TEXT,
  zone        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routine_levels (
  id        SMALLINT PRIMARY KEY,
  label     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
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

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'routine_type') THEN
        CREATE TYPE routine_type AS ENUM (
            'adaptation',
            'muscle_gain',
            'health',
            'fat_burning'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS page_views (
  id              BIGSERIAL PRIMARY KEY,
  session_id      BIGINT NOT NULL REFERENCES sessions(id),
  page_path       TEXT NOT NULL,
  query_string    TEXT,        
  routine         routine_type,
  level_id        SMALLINT REFERENCES routine_levels(id),
  visited_at      TIMESTAMPTZ NOT NULL
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type') THEN
        CREATE TYPE event_type AS ENUM (
            'home',
            'attention_view',
            'exercise_view',
            'routine_view',
            'feedback',
            'other'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS events (
	id BIGSERIAL PRIMARY KEY,
	session_id BIGINT NOT NULL REFERENCES sessions (id),
	page_view_id BIGINT REFERENCES page_views (id),
	type event_type NOT NULL,
	exercise_id TEXT REFERENCES exercises (id),
	exercise_name TEXT, -- denormalizado por si cambia el nombre
	routine routine_type,
	level_id SMALLINT REFERENCES routine_levels (id),
  day_routine INT,
	created_at TIMESTAMPTZ NOT NULL
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'emoji') THEN
        CREATE TYPE emoji AS ENUM (
            'happy',
            'neutral',
            'sad',
            'null'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS feedback (
  id          BIGSERIAL PRIMARY KEY,
  session_id  BIGINT NOT NULL REFERENCES sessions(id),
  exercise_id TEXT REFERENCES exercises(id),
  emoji       emoji NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credentials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT,
  password_hash TEXT,
  access_key_hash TEXT,
  active BOOLEAN DEFAULT FALSE,

  valid_from TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  last_used_at TIMESTAMPTZ,
  uses_count INT DEFAULT 0,

  role_id INT REFERENCES roles (id),
  notes TEXT,

  disabled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
