#!/usr/bin/env python3
"""Rebuild the local SOULMATE FTS5 index from page chunks and OCR supplements.

Usage:
  python scripts/rebuild_local_index.py /path/to/SOULMATE_SMALL_LIBRARY

This is a local operation only. It does not write to Cloudflare.
"""
import json
import sqlite3
import sys
from pathlib import Path

TAGS = {
    "צמצום": ["צמצום"],
    "ספירות": ["ספירות", "כתר", "חכמה", "בינה", "חסד", "גבורה", "תפארת", "נצח", "הוד", "יסוד", "מלכות"],
    "עולמות": ["אצילות", "בריאה", "יצירה", "עשיה", "עשייה"],
    "פרצופים": ["פרצוף", "פרצופים", "אריך אנפין", "אבא", "אמא", "זעיר אנפין", "נוקבא", "עתיק"],
    "אדם_קדמון": ["אדם קדמון", 'א"ק'],
    "נקודים_שבירה_תיקון": ["נקודים", "שבירה", "תיקון", "מלכים"],
    "נשמה_נפש": ["נשמה", "נפש", "רוח", "חיה", "יחידה"],
    "תפילה_כוונות": ["תפילה", "תפילות", "כוונה", "כוונות", "סידור"],
    "זוהר": ["זוהר", "הזוהר", "אידרא"],
    "שבת_ומועדים": ["שבת", "פסח", "סוכות", "ראש השנה", "יום הכיפורים", "חנוכה", "פורים"],
    "מצוות_מנהגים": ["מצוה", "מצוות", "מנהג", "מנהגים", "דינים"],
    "גלגול": ["גלגול", "גלגולים", "ניצוצות"],
}

def read_jsonl(path):
    with path.open(encoding="utf-8") as stream:
        return [json.loads(line) for line in stream if line.strip()]

