-- create a database
create DATABASE db_test

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

INSERT INTO routine_levels (id, label) VALUES
(1, 'Nivel 1'),
(2, 'Nivel 2'),
(3, 'Nivel 3'),
(4, 'Nivel 4');

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

CREATE TYPE emoji as ENUM (
  'happy',
  'neutral',
  'sad',
  'null'
)

CREATE TABLE feedback (
  id          BIGSERIAL PRIMARY KEY,
  session_id  BIGINT NOT NULL REFERENCES sessions(id),
  exercise_id TEXT REFERENCES exercises(id),
  emoji       emoji NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

INSERT INTO clubs (id, name, city, address) VALUES
('6623005224', 'Cimatario', 'Queretaro', NULL),
('fa3dde34d7', 'El Molino', 'Monterrey', NULL),
('236a7d40af', 'Punto Rio Nilo', 'Guadalajara', NULL),
('90e4b5c13a', 'The Park', 'San Luis', NULL),
('6f1c8b2375', 'Punto León', 'Leon', NULL),
('c022aa7cdc', 'Candiles', 'Queretaro', NULL),
('2e7d9a4c05', 'Glorieta', 'San Luis', NULL),
('8c1029a5e7', 'Antea', 'Queretaro', NULL),
('f1e2d3c4b5', 'Plaza Del Angel', 'Guadalajara', NULL),
('358829c03d', 'Lindavista', 'Leon', NULL),
('17cf8bbf29', 'Santa Catarina', 'Monterrey', NULL),
('660e5a1d8c', 'La Estanzuela', 'Monterrey', NULL),
('c6232e9461', 'Arcadia', 'Monterrey', NULL),
('0b0986e177', 'Santa Isabel', 'Saltillo', NULL),
('c4e220d3af', 'Torrecillas', 'Puebla', NULL),
('aa85485a04', 'Galerías Cuernavaca', 'Cuernavaca', NULL),
('6a2052d8f9', 'Paseo Acoxpa', 'CDMX', NULL),
('9e4f35b27c', 'Satelite', 'Edo de Mex', NULL),
('8932ff1b6e', 'San Marcos', 'Edo de Mex', NULL),
('d7b69c1f80', 'La Paz Puebla', 'Puebla', NULL),
('54b5f8a3c2', 'Valle Dorado', 'Edo de Mex', NULL),
('bf41e2d6ab', 'Tlatelolco', 'CDMX', NULL),
('eac1e502d3', 'Encuentro Oceania', 'CDMX', NULL),
('44a6932e11', 'Serviplaza Villa Verde', 'Puebla', NULL),
('b291e7d7f0', 'Tollocan', 'Edo de Mex', NULL),
('5dc0a1b409', 'Angelópolis', 'Puebla', NULL),
('7aa8f6d5c3', 'Coacalco', 'Edo de Mex', NULL),
('15bd2f6108', 'Acueducto', 'CDMX', NULL),
('b70f4e2d6a', 'Jardines Xalapa', 'VER', NULL),
('257d3e6a8b', 'Center Plazas', 'Veracruz', NULL),
('a49d5f73c4', 'Mixcoac', 'CDMX', NULL),
('31b8e2a04f', 'Cumbres 1188', 'CDMX', NULL),
('3d207a9c12', 'Centro Las Americas', 'Edo de Mex', NULL),
('9b4a5e7d13', 'Andamar', 'Veracruz', NULL),
('c50f0f52f8', 'Los Pinos', 'Veracruz', NULL),
('4bfa66b080', 'Gran Plaza Mazatlan', 'Mazatlan', NULL),
('8173b8366a', 'Altolivo', 'CDMX', NULL),
('3d90a85839', 'Celta Guadalajara', 'Guadalajara', NULL),
('1e3a0ef22e', 'Harbor Mérida', 'Mérida', NULL),
('c45c1a9f19', 'Estadio Gdl', 'Guadalajara', NULL),
('7fc28ff6a1', 'Zapata Culiacan', 'Culiacán', NULL),
('d37333456f', 'Malecón Las Américas', 'Cancún', NULL),
('61b395fb2b', 'Parque Vértice', 'León', NULL),
('49fa0060c3', 'Galerias Guadalajara', 'Guadalajara', NULL),
('5fdc64fa8d', 'Punto Sur', 'Guadalajara', NULL),
('98f1370821', 'USA', 'EEUU', NULL);

INSERT INTO routine_levels (id, label) VALUES
(1, 'Nivel 1'),
(2, 'Nivel 2'),
(3, 'Nivel 3'),
(4, 'Nivel 4');


INSERT INTO exercises (id, name, muscle_group, zone) VALUES
('u3v4w5x6', 'Abdominal crunch', 'Abdomen', 'Funcional'),
('o5p6q7r8', 'Abductor', 'Glúteo', 'Funcional'),
('k1l2m3n4', 'Aductor', 'Aductores', 'Funcional'),
('e9f1c9a8b3e9', 'Azote de cuerda en sentadilla isometrica', 'Cuádriceps/glúteo/hombro', 'Funcional'),
('hc1a2b38', 'Caminadora', 'Todo el cuerpo', 'Cardio'),
('f1c9a8b3e9', 'Cangrejo codo a la rodilla', 'Abdomen (oblicuos)', 'Funcional'),
('f8a9b2c7', 'Cardio a elegir', 'Todo el cuerpo', 'Cardio'),
('ij1k2l3m', 'Circuito Express', 'Todo el cuerpo', 'Circuito Express'),
('a7b3c6d9', 'Clase de circuito express', 'Todo el cuerpo', 'Circuito Express'),
('w4x5y6z7', 'Clase PE@PF', 'Todo el cuerpo', 'Funcional/Circuito Express'),
('f5g6h7i8', 'Curl de Bicep Predicador', 'Biceps', 'Peso integrado'),
('i9j1k2l3', 'Curl de Biceps', 'Biceps', 'Peso integrado'),
('i2j6k3l7', 'Curl de Bíceps en polea baja', 'Biceps', 'Poleas'),
('g6h7i8j9', 'Curl de Piernas Sentado', 'Femoral', 'Peso integrado'),
('a8b3e9f1c9a8', 'Curl martillo alternado con mancuerna', 'Bicep', 'Funcional'),
('d9e1f5a3', 'Desplante alternado con salto', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('d3e4f5g6', 'Desplante TRX', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('h4e6f8a2', 'Elíptica', 'Todo el cuerpo', 'Cardio'),
('d1c9a8b3e9f1', 'Escaladores', 'Abdomen (oblicuos)', 'Funcional'),
('a4b3e9f1', 'Escaladores cruzados', 'Abdomen (oblicuos)', 'Funcional'),
('c2d3e4f5', 'Extensión de Cuádriceps', 'Cuádriceps', 'Peso integrado'),
('p6q7r8s9', 'Extensión de Espalda', 'Lumbar', 'Peso integrado'),
('s9t1u2v3', 'Extensión de Gemelos', 'Pantorrilla', 'Peso integrado'),
('d2e3f4g5', 'Extensión de Triceps', 'Triceps', 'Peso integrado'),
('n5o6p7q8', 'Extensión de Triceps en Polea', 'Triceps', 'Peso integrado'),
('l2m3n4o5', 'Glúteo', 'Glúteo', 'Funcional'),
('x6y7z8a9', 'Hammer Strength Chest Press', 'Pectoral', 'Peso integrado'),
('b1c2d3e4', 'Hammer Strength incline Chest', 'Pectoral', 'Peso integrado'),
('g1h5i2j6', 'Hammer Strength Incline Chest Press', 'Pectoral', 'Peso integrado'),
('z7a8b9c1', 'Hammer Strength Mts front Pulldown', 'Espalda', 'Peso integrado'),
('v3w4x5y6', 'Hammer strength mts Remo', 'Espalda', 'Peso integrado'),
('t2u3v4w5', 'Hammer strength Shoulder Press', 'Hombros', 'Peso integrado'),
('z8a9b1c2', 'Jalón al Pecho', 'Espalda', 'Peso integrado'),
('c9a8b3e9f1c9', 'Lagartijas', 'Pectoral', 'Funcional'),
('d2a4b3e9', 'Marcha alternada estático', 'Cuádriceps/glúteo', 'Funcional'),
('f1c9a8b3e9f', 'Oruga', 'Abdomen', 'Funcional'),
('b3e9f1c9a8', 'Paso joggie', 'Cuádriceps/glúteo', 'Funcional'),
('jt4u5v6w', 'Plancha con apertura de piernas', 'Abdomen', 'Funcional'),
('r9s1t2u3', 'Plancha con flexión y extensión de codos', 'Abdomen', 'Funcional'),
('b9c3d7e1', 'Plancha con rotación de torso', 'Abdomen', 'Funcional'),
('b3e9f1c9', 'Plancha estatica en Bosú', 'Abdomen', 'Funcional'),
('k3l7m4n8', 'Plancha lateral', 'Abdomen', 'Funcional'),
('h7i8j9k1', 'Prensa de Pierna', 'Cuádriceps/glúteo/femoral', 'Peso integrado'),
('a1b2c3d4', 'Press de Hombro', 'Hombros', 'Peso integrado'),
('e5f6g7h8', 'Press de Pecho', 'Pectoral', 'Peso integrado'),
('m4n5o6p7', 'Press de triceps', 'Triceps', 'Peso integrado'),
('j3k4l5m6', 'Remo en Polea', 'Espalda', 'Peso integrado'),
('q8r9s1t2', 'Remo Sentado', 'Espalda', 'Peso integrado'),
('ig7h8i9j', 'Rotación de torso', 'Abdomen (oblicuos)', 'Funcional'),
('o5p9q2r6', 'Rotación de torso en maquina', 'Abdomen (oblicuos)', 'Peso integrado'),
('d5e6f8a9', 'Saltos rodillas al pecho', 'Cuádriceps/glúteo', 'Funcional'),
('a8b3e9f1c9a8b', 'Sentadilla con Salto rodillas al pecho', 'Cuádriceps/glúteo', 'Funcional'),
('d1c9a8b3e9', 'Sentadilla sobre Bosú', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('y7z8a9b1', 'Sentadilla TRX', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('e9f2a7b4', 'Sentadilla TRX con salto', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('a3b8c1d6', 'Sentadillas', 'Cuádriceps/glúteo/femoral', 'Funcional'),
('ia1b2c3d', 'Talones alternados al glúteo', 'Glúteo/femoral', 'Funcional'),
('b1c5d8e2', 'Tijeras frontales en tapete', 'Abdomen', 'Funcional');


INSERT INTO sessions (
  session_ref,
  slug,
  club_id,
  client_ip,
  user_agent_browser,
  user_agent_os,
  user_agent_device,,
  first_seen_at,
  last_seen_at,
  raw_payload
) VALUES (
  'f8976edf-1a67-47b2-88e3-2df4a173c33d',
  '257d3e6a8b',
  '257d3e6a8b',
  '187.190.137.32',
  'Mobile Chrome 140.0.0.0',
  'Android 10',
  'K',
  '2025-10-01T00:00:12.085Z',
  '2025-10-01T00:00:12.085Z',
)
ON CONFLICT (session_ref) DO UPDATE
SET last_seen_at = EXCLUDED.last_seen_at;

INSERT INTO page_views (
  session_id,
  page_path,
  query_string,
  routine,
  level_id,
  visited_at
)
VALUES (
  2,
  '/routine/adaptation/',
  'level=2',
  'adaptation',
  2,
  '2025-10-01T00:00:12.085Z',
)
RETURNING id;

INSERT INTO events (
  session_id,
  page_view_id,
  type,
  exercise_id,
  exercise_name,
  routine,
  level_id,
  created_at
)
VALUES (
  2,
  1,
  'exercise_view',
  'a8b3e9f1c9a8b',
  'Hammer Strength incline Chest',
  'adaptation',
  2,
  NOW()
);
