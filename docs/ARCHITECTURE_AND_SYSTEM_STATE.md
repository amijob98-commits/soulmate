# Architecture and Verified System State

## Intended architecture
1. **Conversation experience** — natural, respectful dialogue with a blank opening canvas.
2. **Person model and memory** — explicit, reviewable information with provenance, confidence, dates, and the ability to correct it.
3. **Knowledge libraries** — separately organized collections with cross-links and clear source provenance.
4. **Retrieval (RAG)** — retrieve relevant passages with source and page/section locators before generation.
5. **Reasoning and synthesis** — compare sources, identify agreements and contradictions, formulate cautious hypotheses, and ask useful questions.
6. **Evaluation** — test retrieval accuracy, citation quality, safety, continuity, and whether responses help convert insight into action.

## Known infrastructure (last verified 2026-11-19)
- Cloudflare account label: `China2sell`.
- D1 database: `soulmate-prod`.
- D1 database UUID: `27f7f3af-3d75-413e-a5b8-c5835c7e7421`.
- Worker: `soulmate-app`.
- Worker URL: https://soulmate-app.china2sell.workers.dev/
- Vectorize index: `chokhmat-yisrael`, 768 dimensions, cosine similarity.
- Embedding model previously used: `@cf/google/embeddinggemma-2`.

## Verified D1 inventory (2026-11-19)
- `wisdom_sources`: 73
- `wisdom_chunks`: 1,776
- `wisdom_concepts`: 18
- `wisdom_topics`: 43
- `wisdom_topic_aliases`: 374
- `wisdom_chunk_topics`: 3,522

Known schema objects include:
`wisdom_sources`, `wisdom_chunks`, `wisdom_concepts`, `wisdom_relations`, `wisdom_ingestion_jobs`, `wisdom_library_config`, `wisdom_chunks_fts`, `wisdom_topics`, `wisdom_topic_aliases`, `wisdom_chunk_topics`, `wisdom_source_sections`, `wisdom_section_topics`, and views `wisdom_topic_search`, `wisdom_library_catalog`, `wisdom_library_retrieval`, `wisdom_library_retrieval_v2`. Application tables include users, sessions, conversations, memories, and `_cf_KV`.

## Important limitations — do not misrepresent
- On 2026-11-19 the D1 free-tier daily row-read quota was exceeded. Exact message: “Your account has exceeded D1's free tier daily row read limit. Upgrade to a paid plan or wait until tomorrow (midnight UTC) to continue.” Do not retry quota-consuming D1 reads until reset. Do not upgrade or incur costs without explicit approval.
- The existing Worker chat endpoint has NOT been verified as connected to D1/Vectorize RAG. Previous inspection indicated the chat endpoint used `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, the last 16 messages, max 700 tokens, temperature 0.55, and did not yet retrieve from the knowledge base.
- Therefore, never claim the live SOULMATE agent can retrieve or use the knowledge library until integration, deployment, and end-to-end retrieval tests pass.
- Database counts establish that records exist; they do not establish completeness, correctness, or retrievability.

## Required verification gates
- Read: retrieve a known source and a known chunk with provenance.
- Search: query by concept/topic and verify relevant results.
- Citation: verify source title plus page/section locator survives retrieval.
- Chat integration: ask a question answerable from a stored source and verify the answer cites the retrieved passage.
- Regression: test irrelevant queries, conflicting sources, missing sources, and hallucination resistance.


## Permanent source-file storage — implementation decision and current blocker

### Target architecture
- **Cloudflare R2** is the intended durable object store for original source files and processed derivatives. It is separate from GitHub, which remains the home for code, schemas, policies, and small manifests.
- **D1** remains the metadata/catalog layer: stable source IDs, bibliographic metadata, rights, checksums, object keys, processing states, topics, sections, and chunk locators.
- **Vectorize** remains the semantic retrieval index; it stores vectors/metadata, not the authoritative source files.
- **Worker ingestion pipeline** should register a source, validate rights and file type, store the original object, calculate checksum, extract text, preserve page/section locators, chunk, tag topics, embed, and record each state transition.
- Originals must be immutable/versioned by source edition; derived text/chunks must retain a pointer to the exact original and page/section.
- Use multipart/resumable uploads for large files; do not route large source files through a chat turn or a Worker request body.

### Verified blocker — 2026-11-19
A Cloudflare API attempt to list R2 buckets for account `281747cd292454cf0b07b281c2c8a2cf` returned HTTP 403, error 10042: **“Please enable R2 through the Cloudflare Dashboard.”** Therefore no R2 bucket has been created or verified in this work session, and no new source files have been uploaded to R2.

Cloudflare's current documentation says R2 requires adding an R2 subscription through the dashboard checkout flow. It has a monthly free allowance, but usage beyond that is billed. Current published standard storage rate is $0.015/GB-month, with Class A and B operation charges; verify current pricing before enabling. This project must not activate a paid/billable service or add billing without explicit user approval.

### Next required action
The account owner must enable/subscribe to R2 in the Cloudflare dashboard (or explicitly authorize the billing setup). After that, verify bucket listing, create a private bucket named for SOULMATE source archive, verify upload/download of a test object, then wire the Worker/D1 catalog pipeline. Until those checks pass, describe R2 as planned but unavailable, not as an existing archive.

### Existing local source artifact
The previously materialized PDF `יד_אליהו – מפתח אנציקלופדיה לקבלת האר״י ז״ל` exists only in the session's working container archive as previously recorded; it has not been verified in R2 or in the authoritative GitHub source archive. Do not claim it is durably stored in the new object store.
