# SOULMATE knowledge retrieval engine

## Purpose
The retrieval engine reads existing knowledge from Cloudflare D1. It is not an ingestion writer and does not require adding book rows manually during a conversation.

Implementation:
- `src/knowledge-retrieval.ts` — bounded semantic + lexical retrieval.
- `src/soulmate-engine.ts` — the conversation engine now calls the retrieval module and passes verified passages into its model context.

## Query flow
1. Build the query from the user's current message and relevant conversation context.
2. If a `VECTORIZE` binding exists, embed the query with `@cf/google/embeddinggemma-2` and request at most 7 nearest neighbors.
3. Independently search the D1 FTS5 virtual table `wisdom_chunks_fts` using tokenized, quoted terms. This is a bounded indexed search, not a whole-library scan.
4. Merge and deduplicate semantic and lexical chunk IDs.
5. Hydrate only those IDs through `wisdom_library_retrieval_v2` using a bounded `IN (...)` query.
6. Return content with source, author, title, edition, section/page locator, rights status, ingestion status, and retrieval method.
7. If Vectorize is unavailable, lexical D1 retrieval still works. If D1 hydration fails, no citation is fabricated.

## Worker binding
The deployed Worker currently has D1 and Workers AI bindings. Semantic search additionally requires a Vectorize binding named `VECTORIZE` pointing to `chokhmat-yisrael`. Until that binding exists, the engine uses the D1 FTS5 path.

## Safety and cost
- No schema migration is required by this retrieval module.
- No source/chunk rows are written or modified.
- No R2 activation, billing change, or deployment is performed by this code change.
- D1 reads are bounded: one FTS query and one hydration query per user turn, each limited to a small top-K set.
- The module never uses `SELECT *` or an unbounded corpus scan.
- A source is only cited when the exact chunk was hydrated from D1.

## Verification still required
- Run TypeScript build/unit tests in the repository's actual build environment.
- Bind Vectorize to the Worker.
- Integrate the conversation engine into the deployed `/api/chat` route.
- Run end-to-end tests for Hebrew lexical queries, semantic queries, missing results, and provenance/page citations.
- Deploy only after the separate production-change approval and rollback checks.

The code in this branch is an implementation change, not proof that the production Worker already uses it.
