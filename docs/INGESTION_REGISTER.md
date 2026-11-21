# Source Ingestion Register

This is a status register, not proof of successful ingestion. Update statuses only after verifying the corresponding storage and retrieval steps.

| Source / ID | Current known state | Required next verification |
|---|---|---|
| יד אליהו – מפתח אנציקלופדיה לקבלת האר״י ז״ל (`yad-eliahu`) | User-uploaded 398-page PDF; local extraction/index verified: 377 native-text chunks + 21 Hebrew OCR supplements; 398 page chunks total, 393 searchable locally. OCR pages flagged for review. Cloud D1/Vectorize sync and chat retrieval are NOT verified. | Verify source ID/chunk-ID crosswalk against D1; sync in bounded batches; verify vector coverage and end-to-end chat retrieval |
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
21. Rabbi Yoram Avargel and Rabbi Israel Avargel / המאיר לארץ — books, series, authorized video lessons, including עולם המחשבה and המוח כקודש הקודשים. Video catalog discovery is recorded in `docs/VIDEO_SOURCE_INVENTORY_2026-11-20.md`; official עולם המחשבה category has 11 numbered lessons plus 2 supplements, and a distinct 11-video Pesach 5781 playlist was identified. Media download, transcripts, summaries, chunking, embeddings, and retrieval are still unverified.

## Additional acquisition lead — Tanya (2026-11-20)

