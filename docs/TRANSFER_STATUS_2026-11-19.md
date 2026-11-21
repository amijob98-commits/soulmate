# SOULMATE transfer status — 2026-11-19

This file records verified migration work and explicitly distinguishes completed copies from source material that is still external.

## GitHub repository inventory

Repository: https://github.com/beeberr/soulmate
Branch: `main`

The repository currently contains the project charter, architecture/state notes, decision rules, knowledge-source register, roadmap, ingestion register, and the implementation package committed under:
- `src/soulmate-engine.ts`
- `migrations/0002_knowledge_library.sql`
- `tests/conversation-evaluations.json`
- `docs/ENGINE_WORK_PACKAGE.md`

The original work ZIP was inspected and extracted. Its four implementation files plus manifest are represented in the repository. The original ZIP itself is still retained in the user's ChatGPT Library and was not added as a binary GitHub asset.

## D1 database export

Database: `soulmate-prod`
Database UUID: `27f7f3af-3d75-413e-a5b8-c5835c7e7421`
Cloudflare account: `China2sell`

A D1 export was successfully generated using D1-compatible SQL format with an explicit table allowlist to avoid the FTS5 virtual table that blocks a full unfiltered export.

Included tables:
`wisdom_sources`, `wisdom_chunks`, `wisdom_concepts`, `wisdom_relations`,
`wisdom_ingestion_jobs`, `wisdom_library_config`, `wisdom_topics`,
`wisdom_topic_aliases`, `wisdom_chunk_topics`, `wisdom_source_sections`,
`wisdom_section_topics`, `users`, `sessions`, `conversations`, `memories`.

Export filename:
`27f7f3af-3d75-413e-a5b8-c5835c7e7421-00000019-00000000-00005128-57cee31f5775c2ecf2a95503fdde04c5.sql`

Export bookmark:
`00000019-00000000-00005128-57cee31f5775c2ecf2a95503fdde04c5`

Cloudflare reported the export status as `complete`. The signed download URL is temporary (one hour) and the current connected tools could create the export but could not retrieve the R2 file bytes into the GitHub working tree. Therefore **the SQL backup is generated in Cloudflare export storage but is not yet committed to this repository**.

A separate unfiltered export attempt failed because D1 cannot export a database containing FTS5 virtual tables. The table-filtered D1-compatible export above completed. The virtual FTS table and SQL views are not included in the allowlist and must be recreated from schema/migrations, not treated as copied data.

The database remains in its existing Cloudflare account. No database was deleted, overwritten, renamed, or restored. No production migration was applied.

## PDF source inventory

One SOULMATE book PDF was located in the user's Library and materialized for inspection:

- Title: `יד אליהו – מפתח אנציקלופדיה לקבלת האר״י ז״ל`
- Author attribution in filename: אליהו דוד בן אהרן
- File: `יד_אליהו_•_מפתח_אנציקלופדיה_לקבלת_האר''י_ז''ל_•_אליהו_דוד_בן_אהרן.pdf`
- PDF page count reported by file inspection: 398
- Size: 19,359,365 bytes
- SHA-256: `df8fa7c82b8583a1d76a9a7b123f8a27e25f3aa217778e2f2199669453affe73`
- ChatGPT Library file ID: `file_00000000d6208243abf6e04859b0b2bc`

The PDF remains preserved in the user's Library. It has **not** been copied into this GitHub repository, indexed, chunked, embedded, or connected to runtime retrieval. The book's provenance and page references must be retained during any later ingestion. Rights status must be checked before redistributing or ingesting beyond permitted use.

The Library inventory also contained unrelated AGOR/DSA PDFs; they were not moved into SOULMATE because they are not SOULMATE sources.

## Runtime and safety boundary

The implementation package is a work package, not a deployed change. Its own manifest states:
- typecheck passed at package creation;
- tests were not executed;
- knowledge corpus not seeded;
- production not changed.

The existing Worker and D1/Vectorize runtime were not modified. No claim is made that the live `/api/chat` route uses the new engine or retrieves from the knowledge library.

## Remaining transfer blockers

1. Retrieve the completed SQL export bytes from Cloudflare's temporary R2 signed URL and commit the backup to a protected/private backup location; then verify file size and checksum.
2. Copy the 398-page PDF into the repository's supported large-file storage (or an explicitly linked durable object store), then verify byte-for-byte checksum.
3. Inventory every remaining SOULMATE source file and book in the user's Library and any source repositories; classify relevant versus unrelated assets.
4. Reconstruct omitted FTS5 virtual tables and views from authoritative schema definitions.
5. Verify the complete repository tree, source checksums, database export contents, and a restore procedure in a non-production target before calling the migration complete.

**Status: partial transfer only.** Documentation and the code work package are committed. D1 export generation is complete but its SQL bytes are not in this repository. The book PDF remains in the Library, not in this repository. No production state was changed.
