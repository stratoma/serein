CREATE TABLE IF NOT EXISTS orders (
  session_id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  items TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT
);
