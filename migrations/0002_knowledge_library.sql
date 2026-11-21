-- SOULMATE knowledge library.
-- Only reviewed/verified material can be retrieved by the live conversation engine.
-- Store short, source-grounded knowledge chunks, not whole copyrighted books/articles.

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL CHECK (domain IN (
    'torah','kabbalah','jewish_thought','psychology','psychiatry',
    'neuroscience','philosophy','other'
  )),
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_locator TEXT,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '',
  reliability TEXT NOT NULL DEFAULT 'reviewed',
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','rejected')),
  priority INTEGER NOT NULL DEFAULT 0,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0,1))
);

CREATE INDEX IF NOT EXISTS idx_knowledge_domain_status
  ON knowledge_chunks(domain, verification_status, enabled, priority);

-- Conversation state remains inside the existing conversations.state_json field.
-- This migration intentionally does not modify user accounts, sessions, or memories.