- A National Library of Israel catalog record was identified for a complete Tanya volume: [NNL_ALEPH990022327690205171](https://www.nli.org.il/en/books/NNL_ALEPH990022327690205171/NLI).
- The record describes the work as including Likkutei Amarim, Shaar HaYichud VehaEmunah, Iggeret HaTeshuvah, Iggeret HaKodesh, and Kuntres Acharon.
- The NLI catalog explicitly labels the digitized item **Public Domain Free Use** and exposes PDF or JPEG/ZIP download options.
- Acquisition status remains **catalogued / rights_checked_pending_file_access**: the NLI item page returned HTTP 403 to the current web retrieval path. No scan was downloaded or stored in the repository in this pass. Do not mark file_stored, extracted, chunked, embedded, or retrieval_verified.
- Next step: obtain the NLI scan through an accessible authorized download route; preserve the NLI item identifier and its edition metadata, then inspect completeness/page sequence before extraction.

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



## Verified local index update — 2026-11-19

The local SOULMATE source package now contains a rebuilt Yad Eliyahu index. The original PDF has 398 pages. 377 pages had extractable PDF text; the remaining 21 pages received Hebrew OCR supplements. All OCR chunks are marked `needs_review`. There are 398 page-level chunks; 393 are included in local FTS5 search. Five short-text pages are retained for provenance but excluded from FTS (352, 365, 385, 386, 387). See `docs/RETRIEVAL_INDEXING_STANDARD.md` and the local archive's `metadata/index_audit.json`.

This is a local indexing improvement only. It has not been synced to D1/Vectorize. Local chunk IDs (e.g. `ye-p343-c327`) differ from previously observed Vectorize IDs (e.g. `yad-eliahu-p343`); an explicit D1 crosswalk is required before merging these records.


## Additional Tanya scan — HebrewBooks 49432 (2026-11-20)

- Source ID: `hebrewbooks-49432-tanya-likkutei-amarim-1956`.
- Canonical title: **לקוטי אמרים — תניא**; author: רבי שניאור זלמן מלאדי (אדמו״ר הזקן).
- Publisher/imprint shown in the scan: קה״ת / אוצר החסידים, Brooklyn.
- Bibliographic evidence: the title page and publication page identify the Tanya edition as 1956 / תשט״ז. The foreword says this edition is a photographic reproduction of the Vilna 1937 printing, with additions including the daily study schedule, indexes, corrections, and manuscript facsimiles.
- Contents visible in the scan include ספר של בינונים, שער היחוד והאמונה, אגרת התשובה, אגרת הקודש, קונטרס אחרון, מורה שיעור, indexes, and editorial notes.
- Original HebrewBooks page: https://hebrewbooks.org/pdfpager.aspx?req=49432&pgnum=1
- User-uploaded PDF: 414 pages; SHA-256 `5f65b22f35670873027621f029885408bfb43f2f5b16caf7e6f77538ba3a6be8`.
- Local processing completed: text extracted from 412 of 414 pages; page-level SQLite FTS5 index created; FTS integrity check passed; smoke searches for `נפש השנית בישראל` and `אגרת התשובה` returned relevant pages. Pages 3 and 337 have little/no extracted text and require visual/OCR review.
- Current status: **file_stored in this conversation workspace; extracted; locally_search_indexed**. Not yet stored in the authoritative SOULMATE repository, not ingested into Cloudflare D1/Vectorize, and not verified through the SOULMATE chat runtime.
- Rights note: the scan contains publication/copyright notices. Do not infer unrestricted reuse or redistribution rights from its availability on HebrewBooks.


## Additional full-text digital source leads — 2026-11-20

The following complete or substantial Hebrew text witnesses were located during the next acquisition pass. These are separate digital witnesses, not interchangeable with the user's uploaded print scans. They are catalogued for controlled acquisition; none is marked as stored in the authoritative repository or retrieval-verified.

### Tanya — Wikisource text witness
- Source ID: `tanya-wikisource-hebrew-text`
- URL: https://he.wikisource.org/wiki/ספר_התניא
- Author: רבי שניאור זלמן מלאדי.
- The page's contents explicitly include ספר של בינונים, שער היחוד והאמונה, אגרת התשובה, אגרת הקדש, and קונטרס אחרון.
- The page says the digital edition is based on the אוצר החסידים–ליובאוויטש text with corrections, punctuation, paragraph divisions, expanded abbreviations, and occasional orthographic normalization. The page itself is marked "לא בדוק"; this is a distinct text witness and must be compared with the user's 1956 scan before merging.
- Export options are exposed on the page (EPUB/MOBI/PDF). License/redistribution terms for this exact contributed text must be checked before copying it into the repository.
- Status: `catalogued / rights_check_pending / file_not_stored`.

### חובות הלבבות — Wikisource Hebrew translation
- Source ID: `chovot-halevavot-wikisource-hebrew`
- URL: https://he.wikisource.org/wiki/חובות_הלבבות
- Author: רבינו בחיי אבן פקודה; Hebrew translator: רבי יהודה אבן תיבון; original language: Judeo-Arabic.
- The catalog record identifies the work and describes the ten gates; the Hebrew text is presented as a full work.
- Need to verify page completeness, text revision status, and the exact license of the digital transcription before file ingestion.
- Status: `catalogued / rights_check_pending / file_not_stored`.

### ליקוטי מוהר״ן — Wikisource text witness
- Source ID: `likutei-moharan-wikisource-hebrew`
- URL: https://he.wikisource.org/wiki/ליקוטי_מוהר"ן
- The page contains the two principal divisions, ליקוטי קמא and ליקוטי תנינא, with their lesson indexes.
- The page explicitly states that its text was taken from Breslev.eip.co.il and that permission was conditional on linking each text to the originating site. This attribution/link condition must be preserved; do not assume the text is freely reusable without checking the source terms.
- A separate scanned 1874 Jerusalem edition is linked through Wikimedia Commons and the National Library catalog; treat that scan as a separate edition/source record.
- Status: `catalogued / attribution_and_rights_review_pending / file_not_stored`.

### מסילת ישרים — Wikisource full-text witness
- Source ID: `ramchal-mesilat-yesharim-wikisource-full`
- URL: https://he.wikisource.org/wiki/מסילת_ישרים_(שלם)
- Author: רבי משה חיים לוצאטו.
- Full text is available as a single page; the page notes that the digital version is unchecked. The separately chapter-divided version should be retained as a parallel structure, not silently merged.
- The digital page footer previously identified CC BY-SA 4.0; preserve attribution and share-alike terms for any derivative. The earlier PDF export attempt was blocked, so no file is yet stored.
- Status remains `catalogued / blocked_access_for_export / file_not_stored`.

### Source handling rule for these witnesses
Keep the user's uploaded 1956 Tanya scan, Wikisource text witnesses, and historical scanned editions as distinct source records. Compare them only through explicit edition-aware alignment; never overwrite one text with another. For every digital transcription, preserve its revision URL, attribution, license/permission evidence, and chapter/page locators.


## Additional primary-source acquisition leads — 2026-11-20 (pass 2)

### דגל מחנה אפרים — National Library of Israel digitized editions
- Source family: `deghel-machaneh-efraim`; author: רבי משה חיים אפרים מסדילקוב (1748–1800).
- Verified NLI catalog records:
  - https://www.nli.org.il/he/books/NNL_ALEPH990020145350205171/NLI — NLI labels this digitized item Public Domain / free use.
  - https://www.nli.org.il/he/books/NNL_ALEPH990020145140205171/NLI — separate record; NLI labels use non-commercial only, as set by the depositor.
  - https://www.nli.org.il/he/books/NNL_ALEPH990011295570205171/NLI — another separate record labeled Public Domain / free use.
- These are distinct edition/copy records. Do not collapse them into one source or apply the free-use status of one record to the others.
- Acquisition status: catalogued; NLI offers complete-item PDF or JPEG/ZIP export. Actual download and file integrity still need verification.

### דגל מחנה אפרים — Or Breslev digital text
- URL: https://or-breslev.co.il/library/דגל-מחנה-אפרים/
- Page reports 91 chapters/sections, a contents list, and downloadable PDF/Word formats.
- Rights/licensing for the digital transcription and downloadable files not yet verified; use only as a discovery and comparison witness until permission is established.
- Status: catalogued / rights_review_pending / file_not_stored.

### Abraham Abulafia — National Library of Israel author corpus
- Author authority page: https://www.nli.org.il/he/a-topic/987007297410605171
- The NLI topic page reports 136 books, 483 manuscripts, 479 additional items, and 150 articles associated with Abraham Abulafia. It lists remotely viewable items including פירוש ספר יצירה (attributed), חיי הנפש (fragment), and multiple witnesses of סתרי תורה.
- This is a corpus discovery entry, not a claim that all 136 books or 483 manuscripts are works authored by Abulafia; each record must be identity-checked and distinguished as autograph, copy, attributed work, commentary, fragment, or secondary scholarship.
- Status: corpus_discovered / item_level_cataloguing_required.

### Abraham Abulafia — digitized title leads
- Discovery page: https://mikdashmelech.co.il/drive/f/1aETPZBSJYURr5MzTDJe5hoT3T2NZSOvC/
- Lists PDF files titled ספר הצירוף, אור השכל, נר אלוקים, גן נעול ושבע נתיבות התורה, and אמרי שפר.
- The host is a third-party collection; bibliographic edition identity, completeness, and reuse rights remain unverified. Do not treat file names alone as proof of canonical attribution or permission.
- Status: discovery_only / bibliographic_and_rights_review_pending.

### Ramchal — manuscript corpus lead
- NLI record: https://www.nli.org.il/he/manuscripts/NNL_ALEPH990000743360205171/NLI
- Title: קובץ חבורי הרמח"ל; NLI marks the digitized item Public Domain / free use, with required source credit to The Russian State Library, "Ktiv" Project, The National Library of Israel.
- The catalog links related works including דעת תבונות, קל"ח פתחי חכמה, יחוד היראה, and others. Treat each related work/manuscript witness separately and preserve the required credit.
- Status: catalogued / rights_checked_public_domain_with_attribution / file_not_stored.

### Acquisition priority adjustment
Prioritize NLI items with explicit Public Domain / free-use terms and complete-item export, starting with the identified דגל מחנה אפרים record and the Ramchal manuscript record. Keep records with non-commercial-only or unclear terms out of any commercial redistribution pipeline. No new PDFs are claimed as downloaded in this pass.
