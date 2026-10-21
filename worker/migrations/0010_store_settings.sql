CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  store_name TEXT NOT NULL DEFAULT 'Serein',
  support_email TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  street_address TEXT NOT NULL DEFAULT '',
  shipping_rate_cents INTEGER NOT NULL DEFAULT 0,
  free_shipping_threshold_cents INTEGER NOT NULL DEFAULT 0,
  display_tax_rate_basis_points INTEGER NOT NULL DEFAULT 0,
  transactional_from_email TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO store_settings (id) VALUES (1);
