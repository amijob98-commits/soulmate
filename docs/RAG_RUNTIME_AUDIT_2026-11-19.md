# SOULMATE RAG runtime audit — 2026-11-19

## Scope
Read-only inspection of the live Cloudflare resources and a code-only feature branch. No production Worker, D1 schema/data, Vectorize vectors, or billing configuration was changed.

## Live resources verified
- Account: `China2sell` (`281747cd292454cf0b07b281c2c8a2cf`).
- D1: `soulmate-prod`, UUID `27f7f3af-3d75-413e-a5b8-c5835c7e7421`; 31 tables; reported database size 37,158,912 bytes.
- Vectorize: `chokhmat-yisrael`; 768 dimensions, cosine metric; **1,777 vectors**. Last mutation processed at `2026-11-19T16:56:36.314Z`.
- Existing Vectorize test: embedded a Hebrew query with `@cf/google/embeddinggemma-2` (768 dimensions), queried Vectorize successfully, and received five matches with source metadata and locators. Returned examples included:
  - `yad-eliahu-p343` — `PDF עמ׳ 343`
  - `yad-eliahu-p42` — `PDF עמ׳ 42`
  - `mesilat-yesharim-063` — chapter/segment locator
  - `abulafia-or-hasekhel-020` — section/segment locator
- This confirms semantic vector search is functioning and that the index contains material beyond the Yad Eliyahu PDF.

## Live Worker integration state
- Worker: `soulmate-app`.
- Live bindings verified: `AI` and `DB` only. No Vectorize binding is currently configured.
- Live `/api/chat` code was inspected. It still calls the chat model directly with the last 16 messages. It does not run emotion classification, embedding, Vectorize retrieval, D1 chunk hydration, or source citation construction.
- Therefore the live chat is **not yet using the existing semantic index**.

## Resource warning
- D1 database metadata read reports 37,158,912 bytes and 31 tables. This is not, by itself, evidence that storage is near a limit.
- Project records document that the D1 Free-tier daily row-read quota was exceeded on 2026-11-19. Do not repeatedly query D1 until quota reset, and do not upgrade or enable billing without explicit user approval.
- R2 remains disabled per the prior verified system-state record. No attempt was made to enable it.

## Code work started
Branch: `feature/emotion-aware-rag`.

Updated `src/soulmate-engine.ts` to add:
1. A structured emotional-signal pass (emotions, intensity, tentative needs, retrieval query, confidence), explicitly for retrieval and not as diagnosis.
2. A semantic retrieval path using the existing embedding model and an optional Vectorize binding.
3. D1 hydration by returned vector IDs, retaining source and locator fields.
4. Keyword retrieval as a fallback, with no fabricated citations when no verified passages are returned.

Commits:
- `16dd0bee1fe261592ca27b1b47370eec833338f6`
- `c97294d393e8cd3e4bd84374d4fe6779af1b3f1d`

## Critical integration mismatch still to resolve
The current implementation work package queries the proposed `knowledge_chunks` table. The live Vectorize index demonstrably contains IDs such as `yad-eliahu-p343`, `mesilat-yesharim-063`, and `abulafia-or-hasekhel-020`, while the existing project architecture and historical inventory refer to `wisdom_chunks` and `wisdom_library_retrieval_v2`.

The D1 row-read quota prevented a fresh schema inspection in this session. The code now targets `wisdom_library_retrieval_v2` using the `chunk_id` locator, but this exact column name and the view's content/provenance field names remain unverified. Confirm them with a minimal schema/row read after quota reset before enabling the route.

## Verification status
- Vectorize query path: verified live, read-only.
- Embedding model: verified live, returns 768 dimensions.
- Emotion classifier: code added, not yet executed in Worker.
- New engine TypeScript: not typechecked or unit-tested in this session.
- D1 hydration: not verified; schema mapping is a known blocker.
- Worker Vectorize binding: not configured in the live Worker; the adapter expects a binding named `VECTORIZE`.
- An authenticated `/api/chat` adapter has been added in `src/worker-chat-integration.ts`; it preserves the existing `conversations.state_json` contract. It has not yet replaced the inline route in the live Worker.
- Production deployment: not performed.

