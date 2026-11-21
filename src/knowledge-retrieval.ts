/**
 * SOULMATE knowledge retrieval engine.
 *
 * Reads already-ingested passages from D1; it does not write book rows or ingest sources.
 * Uses Vectorize when bound, then bounded D1 hydration. Falls back to indexed FTS5 search
 * when Vectorize is absent or unavailable. Every returned passage carries its provenance.
 */

export interface RetrievalD1Statement {
  bind(...values: unknown[]): RetrievalD1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface RetrievalD1 {
  prepare(sql: string): RetrievalD1Statement;
}

export interface RetrievalAI {
  run(model: string, input: unknown): Promise<any>;
}

export interface RetrievalVectorize {
  query(
    vector: number[],
    options: { topK: number; returnMetadata: "all" }
  ): Promise<{ matches?: Array<{ id: string; score?: number; metadata?: Record<string, unknown> | null }> }>;
}

export interface RetrievalEnv {
  DB: RetrievalD1;
  AI: RetrievalAI;
  VECTORIZE?: RetrievalVectorize;
}

export interface RetrievedPassage {
  chunk_id: string;
  source_id: string;
  title: string;
  author: string;
  tradition: string;
  domain: string;
  source_type: string;
  source_url: string | null;
  section_title: string | null;
  locator: string | null;
  content: string;
  provenance_type: string;
  edition: string | null;
  rights_basis: string | null;
  rights_status: string;
  ingestion_status: string;
  retrieval_method: "semantic" | "lexical" | "hybrid";
  score: number;
}

export interface RetrievalOptions {
  topK?: number;
  domain?: string;
  sourceId?: string;
}

const EMBEDDING_MODEL = "@cf/google/embeddinggemma-2";
const DEFAULT_TOP_K = 7;
const MAX_TOP_K = 12;
const MAX_QUERY_LENGTH = 1800;
const MAX_TERMS = 10;

function termsFrom(query: string): string[] {
  const tokens = query.slice(0, MAX_QUERY_LENGTH).toLocaleLowerCase()
    .match(/[\\p{L}\\p{N}]{2,}/gu) ?? [];
  const stop = new Set([
    "אני","אתה","את","הוא","היא","אנחנו","שלי","שלך","שלו","שלה","זה","זאת",
    "מה","איך","למה","אם","עם","על","אל","או","גם","רק","כמו","כי","אבל",
    "אז","היה","יש","אין","לא","כן","כל","עוד","כבר","מאוד","יותר","פחות",
    "the","and","for","that","with","this","from","you","your","are","was"
  ]);
  return [...new Set(tokens.filter(t => !stop.has(t)))].slice(0, MAX_TERMS);
}

function ftsExpression(terms: string[]): string {
  // Quoting each token prevents user text from becoming FTS5 operators.
  return terms.map(term => '"' + term.replaceAll('"', '""') + '"').join(" OR ");
}

function normalizeRow(
  row: Record<string, unknown>,
  method: RetrievedPassage["retrieval_method"],
  score: number
): RetrievedPassage | null {
  const str = (key: string): string => typeof row[key] === "string" ? String(row[key]) : "";
  const chunkId = str("chunk_id");
  const content = str("content");
  if (!chunkId || !content.trim()) return null;
  return {
    chunk_id: chunkId,
    source_id: str("source_id"),
    title: str("source_title") || str("title") || "מקור ללא כותרת",
    author: str("author"),
    tradition: str("tradition"),
    domain: str("domain") || "other",
    source_type: str("source_type"),
    source_url: str("source_url") || null,
    section_title: str("section_title") || null,
    locator: str("locator") || null,
    content,
    provenance_type: str("provenance_type"),
    edition: str("edition") || null,
    rights_basis: str("rights_basis") || null,
    rights_status: str("rights_status") || "לא נבדק",
    ingestion_status: str("ingestion_status") || "לא ידוע",
    retrieval_method: method,
    score
  };
}

/**
 * Search the knowledge library without scanning the whole D1 corpus.
 * Semantic IDs and FTS IDs are merged, deduplicated, and hydrated through a bounded IN query.
 */
export async function retrieveKnowledge(
  env: RetrievalEnv,
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievedPassage[]> {
  const topK = Math.max(1, Math.min(MAX_TOP_K, Math.floor(options.topK ?? DEFAULT_TOP_K)));
  const terms = termsFrom(query);
  const candidates = new Map<string, { method: "semantic" | "lexical" | "hybrid"; score: number }>();

  // Semantic retrieval is an accelerator, not a hard dependency.
  if (env.VECTORIZE && query.trim()) {
    try {
      const response = await env.AI.run(EMBEDDING_MODEL, { input: [query.slice(0, MAX_QUERY_LENGTH)] });
      const item = response?.data?.[0] ?? response?.result?.data?.[0];
      const vector = item?.embedding ?? item;
      if (Array.isArray(vector) && vector.length === 768) {
        const result = await env.VECTORIZE.query(vector, { topK, returnMetadata: "all" });
        for (const match of result.matches ?? []) {
          if (!match.id) continue;
          candidates.set(match.id, { method: "semantic", score: Number(match.score ?? 0) });
        }
      }
    } catch {
      // Continue to lexical retrieval. A Vectorize outage must not disable D1 search.
    }
  }

  if (terms.length) {
    try {
      const clauses = ["wisdom_chunks_fts MATCH ?"];
      const binds: unknown[] = [ftsExpression(terms)];
      if (options.sourceId) {
        clauses.push("wisdom_chunks_fts.source_id = ?");
        binds.push(options.sourceId);
      }
      const result = await env.DB.prepare(
        `SELECT chunk_id, bm25(wisdom_chunks_fts) AS rank
         FROM wisdom_chunks_fts
         WHERE ${clauses.join(" AND ")}
         ORDER BY rank
         LIMIT ?`
      ).bind(...binds, topK).all<{ chunk_id: string; rank: number }>();

      for (const row of result.results ?? []) {
        if (!row.chunk_id) continue;
        const prior = candidates.get(row.chunk_id);
        const lexicalScore = 1 / (1 + Math.max(0, Number(row.rank ?? 0)));
        candidates.set(row.chunk_id, prior
          ? { method: "hybrid", score: Math.max(prior.score, lexicalScore) }
          : { method: "lexical", score: lexicalScore });
      }
    } catch {
      // A malformed/unsupported FTS query should not break the conversation.
    }
  }

  const ids = [...candidates.keys()].slice(0, MAX_TOP_K);
  if (!ids.length) return [];

  const placeholders = ids.map(() => "?").join(",");
  const filters: string[] = [`chunk_id IN (${placeholders})`];
  const binds: unknown[] = [...ids];
  if (options.domain) {
    filters.push("domain = ?");
    binds.push(options.domain);
  }
  if (options.sourceId) {
    filters.push("source_id = ?");
    binds.push(options.sourceId);
  }

  const hydrated = await env.DB.prepare(
    `SELECT chunk_id, source_id, tradition, author, source_title, domain, source_type,
            source_url, ingestion_status, rights_status, section_title, locator, content,
            provenance_type, edition, rights_basis
     FROM wisdom_library_retrieval_v2
     WHERE ${filters.join(" AND ")}`
  ).bind(...binds).all<Record<string, unknown>>();

  const byId = new Map<string, RetrievedPassage>();
  for (const row of hydrated.results ?? []) {
    const id = typeof row.chunk_id === "string" ? row.chunk_id : "";
    const meta = candidates.get(id);
    if (!meta) continue;
    const passage = normalizeRow(row, meta.method, meta.score);
    if (passage) byId.set(id, passage);
  }

  // Preserve candidate ranking order; missing D1 rows are never cited.
  return ids.map(id => byId.get(id)).filter((x): x is RetrievedPassage => Boolean(x))
    .sort((a, b) => b.score - a.score).slice(0, topK);
}

/** Minimal health check: indexed counts are bounded aggregates, not a corpus scan. */
export async function knowledgeRetrievalHealth(env: RetrievalEnv): Promise<{
  d1: "ok" | "error";
  fts: "ok" | "error";
  vectorize: "bound" | "not_bound";
}> {
  let d1: "ok" | "error" = "ok";
  let fts: "ok" | "error" = "ok";
  try {
    await env.DB.prepare("SELECT 1 AS ok").all();
  } catch {
    d1 = "error";
  }
  try {
    await env.DB.prepare(
      "SELECT chunk_id FROM wisdom_chunks_fts WHERE wisdom_chunks_fts MATCH ? LIMIT 1"
    ).bind('"אדם"').all();
  } catch {
    fts = "error";
  }
  return { d1, fts, vectorize: env.VECTORIZE ? "bound" : "not_bound" };
}
