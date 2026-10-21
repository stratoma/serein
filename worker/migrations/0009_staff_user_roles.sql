ALTER TABLE staff_users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin';

CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);
