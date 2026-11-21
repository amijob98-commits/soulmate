# Video Source Inventory — Rabbi Yoram / Israel Avargel

Last verified: 2026-11-20
Repository scope: SOULMATE knowledge acquisition register.
This file records discovery and provenance only. It does **not** claim that video files, audio, transcripts, summaries, embeddings, or retrieval have been ingested.

## A. Official Hameir Laarets category: עולם המחשבה

- Publisher/source: בית המדרש המאיר לארץ, official website.
- Category URL: https://hameir-laarets.org.il/category/עולם-המחשבה/
- Category page inspected: 2026-11-20.
- The category currently lists 11 numbered lessons and 2 supplementary lessons.
- Presenter/attribution in the official site context: Rabbi Yoram Avargel and Rabbi Israel Avargel / Hameir Laarets.
- Acquisition status: discovered; official catalog inspected; individual lesson pages did not reliably load during this pass.
- Not yet downloaded: media files.
- Not yet extracted: audio/video transcript.
- Not yet completed: lesson summaries, timestamped chunks, tags, embeddings, retrieval tests.

### Official catalog entries

| Sequence | Official lesson title |
|---|---|
| Supplement 2 | הדיבור והמעשה ככניסה לעולם ההשגה – המשך |
| Supplement 1 | הדיבור והמעשה ככניסה לעולם ההשגה |
| 11 | כיצד לזהות את תכונות הנפש ועל ידי כך להתחיל להתעלות בקדושה? |
| 10 | היצר הטוב והרע הם מלבוש הנפש האלוקית והבהמית ודרכי השליטה עליהם |
| 9 | מי מנהיג את הספינה שלך – הנפש הבהמית או האלוקית? |
| 8 | עיקר ביטוי הנפש הן המחשבות וכיצד תוכל להכיר את עצמך באמת |
| 7 | האדם אינו גופו אלא נפשו וכיצד מכירים את הנפש ומגלים אותה? |
| 6 | מח המחשבה רוכב על מח הדמיון ומח הזיכרון |
| 5 | מסירות הנפש לחבר מחשבתו עם העליונים על ידי פרידת נפשו מתאוות העולם |
| 4 | במקום בו נמצאות מחשבותיו של האדם שם ממש הוא נמצא |
| 3 | זכות וטהרת המחשבה כפתח לעולם ההשגה |

## B. Separate YouTube playlist: עולם המחשבה — חול המועד פסח תשפ״א

- Playlist URL: https://www.youtube.com/playlist?list=PLi9TIrxrRvwqSRIpOhV8K9OicJWPKJIg8
- Mirror catalog URL: https://youtora.com/PLi9TIrxrRvwqSRIpOhV8K9OicJWPKJIg8
- Catalogued length: 11 videos.
- This is a distinct playlist/series instance from the current official category above; do not merge the two sets without matching individual lesson identities.
- Confirmed individual video metadata from indexed YouTube results:
  - Lesson 4 — במקום בו נמצאות מחשבותיו של האדם שם ממש הוא נמצא — https://www.youtube.com/watch?v=xR1HgSFG0U0
  - Lesson 5 — מסירות הנפש לחבר מחשבתו עם העליונים על ידי פרידת נפשו מתאוות העולם — https://www.youtube.com/watch?v=6e3wmfWRObI
  - Lesson 6 — מח המחשבה רוכב על מח הדמיון ומח הזיכרון — https://www.youtube.com/watch?v=KTFK_zvO2Tw
  - Lesson 7 — האדם אינו גופו אלא נפשו וכיצד מכירים את הנפש ומגלים אותה? — https://www.youtube.com/watch?v=mJILDjbWAEw
- One supplementary lesson was opened through the mirror catalog:
  - הדיבור והמעשה ככניסה לעולם ההשגה — https://youtora.com/wdr3Dv9TUaA
  - Runtime shown by mirror catalog: 26:47.
- Video descriptions retrieved for lessons 4–7 primarily contain recording/location details, not full lesson transcripts. No transcript was verified in this pass.

## C. One additional indexed lesson result

- Title: מחשבה יוצרת מציאות | הרב ישראל אברג'ל
- YouTube result: https://www.youtube.com/watch?v=AmVMjBKX9fo
- Published: 2024-02-05 (indexed metadata).
- Indexed description topics: inner cleansing, thought as central point, connecting to the root of thought, carefulness with thoughts, and using difficulty as a lever for growth.
- This is not assumed to be part of either 11-item series above.

## D. Retrieval and indexing requirements

For every video, before marking it ingested:
1. Confirm canonical source URL and exact lesson identity.
2. Obtain the video/audio through a permitted source or authorized download; retain original URL, publisher, title, duration, publication/recording date, and license/permission status.
3. Acquire captions/transcript where available; otherwise transcribe audio. Keep transcript text separate from model-generated summaries.
4. Preserve timestamped segments and stable IDs.
5. Create chunk-level provenance, topic/concept tags, and cross-links to relevant primary texts.
6. Generate embeddings only after transcript quality checks.
7. Test retrieval with queries that must return the correct lesson and timestamp.
8. Record each stage independently: discovered → rights_checked → file_stored → transcribed → summarized → chunked → tagged → embedded → retrieval_verified.

## G. Prior Library archive audit

Four previously uploaded SOULMATE source-library ZIPs were opened and their contents/integrity checked: `SOULMATE_SMALL_LIBRARY_initial.zip`, `SOULMATE_SMALL_LIBRARY_with_lessons.zip`, `SOULMATE_SMALL_LIBRARY_working.zip`, and `SOULMATE_SMALL_LIBRARY_enriched_2026-11-19.zip`.

- All four ZIP archives passed `testzip()` integrity checks.
- The `with_lessons` archive contains only a README, the source catalog, and the Yad Eliyahu PDF; it contains no lesson media, audio, or transcript files. Its README explicitly says the lesson sources were located online but not downloaded or stored.
- The `initial` archive contains empty folders for several planned book sources; no book files beyond Yad Eliyahu.
- The `working` archive contains Yad Eliyahu source/extraction/chunks/local SQLite index and a catalog; no additional book or lesson media.
- The `enriched` archive contains Yad Eliyahu PDF, extracted text, chunk files, local SQLite index, audit metadata, and rebuild script; no other books or video/audio assets.
- Therefore, the historical archive names and catalog entries are not evidence that the listed additional books or lessons are physically present.

## F. Repository media audit

- Checked recursive Git trees for `main` and `feature/emotion-aware-rag` on 2026-11-20. Both contain application code and documentation but no book PDFs, video/audio files, transcript files, or media directories in the visible trees.
- Checked the repository releases endpoint; it returned an empty list.
- No Git LFS pointers were present in the inspected tree entries.
- This finding applies only to the `beeberr/soulmate` repository and the two visible branches inspected. It does not rule out another repository, private external storage, or files attached outside the Git tree.

## E. Current status

- Catalog discovery: partial but useful; official category and separate 11-video playlist identified.
- Media download: not verified.
- Full transcripts: not verified.
- Full summaries: not completed.
- Chunking/tagging/embeddings: not completed.
- SOULMATE chat retrieval: not verified.
- No production D1/Vectorize writes were performed as part of this cataloging pass.
