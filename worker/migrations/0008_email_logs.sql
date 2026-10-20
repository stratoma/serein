CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_id TEXT,
  order_session_id TEXT,
  sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_type_status ON email_logs(email_type, status);

INSERT OR IGNORE INTO email_logs (id, recipient, subject, email_type, status, provider_id, order_session_id, sent_at)
SELECT
  'legacy-' || confirmation_email_id,
  customer_email,
  'Order confirmation',
  'order_confirmation',
  'sent',
  confirmation_email_id,
  session_id,
  COALESCE(confirmation_email_sent_at, created_at)
FROM orders
WHERE confirmation_email_id IS NOT NULL
  AND customer_email IS NOT NULL
  AND TRIM(customer_email) != '';
