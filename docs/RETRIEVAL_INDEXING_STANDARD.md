# Retrieval and indexing standard

## Goal
Make every stored passage easy to find while preserving its exact source, edition, location, rights status, and confidence. Retrieval must never collapse spiritual, scientific, clinical, or interpretive sources into one evidence class.

## Canonical record shape
Every source is a distinct bibliographic record. Every chunk should carry:
- `source_id`, canonical title, author/teacher, work, edition, language, source type and domain;
- stable `chunk_id`, page/chapter/section or lesson timestamp;
- original source URL or stored-file reference, rights/license status;
- extraction method (`pdf_text`, OCR engine/version, transcript, manual);
- review status and quality indicators;
- epistemic layer: spiritual_text, empirical_research, clinical_guideline, therapeutic_method, interpretive_tradition, or synthesis;
- topic tags and concept aliases;
- embedding model/version and vector ID when embedded;
- content hash and ingestion timestamps.

Never infer one stage from another. Catalogued, stored, extracted, chunked, tagged, embedded, and retrieval_verified are separate states.

## Retrieval facets
Use multiple independent facets rather than one category:
1. Source/domain: Torah, Kabbalah, Hasidut, psychology, psychiatry, neuroscience, philosophy, other.
2. Epistemic layer: spiritual/textual, empirical, clinical, therapeutic, interpretive, synthesis.
3. Topic/concept: e.g. tzimtzum, sefirot, partzufim, emotion, attachment, trauma, habits, self-worth.
4. User context: expressed emotion, current difficulty, life domain, goal, and requested perspective. Treat inferred emotions as tentative search hints only.
5. Provenance and quality: edition, page, extraction method, review status, confidence, rights.

## Query path
1. Build a compact Hebrew/English query from the current message and relevant conversation context.
2. Use lexical retrieval for exact terms, names, quotations, and bibliographic terms.
3. Use semantic Vectorize retrieval for conceptual matches.
4. Merge and deduplicate by canonical chunk ID; do not merge distinct editions.
5. Hydrate only the exact returned IDs from D1 using a bounded `IN (...)` query against an indexed key.
6. Rerank for topical relevance, source quality, epistemic layer, and diversity. Prefer a small set of distinct passages over many adjacent chunks.
7. Give the model source text with explicit labels for domain, evidence type, author, work, edition, and locator.
8. Return only citations to passages actually retrieved and used. If hydration fails, say that source retrieval failed; do not invent a citation.

## D1 efficiency rules
- Never run whole-library `SELECT *` scans on the chat path.
- Never run repeated full-text alias joins as an unbounded background task.
- Process ingestion in small deterministic batches with a durable cursor/checkpoint.
- Make each batch idempotent; store an explicit processing status and embedding model version.
- Update one chunk by a verified indexed/primary key.
- Keep chat retrieval to the top 5–8 vector IDs and exact hydration only.
- Record rows read, returned, written, latency, and failure counts per ingestion job.
- Warn before quota exhaustion. Do not upgrade billing automatically.

## OCR and source quality
OCR-derived passages must carry their OCR method and `needs_review=true`. Low-text or diagram-heavy pages may be retained for provenance but excluded from ordinary text search. Exact quotations from OCR require checking the page image. Never silently replace the original PDF text or claim OCR is verified.

## Current local Yad Eliyahu index snapshot — 2026-11-19
- Original PDF: 398 pages.
- Native PDF text extraction: 377 page chunks.
- Hebrew OCR supplements: 21 pages; all flagged for review.
- Total page-level chunks: 398.
- FTS5 searchable chunks: 393.
- Five short-text pages excluded from FTS: native pages 352, 365, 385; OCR pages 386, 387.
- Four OCR pages have fewer than 500 characters (371, 379, 386, 387); all remain flagged for review.
- Curated lexical topic facets are present for concepts such as צמצום, ספירות, עולמות, פרצופים, נקודים/שבירה/תיקון, נשמה/נפש, תפילה/כוונות, זוהר, שבת/מועדים, מצוות/מנהגים, and גלגול.
- Local FTS smoke tests passed for צמצום, ספירות, ארי, אבא אמא, נקודים, and זוהר.
- This local index is not synced to Cloudflare and is not yet used by the live chat.

## Identifier mismatch — do not guess
The local library uses source ID `yad_eliyahu` and chunk IDs like `ye-p343-c327`. Previously observed Cloudflare Vectorize metadata used IDs like `yad-eliahu-p343`. These are not interchangeable. After D1 quota reset, build and verify an explicit crosswalk using the authoritative D1 row and content hash/page locator. Do not map by page number alone.

## Reproducibility
Run `python scripts/rebuild_local_index.py /path/to/SOULMATE_SMALL_LIBRARY` after placing `metadata/ocr_missing_pages.json` beside the original source files. The script rebuilds SQLite FTS5 and writes an audit report. It does not upload or mutate Cloudflare resources.
