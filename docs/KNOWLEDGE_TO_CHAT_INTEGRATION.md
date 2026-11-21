# Knowledge-to-chat integration — execution checkpoint

Date: 2026-11-19
Project: SOULMATE AMI
Target runtime: Cloudflare Worker `soulmate-app`

## Desired live behavior

For each authenticated chat turn:
1. Preserve the existing user/session authentication and conversation history.
2. Detect emotional signals as tentative retrieval hints only (never diagnosis).
3. Embed a compact query with `@cf/google/embeddinggemma-2`.
4. Query the existing 768-dimensional Vectorize index `chokhmat-yisrael`.
5. Hydrate the exact returned chunk IDs from the authoritative D1 retrieval view, preserving source title and page/section locator.
6. Pass retrieved passages to the conversation model with explicit source-domain distinctions.
7. Return source references actually used by the model; never fabricate citations.
8. Persist dialogue state in the existing `conversations.state_json` field. Do not create long-term personal memories implicitly.

## Verified infrastructure

- Worker: `soulmate-app`, `https://soulmate-app.china2sell.workers.dev/`
- Existing live Worker bindings: `AI`, `DB`; no `VECTORIZE` binding.
- Vectorize index: `chokhmat-yisrael`, 768 dimensions, cosine; 1,777 vectors at last verified inspection.
- A direct embedding + Vectorize query returned relevant Hebrew source IDs and locators.
- D1 has `wisdom_chunks` and views including `wisdom_library_retrieval_v2`; exact projection columns and ID compatibility still need a minimal fresh verification.
- D1 daily row-read quota was exceeded on 2026-11-19. Avoid D1 reads until reset; no plan upgrade without approval.

## Code already present on feature branch

- `src/soulmate-engine.ts`: emotion-aware query construction, embedding, Vectorize query, D1 hydration, dialogue strategy and source-aware generation.
- `src/worker-chat-integration.ts`: authenticated-route adapter preserving the existing conversation state contract.
- `migrations/0003_ingestion_performance_indexes.sql`: proposed ingestion scan indexes; unrelated to live RAG activation and not applied.
- PR: https://github.com/beeberr/soulmate/pull/1

## Remaining blockers before production activation

1. **D1 schema contract:** after quota reset, inspect `PRAGMA table_info(wisdom_library_retrieval_v2)` (or the underlying view SQL) and one known chunk ID. Confirm the view returns the exact Vectorize IDs and content/provenance fields expected by the engine. Keep this to minimal reads.
2. **Type/build/tests:** repository currently has no verified package/build configuration in this branch; establish the actual project build path and run typecheck plus deterministic tests for retrieval mapping, empty matches, D1 errors, invalid model JSON, and citations.
3. **Worker integration:** bundle the engine into the actual module Worker and replace only the existing authenticated `/api/chat` model call with the adapter. Preserve auth, register/login/logout/state/reset routes and response compatibility.
4. **Binding:** configure the existing Vectorize index as Worker binding `VECTORIZE`. The binding is currently absent.
5. **Staging/E2E:** test an authenticated question whose answer is present in a known indexed source; verify the returned answer, source title, and page/section locator. Also test no-match and retrieval failure behavior.
6. **Production release:** only after the preceding gates pass, deploy the Worker and verify the live chat response. Preserve a rollback copy of the currently live Worker script.

## Safety and cost boundaries

- No production Worker code or binding has been changed in this work session.
- No D1 migration or data mutation has been applied.
- No Vectorize vectors have been changed.
- No R2 activation, plan upgrade, or billing change has been made.
- Do not call the system "connected" until an end-to-end authenticated live chat test retrieves and uses a real source passage.

## Exact next action

After the D1 quota reset, perform only the minimal view/schema and known-ID lookup. Then complete type/build tests and wire the Worker on a staging target if one exists. If no staging Worker exists, prepare the reviewed production change and request explicit release approval before changing the live Worker.


## Live API spot-check after release approval

- Re-ran a Workers AI embedding request for a Hebrew query using the existing model; it returned a 768-dimensional vector.
- Queried the existing Vectorize index through the Cloudflare API; it returned relevant matches.
- The match metadata contains only `chunk_id`, `source_id`, and `locator` (no passage text). Therefore D1 hydration is mandatory; metadata-only retrieval cannot ground a chat answer.
- Example match: `abulafia-or-hasekhel-003`, locator `הקדמת המחבר · מקטע 3`.
- The D1 daily read quota is still in its blocked period during this verification. The D1 view's exact columns and matching ID therefore remain unverified.
- No staging Worker was identified in the verified deployment inventory; the only confirmed Worker is the production `soulmate-app`.

## Release decision after user approval

The user explicitly approved production integration and deployment once checks pass. This approval is recorded. It does not waive the technical release gates above. Do not upload a Worker build with unverified D1 SQL or without an end-to-end chat test. Current production Worker still has only `AI` and `DB` bindings and the existing chat path is unchanged.


## Local source index improvement — 2026-11-19

- The user-provided Yad Eliyahu PDF has a local rebuilt index: 398 page-level chunks, 393 FTS5-searchable chunks, 21 OCR supplements flagged for review.
- OCR-derived text is never treated as manually verified. Five short-text pages are excluded from FTS.
- The local SQLite index is a separate artifact; no D1 or Vectorize writes were made.
- Important: local source/chunk identifiers differ from the identifiers previously observed in Vectorize. The local package uses `yad_eliyahu` / `ye-p{page}-c{sequence}`; Vectorize returned `yad-eliahu-p{page}`. Build an explicit, content-verified crosswalk after the D1 quota reset. Do not guess the mapping by page number.
- Reproducible indexing procedure is in `scripts/rebuild_local_index.py`; architecture and metadata rules are in `docs/RETRIEVAL_INDEXING_STANDARD.md`.
