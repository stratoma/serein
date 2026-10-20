CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  stock INTEGER,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);
INSERT INTO products (id, name, amount) VALUES
  ('supple-oud', 'Supple Oud', 2200), ('mint-moss', 'Mint + Moss', 2200),
  ('lithe-bloom', 'Lithe Bloom', 2200), ('morrow-trio', 'The Morrow Trio', 1100);
ALTER TABLE orders ADD COLUMN customer_name TEXT;
ALTER TABLE orders ADD COLUMN customer_email TEXT;
-- The trigger and payment status update execute atomically. Negative stock records
-- shortages from simultaneous checkouts instead of silently losing a paid sale.
CREATE TRIGGER deduct_paid_inventory AFTER UPDATE OF status ON orders
WHEN NEW.status = 'paid' AND OLD.status != 'paid'
BEGIN
  UPDATE products SET stock = stock - COALESCE((SELECT SUM(CAST(json_extract(value, '$.quantity') AS INTEGER)) FROM json_each(NEW.items) WHERE json_extract(value, '$.id') = products.id), 0)
  WHERE stock IS NOT NULL AND id IN (SELECT json_extract(value, '$.id') FROM json_each(NEW.items));
END;
