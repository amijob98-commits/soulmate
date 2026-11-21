# Source Ingestion Register

This is a status register, not proof of successful ingestion. Update statuses only after verifying the corresponding storage and retrieval steps.

| Source / ID | Current known state | Required next verification |
|---|---|---|
| יד אליהו – מפתח אנציקלופדיה לקבלת האר״י ז״ל (`yad-eliahu`) | User-uploaded 397-page PDF; designated for SOULMATE; ingestion not verified | Confirm source file availability, lawful processing, stored source record, page-level chunks, vector coverage, retrieval |
| תניא — ליקוטי אמרים (`tanya-likutei-amarim`) | Source ID previously noted | Verify metadata, rights, chunks, vectors, retrieval |
| תניא — שער היחוד (`tanya-shaar-hayichud`) | Source ID previously noted | Verify metadata, rights, chunks, vectors, retrieval |
| מסילת ישרים (`ramchal-mesilat-yesharim`) | Source ID previously noted | Verify edition, metadata, rights, chunks, vectors, retrieval |
| מפתח השמות (`abulafia-mafteach-hashemot`) | Source ID previously noted | Verify bibliographic identity, edition, rights, chunks, vectors, retrieval |
| גן נעול (`abulafia-gan-naul`) | Source ID previously noted | Verify bibliographic identity, edition, rights, chunks, vectors, retrieval |
| ספר יצירה — פירוש הרמב״ן (`sefer-yetzirah-ramban-commentary`) | Source ID previously noted | Verify edition, metadata, rights, chunks, vectors, retrieval |
| ספר יצירה — נוסח/פירוש הגר״א (`sefer-yetzirah-gra-version`) | Source ID previously noted | Verify edition, metadata, rights, chunks, vectors, retrieval |

## Last known aggregate database counts (2026-11-19)
- Sources: 73
- Chunks: 1,776
- Concepts: 18
- Topics: 43
- Topic aliases: 374
- Chunk-topic mappings: 3,522

These are historical counts from the last successful D1 read. They are not a current live check and do not prove every source is complete or retrievable.

## Status vocabulary
- `not_catalogued`: no verified source record.
- `catalogued`: metadata record exists.
- `file_stored`: source bytes are stored in the authoritative location.
- `extracted`: text extraction completed.
- `chunked`: chunks with provenance/page locators exist.
- `embedded`: vectors created.
- `retrieval_verified`: a query returned the correct content and source locator.
- `blocked_rights`: rights do not permit the planned ingestion.
- `blocked_access`: source or service access unavailable.

## Active acquisition plan — 21 source families

This is the working scope agreed with the user. A family is not a single book; each title, volume, edition, recording, and article must receive its own source record. This list is a discovery queue, not a claim that any item has been downloaded.

1. Rabbi Yitzchak Ginsburgh — complete bibliography and authorized recordings.
2. Rabbi Abraham Abulafia — complete corpus, manuscripts, editions, and commentaries distinguished.
3. Ramchal — complete corpus, letters, and editions.
4. ליקוטי מוהר״ן — both parts, editions, and related writings as separately identified.
5. Tanya — all parts and related works, edition by edition.
6. Baal HaSulam — complete writings, essays, letters, Zohar commentary, and editions.
7. דגל מחנה אפרים — source text and edition.
8. חובות הלבבות — source text, translations, and editions.
9. רב סעדיה גאון — all identified writings, including Geniza fragments and scholarly editions.
10. קדושת לוי — source text and editions.
11. Rabbi Moshe David Valle (רמ״ד ואלי) — verified corpus and editions.
12. "רבי שלמה דוד ואלי" — identity/title requires clarification; do not merge with Rabbi Moshe David Valle without verification.
13. מנחת יהודה — author and exact work require identification before acquisition.
14. Rabbi Asher Eliyahu Garlitz — נקודת אמת, original lessons, texts, and authorized materials.
15. Rabbi Yuval HaCohen Asherov — בסוד הדברים / עין הבדולח, books and lessons.
16. Baal Shem Tov — primary teachings and textual witnesses for תורת המראות.
17. כתר שם טוב — all parts and editions.
18. Baal Shem Tov — all books, stories, sayings, customs, and attributed teachings, with source criticism and provenance.
19. The Ari / Rabbi Isaac Luria — all writings and traditions, distinguishing the Ari, Rabbi Chaim Vital, Rabbi Shmuel Vital, editors, and later compilations.
20. "הרב קרליבך — עץ חיים" — exact person/work/edition requires clarification; do not acquire a guessed item.
21. Rabbi Yoram Avargel and Rabbi Israel Avargel / המאיר לארץ — books, series, authorized video lessons, including עולם המחשבה and המוח כקודש הקודשים.

