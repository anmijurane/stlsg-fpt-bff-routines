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
  'developer',
  'stlsg_developer_anmi',
  'sk_',
  'eadc3b185a0920b8d211048b646b687d7f1005df',
  TRUE,
  NOW(),
  NOW() + INTERVAL '2 years',
  2,
  'Acceso completo para administración del sistema'
),
(
  'fpt-routines-site-ssr',
  'fpt-routines-site',
  '',
  '',
  TRUE,
  NOW(),
  NOW() + INTERVAL '2 years',
  3,
  'Solo permite crear registros, no consultar'
),
(
  'fpt-power-bi',
  'fpt-power-bi',
  '',
  '',
  TRUE,
  NOW(),
  NOW() + INTERVAL '1 year',
  4,
  'Acceso únicamente de lectura'
);
