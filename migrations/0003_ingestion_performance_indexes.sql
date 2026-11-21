-- SOULMATE ingestion performance indexes.
-- Safe additive indexes only; apply to a staging database first and measure query plans.
-- These indexes target the repeated embedding backlog scans observed in D1 Insights.

-- Supports the pending-embedding scan and deterministic source/chunk ordering.
CREATE INDEX IF NOT EXISTS idx_wisdom_chunks_embedding_source_chunk
  ON wisdom_chunks(embedding_ref, source_id, chunk_id);

-- Supports the source-specific pending-embedding scan without indexing already embedded rows.
CREATE INDEX IF NOT EXISTS idx_wisdom_chunks_pending_source_chunk
  ON wisdom_chunks(source_id, chunk_id)
  WHERE embedding_ref IS NULL;

-- Supports exact chunk-ID hydration/updates if chunk_id is not already covered by a primary key.
-- SQLite permits this duplicate index, but we intentionally omit it until schema confirms PK status.