## First located source — catalogued, not yet downloaded to repository

### ramchal-mesilat-yesharim-wikisource
- Canonical title: מסילת ישרים (שלם)
- Author: רבי משה חיים לוצאטו (הרמח״ל)
- Source page: https://he.wikisource.org/wiki/מסילת_ישרים_(שלם)
- Source edition/content: Hebrew full text, arranged as one complete page; page itself says the version is unchecked.
- Digital page license: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0), as shown in the page footer. Preserve attribution and share-alike obligations for derivatives.
- Original work: first printed Amsterdam 1740, according to the Wikisource book page.
- Bibliographic / chapter structure: introduction, 26 chapters, and closing section; verify against a critical printed edition before treating this digital text as canonical.
- Acquisition status: catalogued / blocked_access for direct file export in this session. The Wikisource page was opened and its license and structure inspected. PDF export was attempted but the export service denied access; no PDF or source file was saved to this repository. Do not mark file_stored, extracted, chunked, embedded, or retrieval_verified.
- Initial subject tags (provisional, to be refined chapter by chapter): purpose, self-knowledge, vigilance, diligence, cleanliness of conduct, restraint, purity, piety, humility, fear/awe, holiness, habit formation, self-observation, reflection, motivation.
- Next steps: obtain a lawful machine-readable export or authorized source copy; verify text against a reliable edition; preserve chapter locators; then extract, chunk, tag, embed, and test retrieval.
- License reference: https://creativecommons.org/licenses/by-sa/4.0/

## Retrieval-oriented topic taxonomy

Every source chunk should be indexed by multiple facets. Do not classify a passage by only one emotion or one school.

### Emotional states
anger, sadness, grief, fear, anxiety, shame, guilt, loneliness, jealousy, envy, joy, love, compassion, disgust, frustration, helplessness, hope, gratitude, longing, calm, overwhelm.

### Inner beliefs and self-perception
self-worth, identity, inner narrative, limiting beliefs, assumptions, interpretation, self-criticism, perfectionism, responsibility, agency, trust, meaning, purpose.

### Patterns and behavior
avoidance, procrastination, impulsivity, compulsive behavior, addiction, reinforcement, habits, emotional regulation, conflict patterns, attachment patterns, people-pleasing, anger responses, withdrawal, rumination, decision-making.

### Relationships and life context
parent-child, couple relationships, family, friendship, community, work, authority, boundaries, loss, transition, aging, parenting, fertility, illness, trauma, stress, sleep.

### Assessment and observation — preserve epistemic boundaries
- clinical_assessment: validated clinical assessment or diagnosis, with professional context and limitations.
- psychological_construct: research-based psychological concept, not itself a diagnosis.
- spiritual_self_observation: reflection categories from Torah, Kabbalah, Hasidut, or another spiritual tradition.
- traditional_interpretive_observation: palmistry, face reading, iridology, tongue observation, or astrology; never present as validated diagnosis.
- method_exercise: an exercise or process described by a named therapeutic/spiritual method.
- evidence_review: empirical research, systematic review, guideline, or professional consensus.

### Source and locator facets
tradition, author, work, edition, language, publisher, year, volume, chapter, page, lesson/video timestamp, source URL, license, evidence status, ingestion status, and confidence.

## Acquisition and ingestion status rule
A source moves through the following independently verified statuses:
discovered → rights_checked → catalogued → file_stored → extracted → chunked → tagged → embedded → retrieval_verified.
A blocked or unavailable source remains visibly blocked with a reason and next action. Never infer a later stage from an earlier one.

