# SOULMATE AMI — Roadmap

## Phase 0 — Establish a trustworthy project record
- [x] Establish canonical repository and project separation.
- [x] Record known principles, architecture, source policy, and verified infrastructure state.
- [ ] Inventory every existing repository file and reconcile it with this documentation.
- [ ] Establish a single index/catalog linking repository documentation, D1 records, Vectorize index, and source files.

## Phase 1 — Verify knowledge pipeline
- [ ] After D1 quota reset, verify source/chunk/topic records and inspect representative rows.
- [ ] Verify Vectorize metadata and vector coverage against D1 source/chunk IDs.
- [ ] Verify ingestion job status and failure handling.
- [ ] Verify page/section provenance survives extraction, chunking, embedding, and retrieval.
- [ ] Add repeatable ingestion tests and a source-level audit report.

## Phase 2 — Integrate RAG into the live Worker
- [ ] Implement query embedding using the configured embedding model.
- [ ] Retrieve relevant vectors and hydrate chunk text + source metadata from D1.
- [ ] Add keyword/full-text fallback and deduplication.
- [ ] Pass retrieved passages to the chat model with explicit citation instructions.
- [ ] Return source citations/locators in the API response.
- [ ] Test end-to-end against known source questions before claiming the agent uses the library.

## Phase 3 — Build the person model and memory responsibly
- [ ] Define memory types, provenance, confidence, timestamps, and user correction/deletion flows.
- [ ] Separate user facts, hypotheses, preferences, goals, and transient conversation context.
- [ ] Retrieve only relevant memories and expose uncertainty.
- [ ] Test continuity across sessions and prevent unrelated-project memory contamination.

## Phase 4 — Build synthesis and evaluation
- [ ] Compare sources and expose agreement/conflict.
- [ ] Generate cautious hypotheses and useful questions.
- [ ] Evaluate relevance, citation accuracy, unsupported claims, safety, and action usefulness.
- [ ] Add regression suites for recurring human patterns and root-cause exploration.

## Phase 5 — Expand parallel libraries
- [ ] Psychology / psychiatry / trauma / body memory.
- [ ] Jewish wisdom / Kabbalah / Hasidut.
- [ ] Palmistry.
- [ ] Face reading.
- [ ] Iridology (historical only; no diagnostic claims).
- [ ] TCM tongue observation (traditional interpretive use only).
- [ ] Kabbalistic astrology.

## Operating rule
Work in coherent batches and keep the repository record current. Do not stop after every individual book to request permission for the next routine cataloguing/ingestion step. Stop for rights uncertainty, paid services, destructive actions, or production changes requiring approval.