## Next engineering action
After the D1 quota resets, inspect only the minimum schema/representative rows needed to confirm `wisdom_library_retrieval_v2` columns and the chunk-ID mapping. Then configure `VECTORIZE` on a staging/test Worker, run typecheck/unit tests and a full emotion → embedding → Vectorize → D1 → cited-chat test, and only then prepare a reviewed production integration. Keep a health check for D1 row-read quota, database size, Vectorize vector count, and ingestion/retrieval failures so warnings occur before limits are reached.


## D1 expensive-query follow-up — 2026-11-19

A fresh read of the D1 Insights top-query endpoint (read-only; no D1 SQL query executed) identified these high-cost statements in the rolling 24-hour window returned by Cloudflare:

1. Topic alias backfill:
   `INSERT OR IGNORE INTO wisdom_chunk_topics ... SELECT ... FROM wisdom_chunks c JOIN wisdom_topic_aliases a ON instr(lower(c.content),lower(a.alias))>0`
   - estimated 255,990 rows read in one execution;
   - 10,275 rows written;
   - ~4.85 seconds average duration.
   This is the largest single statement in the sampled top-query list. It performs substring matching across chunk content and aliases. A normal B-tree index on alias/content will not make the `instr(lower(content), lower(alias))` join selective.

2. General embedding backlog scan:
   `SELECT ... FROM wisdom_chunks WHERE embedding_ref!='chokhmat-yisrael-v2' OR embedding_ref IS NULL ORDER BY source_id,chunk_id LIMIT ?`
   - estimated 224,225 rows read across 179 executions;
   - 1,416 rows returned.

3. Psychology-specific embedding backlog scan:
   `SELECT ... FROM wisdom_chunks WHERE source_id='psychology-2e' AND embedding_ref IS NULL ORDER BY chunk_id LIMIT ?`
   - estimated 72,602 rows read across 110 executions;
   - 784 rows returned.

4. Repeated point updates:
   multiple statements updating `embedding_ref` by `chunk_id` show 21–27 executions each and estimated 32,940–37,170 rows read per statement family. The schema/index plan must be inspected to confirm why a chunk-ID update is not selective; do not assume the primary-key/index definition without schema evidence.

Important interpretation:
- Insights figures are estimates based on sampled per-statement data. They are not an exhaustive decomposition of the 6,321,165 daily total.
- The top-query endpoint returns query templates ranked by estimated usage. The total database rows-read metric is a separate account/database aggregate.
- The earlier claim that the psychology backlog alone explained the main usage was incomplete; the alias backfill and general embedding scans are also significant.

## Code change prepared (not applied to production)

Added `migrations/0003_ingestion_performance_indexes.sql` on the feature branch:
- composite index on `(embedding_ref, source_id, chunk_id)`;
- partial index on `(source_id, chunk_id)` for rows with `embedding_ref IS NULL`.

These indexes are intended to reduce repeated pending-embedding scans. They have **not** been applied to D1 and their query-plan benefit has not been verified. The alias substring join is not fixed by these indexes and needs a bounded/incremental redesign (likely chunk-batched processing with a durable cursor and idempotent inserts), after inspecting the ingestion implementation and FTS/schema details.

## Required next verification
- After D1 quota reset, inspect only `PRAGMA table_info(wisdom_chunks)`, relevant index definitions, and `EXPLAIN QUERY PLAN` for the three statements above.
- Locate/restore the exact ingestion/backfill runner responsible for the alias join and embedding scans; do not guess a new runner.
- Test the new indexes and a bounded alias-backfill implementation on a staging copy; compare rows read, rows returned, execution count, and elapsed time.
- Do not apply migrations or modify the production Worker until staging verification and explicit deployment approval.
