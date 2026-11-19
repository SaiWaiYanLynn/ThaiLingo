-- Feedback reports sent from the app.
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phrase_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('wrong_translation', 'wrong_romanization', 'other')),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 500),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback (status, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_ip ON feedback (ip_hash, created_at);