def main(root):
    meta = root / "metadata"
    chunks_dir = root / "01_Yad_Eliyahu" / "chunks"
    rows = read_jsonl(chunks_dir / "yad_eliyahu_chunks.jsonl")
    ocr_path = meta / "ocr_missing_pages.json"
    ocr_rows = json.loads(ocr_path.read_text(encoding="utf-8"))
    pages = {int(row["page_pdf"]): row for row in ocr_rows}
    existing_pages = {int(row["page_pdf"]) for row in rows}
    next_sequence = len(rows) + 1

    for page, item in sorted(pages.items()):
        if page in existing_pages:
            raise ValueError(f"Page {page} already has a native text chunk")
        text = (item.get("text") or "").strip()
        rows.append({
            "source_id": "yad_eliyahu",
            "source_title": "יד אליהו – מפתח אנציקלופדיה לקבלת האר״י ז״ל",
            "page_pdf": page,
            "chunk_id": f"ye-p{page}-c{next_sequence}",
            "text": text,
            "extraction_method": item.get("method", "tesseract-heb"),
            "needs_review": True,
        })
        next_sequence += 1

    rows.sort(key=lambda row: int(row["page_pdf"]))
    db_path = meta / "library_index.sqlite"
    if db_path.exists():
        db_path.unlink()
    db = sqlite3.connect(db_path)
    db.executescript("""
      CREATE TABLE chunks(
        chunk_id TEXT PRIMARY KEY, source_id TEXT NOT NULL, source_title TEXT NOT NULL,
        page_pdf INTEGER NOT NULL, text TEXT NOT NULL, extraction_method TEXT NOT NULL,
        needs_review INTEGER NOT NULL, searchable INTEGER NOT NULL, char_count INTEGER NOT NULL
      );
      CREATE INDEX idx_chunks_source_page ON chunks(source_id,page_pdf);
      CREATE INDEX idx_chunks_searchable_page ON chunks(searchable,page_pdf);
      CREATE TABLE chunk_tags(
        chunk_id TEXT NOT NULL, tag TEXT NOT NULL, matched_terms TEXT NOT NULL,
        PRIMARY KEY(chunk_id,tag), FOREIGN KEY(chunk_id) REFERENCES chunks(chunk_id)
      );
      CREATE INDEX idx_chunk_tags_tag ON chunk_tags(tag,chunk_id);
      CREATE TABLE source_pages(
        source_id TEXT NOT NULL, page_pdf INTEGER NOT NULL, status TEXT NOT NULL,
        extraction_method TEXT NOT NULL, char_count INTEGER NOT NULL,
        review_required INTEGER NOT NULL, searchable INTEGER NOT NULL,
        PRIMARY KEY(source_id,page_pdf)
      );
      CREATE VIRTUAL TABLE chunks_fts USING fts5(
        chunk_id UNINDEXED,source_id UNINDEXED,source_title,page_pdf UNINDEXED,
        text,tags_text,tokenize='unicode61'
      );
    """)

    tag_counts = {}
    low_text_ocr_pages = []
    for row in rows:
        text = (row.get("text") or "").strip()
        page = int(row["page_pdf"])
        is_ocr = bool(row.get("needs_review")) or str(row.get("extraction_method", "")).startswith("tesseract")
        method = row.get("extraction_method", "tesseract-heb" if is_ocr else "pdf_text")
        searchable = len(text) >= 250
        if is_ocr and len(text) < 500:
            low_text_ocr_pages.append(page)

        matched_tags = []
        for tag, terms in TAGS.items():
            found = [term for term in terms if term in text]
            if found:
                matched_tags.append((tag, found))
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
                db.execute("INSERT INTO chunk_tags VALUES(?,?,?)",
                           (row["chunk_id"], tag, " | ".join(found)))

        db.execute("INSERT INTO chunks VALUES(?,?,?,?,?,?,?,?,?)", (
            row["chunk_id"], row["source_id"], row["source_title"], page, text,
            method, int(is_ocr), int(searchable), len(text)
        ))
        db.execute("INSERT INTO source_pages VALUES(?,?,?,?,?,?,?)", (
            row["source_id"], page, "ocr_needs_review" if is_ocr else "text_extracted",
            method, len(text), int(is_ocr), int(searchable)
        ))
        if searchable:
            tag_text = " ".join(term for _, terms in matched_tags for term in terms)
            db.execute("INSERT INTO chunks_fts VALUES(?,?,?,?,?,?)", (
                row["chunk_id"], row["source_id"], row["source_title"], str(page), text, tag_text
            ))

    db.commit()
    counts = db.execute(
        "SELECT COUNT(*),COUNT(DISTINCT page_pdf),SUM(searchable),SUM(needs_review) FROM chunks"
    ).fetchone()
    if counts[0] != 398 or counts[1] != 398:
        raise ValueError(f"Expected 398 page chunks; got {counts}")
    tests = {}
    for query in ["צמצום", "ספירות", "ארי", "אבא אמא", "נקודים", "זוהר"]:
        hits = db.execute(
            "SELECT COUNT(*) FROM chunks_fts WHERE chunks_fts MATCH ?", (query,)
        ).fetchone()[0]
        tests[query] = hits
    if any(tests[q] == 0 for q in ["צמצום", "ספירות", "ארי"]):
        raise ValueError(f"FTS smoke test failed: {tests}")

    audit = {
        "source_id": "yad_eliyahu",
        "pdf_pages": 398,
        "native_text_chunks": len(existing_pages),
        "ocr_pages_added": len(pages),
        "total_chunks": counts[0],
        "searchable_chunks": counts[2],
        "ocr_pages_needing_review": sorted(pages),
        "low_text_ocr_pages": sorted(low_text_ocr_pages),
        "tagged_chunk_counts": tag_counts,
        "fts_smoke_tests": tests,
        "notes": [
            "OCR text is retained with explicit review status; it is not manually verified.",
            "Chunks under 250 characters are retained for provenance but excluded from FTS.",
            "This local index is not synced to Cloudflare D1 or Vectorize."
        ]
    }
    (meta / "index_audit.json").write_text(
        json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    with (chunks_dir / "yad_eliyahu_chunks_enriched.jsonl").open("w", encoding="utf-8") as stream:
        for row in rows:
            enriched = dict(row)
            enriched.setdefault("extraction_method", "pdf_text")
            enriched.setdefault("needs_review", False)
            stream.write(json.dumps(enriched, ensure_ascii=False) + "\n")
    db.close()
    print(json.dumps({"counts": counts, "fts_tests": tests, "low_text_ocr_pages": low_text_ocr_pages},
                     ensure_ascii=False, indent=2))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: rebuild_local_index.py LIBRARY_ROOT")
    main(Path(sys.argv[1]))
