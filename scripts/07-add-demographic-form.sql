-- Production-safe, idempotent migration for demographic and routine feedback forms.

ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'demographic_form';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'feedback_routine';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'feedback_exercise';

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'demographic_gender') THEN
        CREATE TYPE demographic_gender AS ENUM (
            'male',
            'female',
            'other'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'demographic_age_range') THEN
        CREATE TYPE demographic_age_range AS ENUM (
            '<18',
            '18-24',
            '25-34',
            '35-44',
            '45-54',
            '55-64',
            '65+'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'demographic_membership') THEN
        CREATE TYPE demographic_membership AS ENUM (
            'classic-card',
            'pf-black-card',
            'invite'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS demographic_forms (
  id            BIGSERIAL PRIMARY KEY,
  session_id    BIGINT NOT NULL REFERENCES sessions(id),
  gender        demographic_gender NOT NULL,
  age_range     demographic_age_range NOT NULL,
  membership    demographic_membership NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT demographic_forms_contact_required
    CHECK (NULLIF(BTRIM(contact_email), '') IS NOT NULL
        OR NULLIF(BTRIM(contact_phone), '') IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_demographic_forms_session_time
  ON demographic_forms (session_id, created_at);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'routine_feedback_value') THEN
        CREATE TYPE routine_feedback_value AS ENUM (
            'liked',
            'disliked'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS routine_feedback (
  id          BIGSERIAL PRIMARY KEY,
  session_id  BIGINT NOT NULL REFERENCES sessions(id),
  type        event_type NOT NULL,
  value       routine_feedback_value NOT NULL,
  routine     routine_type NOT NULL,
  exercise_id TEXT REFERENCES exercises(id),
  level_id    SMALLINT NOT NULL REFERENCES routine_levels(id),
  day_routine INT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT routine_feedback_type_check
    CHECK (type::TEXT IN ('feedback_routine', 'feedback_exercise')),
  CONSTRAINT routine_feedback_exercise_check
    CHECK (
      (type::TEXT = 'feedback_routine' AND exercise_id IS NULL)
      OR (type::TEXT = 'feedback_exercise' AND exercise_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_routine_feedback_session_time
  ON routine_feedback (session_id, created_at);
