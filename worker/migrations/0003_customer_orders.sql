ALTER TABLE orders ADD COLUMN customer_uid TEXT;
ALTER TABLE orders ADD COLUMN fulfillment_status TEXT NOT NULL DEFAULT 'received';
ALTER TABLE orders ADD COLUMN tracking_carrier TEXT;
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN tracking_url TEXT;
ALTER TABLE orders ADD COLUMN fulfillment_updated_at TEXT;
CREATE INDEX IF NOT EXISTS orders_customer_uid ON orders(customer_uid, created_at DESC);
