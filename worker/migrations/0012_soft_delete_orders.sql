ALTER TABLE orders ADD COLUMN deleted_at TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_visible ON orders(status, deleted_at, created_at DESC);
