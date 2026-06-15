CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO roles (name, description) VALUES
('root', 'Clearly the god the database'),
('admin', 'Allows you to create and query values, but cannot delete anything.'),
('creator', 'This role only allows you to create queries.'),
('consultor', 'Only allows you to query values, but not to create them.');

INSERT INTO credentials (
  name,
  username,
  password_hash,
  access_key_hash,
  active,
  valid_from,
  expires_at,
  role_id,
  notes
)
VALUES
(
  'root',
  'stlsg_routines_root',
  'sk_',
  encode(digest(gen_random_bytes(32), 'sha1'), 'hex'),
  TRUE,
  NOW(),
  NOW() + INTERVAL '2 years',
  2,
  'Acceso completo para administración del sistema'
);
