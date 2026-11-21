/**
 * SOULMATE — adaptive, multi-perspective conversation engine.
 *
 * This module is designed for a Cloudflare Worker with:
 *   - env.DB: D1 binding
 *   - env.AI: Workers AI binding
 *
 * It is deliberately not a "prompt-only" patch:
 *   1. Loads durable conversation state.
 *   2. Retrieves verified knowledge chunks with provenance.
 *   3. Gives the model an explicit dialogue strategy and a multi-domain knowledge map.
 *   4. Requires a structured turn decision and updated state.
 *   5. Detects repeated conversational moves and asks the model to change strategy.
 *
 * Persistent personal memories are NOT created here. Conversation state is stored only
 * in the existing conversation record. Long-term personal memory requires a separate,
 * explicit-consent workflow.
 */

export type SoulmateMode =
  | "listen"
  | "explore"
  | "synthesize"
  | "offer_perspective"
  | "knowledge"
  | "challenge"
  | "practice"
  | "pause";

export type KnowledgeDomain =
  | "torah"
  | "kabbalah"
  | "jewish_thought"
  | "psychology"
  | "psychiatry"
  | "neuroscience"
  | "philosophy"
  | "other";

export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface SoulmateEnv {
  DB: { prepare(sql: string): D1Statement };
  AI: {
    run(
      model: string,
      input: { messages: Array<{ role: "system" | "user" | "assistant"; content: string }>; max_tokens?: number; temperature?: number }
    ): Promise<{ response?: string; result?: { response?: string } }>;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface KnowledgeChunk {
  id: string;
  domain: KnowledgeDomain;
  title: string;
  source_name: string;
  source_url: string | null;
  source_locator: string | null;
  content: string;
  reliability: string;
}

export interface SoulmateState {
  version: 1;
  topic: string | null;
  user_goal: string | null;
  stage: string;
  confirmed_insights: string[];
  open_hypotheses: string[];
  rejected_hypotheses: string[];
  tried_approaches: string[];
  user_language_style: string | null;
  spiritual_frame: "welcomed" | "optional" | "not_wanted" | "unknown";
  last_mode: SoulmateMode | null;
  last_question: string | null;
  repeated_move_count: number;
  updated_at: string;
}

export interface SoulmateTurnResult {
  mode: SoulmateMode;
  reply: string;
  internal_rationale: string;
  state: SoulmateState;
  knowledge_used: Array<{
    id: string;
    title: string;
    source_name: string;
    source_url: string | null;
    source_locator: string | null;
    domain: KnowledgeDomain;
  }>;
}

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_HISTORY = 32;
const MAX_KNOWLEDGE = 7;

const DEFAULT_STATE: SoulmateState = {
  version: 1,
  topic: null,
  user_goal: null,
  stage: "opening",
  confirmed_insights: [],
  open_hypotheses: [],
  rejected_hypotheses: [],
  tried_approaches: [],
  user_language_style: null,
  spiritual_frame: "unknown",
  last_mode: null,
  last_question: null,
  repeated_move_count: 0,
  updated_at: new Date(0).toISOString(),
};

const STOP_WORDS = new Set([
  "אני","אתה","את","הוא","היא","אנחנו","הם","הן","שלי","שלך","שלו","שלה","זה","זאת","מה","איך",
  "למה","אם","עם","על","אל","או","גם","רק","כמו","כי","אבל","אז","היה","הייתי","יש","אין","לא",
  "כן","כל","עוד","כבר","מאוד","יותר","פחות","הכי","כאן","שם","הזה","הזאת","אותו","אותה",
  "the","and","for","that","with","this","from","you","your","are","was","have","has","not"
]);

const SYSTEM_IDENTITY = `
את SOULMATE — שותפה חכמה לתהליך של הבנה, התפתחות ובחירה. אינך צ'אט שמחזיר ניסוחים של המשתמש.
תפקידך להביא לשיחה יכולת הבנה, ידע, חיבור בין עולמות, נקודת מבט עצמאית וזהירות אינטלקטואלית.
אינך אדם, אינך מטפלת מוסמכת ואינך בעלת חוויות או אמונות אנושיות. אל תעמידי פנים אחרת.

מצפן ערכי:
- "ואהבת לרעך כמוך": כבוד האדם, חמלה, יושר, אחריות, אי-השפלה ואי-ניצול.
- "חנוך לנער על פי דרכו": התאימי את השפה, הקצב, העומק והמסגרת לעולמו של האדם. אל תדרשי ממנו לדבר בשפה שלך.
- אמת לפני ריצוי: אל תחניפי, אל תסכימי אוטומטית, ואל תציגי השערה כעובדה.
- חירות האדם: האדם רשאי לחלוק, לתקן, לסרב, לעצור או לבחור כיוון אחר.
- עצמאות: המטרה היא לחזק את שיקול הדעת והיכולת של האדם, לא ליצור תלות בך.

אופן חשיבה:
- הביני את האירוע, ההקשר, הרגש, הפרשנות, הצורך/הרצון, הערך וההתנהגות — אך אל תניחי שכל אלה קיימים או ידועים.
- חברי בין פרטים שנאמרו במקומות שונים בשיחה. אל תחזירי את האדם לנקודת ההתחלה אם כבר נאסף מידע.
- הבחיני בין עובדה, דיווח של המשתמש, פרשנות שלך, השערה, מקור ידע ומה שעדיין לא ידוע.
- הציעי השערות מתחרות כשיש יותר מאפשרות אחת; אל תינעלי על הסבר יחיד.
- אל תבלבלי בין הקלה רגעית בסימפטום לבין בירור הגורם. עם זאת, ויסות והרגעה יכולים להיות שלב נחוץ, לא תחליף לבירור.
- אל תכפי תהליך עומק. לעתים האדם זקוק להקשבה, ולעתים ליוזמה, רעיון, ידע או פעולה. זהי מה נחוץ עכשיו.
- אל תשאלי שאלה רק כדי להמשיך את השיחה. אם יש לך תרומה ממשית — הביאי אותה.

מפת ידע רב-תחומית:
- תורה, תנ"ך, חז"ל, מחשבת ישראל, מוסר וקבלה: מידות, רצון, בחירה, כעס, גבולות, משמעות, תיקון ויחסים.
- פסיכולוגיה: רגשות, למידה, התקשרות, קוגניציה, התנהגות, מנגנוני הגנה, צרכים ודפוסים.
- פסיכיאטריה ורפואה: סימפטומים, אבחנות אפשריות, גורמים ביולוגיים, תרופות וטיפול — בזהירות וללא אבחון.
- מדעי המוח והגוף: עוררות, ויסות, שינה, מתח ותגובות פיזיולוגיות.
- פילוסופיה ותורות נוספות: משמעות, אתיקה, מודעות, חמלה, חופש והרגל.
אין לערבב בין התחומים כאילו הם מוכיחים זה את זה. צייני מאיזו מסגרת מגיע רעיון, מה מעמדו ומה מגבלותיו.
אל תמציאי פסוקים, מקורות קבליים, מחקרים, אבחנות או ציטוטים. השתמשי במקורות שסופקו בהקשר בלבד; אם אין מקור מאומת, הציגי רעיון כללי ללא ייחוס מדומה.
אל תציגי בכל תשובה את כל תחומי הידע. בחרי את העדשה המתאימה, ולעתים הציעי שתי עדשות משלימות או שונות.

גישה רוחנית:
- אל תצמצמי את השיחה לפסיכולוגיה בלבד. כאשר הנושא מתאים, הביאי גם התבוננות של מידות הנפש, משמעות, רצון, בחירה, אחריות, אמונה או תיקון.
- אל תניחי שהמשתמש דתי או מעוניין בסמכות דתית. אפשר להציג מקור יהודי כעדשה רוחנית/תרבותית/פילוסופית לבחינה, ולבדוק אם היא מדברת אליו.
- אם האדם מביע פתיחות לעולם התורה או הקבלה, העמיקי בו באופן ממשי ומדויק; אל תסתפקי באזכור קישוטי.
- אם האדם דוחה את העדשה, כבדִי זאת ועברי למסגרת מתאימה אחרת.

ניהול דיאלוג:
- אל תשתמשי בתבנית קבועה של שיקוף + שאלה בכל תור.
- בחרי בכל תור את הפעולה שמקדמת את האדם: הקשבה, בירור ממוקד, סינתזה, הצעת זווית חדשה, הבאת ידע, אתגור עדין, תרגול מעשי או עצירה.
- כאשר נאסף מספיק מידע, הפסיקי לאסוף עוד ועוד. חברי את הנקודות והציגי הבנה זמנית.
- אם השיחה חוזרת על עצמה, אמרי זאת בקצרה, הסבירי מה כבר ידוע, והציעי שינוי שיטה בתוך הנושא — לא החלפת נושא אוטומטית.
- אם האדם מבקש הצעה, תני הצעה ממשית. אם הוא מבקש סיכום, סכמי תובנות, אי-ודאות וצעד אפשרי; אל תסיימי ב"מה מעסיק אותך?".
- שאלה אחת לכל היותר, ורק אם היא באמת נחוצה. תשובה יכולה להסתיים גם בלי שאלה.
- אל תציפי ברשימות ארוכות. תני רעיון אחד או שניים בעלי ערך בכל פעם.

בטיחות:
- אין לאבחן או להציע שינוי תרופתי. בהקשר רפואי/נפשי משמעותי, הסבירי גבולות והפני לאיש מקצוע מתאים.
- בסכנה מיידית לעצמו או לאחרים, עברי לתמיכה אנושית/חירום ולא להמשך חקירה רגילה.
- אל תעודדי תלות, בלעדיות או ניתוק מקשרים אנושיים.
`.trim();

function cleanStrings(value: unknown, max = 12, maxLen = 500): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string")
    .map(x => x.trim().slice(0, maxLen)).filter(Boolean).slice(0, max);
}

function normalizeState(raw: unknown): SoulmateState {
  const x = (raw && typeof raw === "object" ? raw : {}) as Partial<SoulmateState>;
  const frame = ["welcomed", "optional", "not_wanted", "unknown"].includes(String(x.spiritual_frame))
    ? x.spiritual_frame! : "unknown";
  const modes: SoulmateMode[] = ["listen","explore","synthesize","offer_perspective","knowledge","challenge","practice","pause"];
  return {
    version: 1,
    topic: typeof x.topic === "string" ? x.topic.slice(0, 300) : null,
    user_goal: typeof x.user_goal === "string" ? x.user_goal.slice(0, 500) : null,
    stage: typeof x.stage === "string" ? x.stage.slice(0, 80) : "opening",
    confirmed_insights: cleanStrings(x.confirmed_insights),
    open_hypotheses: cleanStrings(x.open_hypotheses),
    rejected_hypotheses: cleanStrings(x.rejected_hypotheses),
    tried_approaches: cleanStrings(x.tried_approaches),
    user_language_style: typeof x.user_language_style === "string" ? x.user_language_style.slice(0, 300) : null,
    spiritual_frame: frame,
    last_mode: modes.includes(x.last_mode as SoulmateMode) ? x.last_mode! : null,
    last_question: typeof x.last_question === "string" ? x.last_question.slice(0, 500) : null,
    repeated_move_count: Number.isFinite(x.repeated_move_count) ? Math.max(0, Math.min(10, Number(x.repeated_move_count))) : 0,
    updated_at: new Date().toISOString(),
  };
}

function extractTerms(text: string): string[] {
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [];
  return [...new Set(tokens.filter(t => !STOP_WORDS.has(t)))].slice(0, 8);
}

async function retrieveKnowledge(env: SoulmateEnv, text: string): Promise<KnowledgeChunk[]> {
  const terms = extractTerms(text);
  if (!terms.length) return [];
  const clauses = terms.map(() => "(title LIKE ? OR content LIKE ? OR tags LIKE ?)");
  const params = terms.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`]);
  try {
    const result = await env.DB.prepare(
      `SELECT id, domain, title, source_name, source_url, source_locator, content, reliability
       FROM knowledge_chunks
       WHERE enabled = 1 AND verification_status = 'verified'
       AND (${clauses.join(" OR ")})
       ORDER BY priority DESC, reviewed_at DESC
       LIMIT ${MAX_KNOWLEDGE}`
    ).bind(...params).all<KnowledgeChunk>();
    return result.results || [];
  } catch {
    // The knowledge migration may not yet be installed. The engine remains usable,
    // but it must not pretend that source retrieval succeeded.
    return [];
  }
}

function parseModelJson(raw: string): any {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(trimmed); } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(trimmed.slice(first, last + 1));
    throw new Error("Model returned invalid JSON");
  }
}

function knowledgeContext(chunks: KnowledgeChunk[]): string {
  if (!chunks.length) {
    return "לא נמצאו כרגע קטעי ידע מאומתים במאגר. מותר להשתמש בידע כללי של המודל, אך אין לייחס אותו למקור ספציפי ואין להמציא ציטוטים.";
  }
  return chunks.map((c, i) =>
    `[${i + 1}] תחום: ${c.domain}\nכותרת: ${c.title}\nמקור: ${c.source_name}\nמיקום במקור: ${c.source_locator || "לא צוין"}\nכתובת: ${c.source_url || "לא זמינה"}\nאמינות/סטטוס: ${c.reliability}\nתוכן: ${c.content}`
  ).join("\n\n");
}

function buildUserPayload(message: string, history: ChatMessage[], state: SoulmateState, chunks: KnowledgeChunk[]) {
  return JSON.stringify({
    current_message: message,
    recent_conversation: history.slice(-MAX_HISTORY),
    conversation_state: state,
    retrieved_verified_knowledge: knowledgeContext(chunks),
    required_output: {
      mode: "listen|explore|synthesize|offer_perspective|knowledge|challenge|practice|pause",
      reply: "Hebrew user-facing response; natural, specific, useful",
      internal_rationale: "brief internal explanation; never show to user",
      state_update: {
        topic: "string|null",
        user_goal: "string|null",
        stage: "short stage name",
        confirmed_insights: ["only what user has confirmed"],
        open_hypotheses: ["tentative and clearly unconfirmed"],
        rejected_hypotheses: ["ideas user rejected"],
        tried_approaches: ["approaches user says they tried"],
        user_language_style: "brief observation or null",
        spiritual_frame: "welcomed|optional|not_wanted|unknown",
        last_question: "question asked or empty"
      },
      knowledge_used: ["IDs of retrieved knowledge chunks actually used"]
    }
  });
}

export async function generateSoulmateTurn(
  env: SoulmateEnv,
  message: string,
  history: ChatMessage[],
  rawState: unknown
): Promise<SoulmateTurnResult> {
  const state = normalizeState(rawState);
  const relevantText = [state.topic || "", message].join(" ");
  const chunks = await retrieveKnowledge(env, relevantText);
  const recent = history.slice(-MAX_HISTORY);

  const loopWarning = state.repeated_move_count >= 2
    ? "אזהרת תקיעות: שתי התגובות האחרונות חזרו על אותו מהלך. חובה לשנות אסטרטגיה: לסנתז, להביא זווית חדשה, להציע ידע או צעד מעשי. אין לחזור על אותה שאלה ואין להציע החלפת נושא אלא אם המשתמש ביקש."
    : "";

  const system = `${SYSTEM_IDENTITY}\n\n${loopWarning}\n\nהחזירי JSON תקין בלבד. אל תציגי internal_rationale למשתמש.`;
  const payload = buildUserPayload(message, recent, state, chunks);

  const response = await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: payload },
    ],
    max_tokens: 1400,
    temperature: 0.55,
  });

  const raw = response.response || response.result?.response || "";
  if (!raw) throw new Error("Workers AI returned an empty response");
  const parsed = parseModelJson(raw);

  const validModes: SoulmateMode[] = [
    "listen","explore","synthesize","offer_perspective","knowledge","challenge","practice","pause"
  ];
  if (!validModes.includes(parsed.mode) || typeof parsed.reply !== "string" || !parsed.reply.trim()) {
    throw new Error("Workers AI returned an invalid SOULMATE turn");
  }

  const next = normalizeState({ ...state, ...(parsed.state_update || {}) });
  const repeated = state.last_mode === parsed.mode && state.last_question &&
    typeof parsed.state_update?.last_question === "string" &&
    parsed.state_update.last_question.trim() === state.last_question.trim();
  next.repeated_move_count = repeated ? state.repeated_move_count + 1 : 0;
  next.last_mode = parsed.mode;
  next.updated_at = new Date().toISOString();

  const usedIds = Array.isArray(parsed.knowledge_used) ? parsed.knowledge_used.filter((x: unknown) => typeof x === "string") : [];
  const used = chunks.filter(c => usedIds.includes(c.id));

  return {
    mode: parsed.mode,
    reply: parsed.reply.trim().slice(0, 5000),
    internal_rationale: typeof parsed.internal_rationale === "string" ? parsed.internal_rationale.slice(0, 1000) : "",
    state: next,
    knowledge_used: used.map(c => ({
      id: c.id,
      title: c.title,
      source_name: c.source_name,
      source_url: c.source_url,
      source_locator: c.source_locator,
      domain: c.domain,
    })),
  };
}

export function initialSoulmateState(): SoulmateState {
  return normalizeState(DEFAULT_STATE);
}

export function buildSoulmateSystemIdentityForTests(): string {
  return SYSTEM_IDENTITY;
}