import {
  generateSoulmateTurn,
  initialSoulmateState,
  type ChatMessage,
  type SoulmateEnv,
} from "./soulmate-engine";

interface ConversationRow {
  state_json: string;
}

type ChatEnv = SoulmateEnv & {
  VECTORIZE: NonNullable<SoulmateEnv["VECTORIZE"]>;
};

/**
 * Drop-in /api/chat handler after the existing authentication check.
 * Preserves the current conversations.state_json contract and message history.
 * No separate memories are created.
 */
export async function handleSoulmateChat(
  env: ChatEnv,
  userId: string,
  rawMessage: unknown,
): Promise<Response> {
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
  if (!message || message.length > 5000) {
    return Response.json({ error: "יש לכתוב הודעה עד 5000 תווים" }, { status: 400 });
  }

  const row = await env.DB.prepare(
    "SELECT state_json FROM conversations WHERE user_id = ?"
  ).bind(userId).first<ConversationRow>();

  const state = row?.state_json
    ? JSON.parse(row.state_json)
    : { messages: [], memory: [], agentDevelopment: initialSoulmateState() };

  const history: ChatMessage[] = (Array.isArray(state.messages) ? state.messages : [])
    .slice(-32)
    .filter((item: any) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .map((item: any) => ({ role: item.role, content: item.content }));

  const result = await generateSoulmateTurn(
    env,
    message,
    history,
    state.agentDevelopment ?? initialSoulmateState(),
  );

  state.messages = [
    ...(Array.isArray(state.messages) ? state.messages : []),
    { role: "user", content: message },
    { role: "assistant", content: result.reply },
  ].slice(-100);
  state.agentDevelopment = result.state;
  state.updatedAt = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO conversations(user_id, state_json, updated_at)
     VALUES(?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       state_json = excluded.state_json,
       updated_at = excluded.updated_at`
  ).bind(userId, JSON.stringify(state), state.updatedAt).run();

  return Response.json({
    reply: result.reply,
    mode: result.mode,
    knowledge_used: result.knowledge_used,
  });
}
