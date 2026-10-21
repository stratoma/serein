CREATE TABLE IF NOT EXISTS market_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_events_event_date ON market_events(event_date);

INSERT OR IGNORE INTO market_events (id, name, location, event_date) VALUES
  ('market-lagos-handcraft-fair', 'Lagos Handcraft Fair', 'Victoria Island Community Centre', '2026-07-12'),
  ('market-makers-market', 'The Makers Market', 'Lekki Phase 1', '2026-08-02'),
  ('market-craft-co-popup', 'Craft & Co. Pop-Up', 'Ikoyi Arts Quarter', '2026-08-23');
