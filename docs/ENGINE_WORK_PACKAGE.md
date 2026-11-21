# SOULMATE Conversation Engine — implementation work package

This is the first code-level implementation slice for the existing Cloudflare Worker.

## What it changes conceptually

The current Worker sends a short system prompt plus the last 16 messages to Workers AI.
This engine instead adds:

- a stable identity/value layer (`ואהבת לרעך כמוך`, `חנוך לנער על פי דרכו`);
- an explicit multi-domain knowledge map (Torah, Kabbalah, Jewish thought, psychology,
  psychiatry, neuroscience, philosophy);
- a dialogue strategy that can listen, explore, synthesize, offer a perspective, use
  verified knowledge, challenge gently, suggest a practice, or pause;
- structured conversation state so the system can remember confirmed insights,
  rejected hypotheses, tried approaches, the user's language preferences, and current stage;
- a loop warning that forces a different conversational move after repeated turns;
- source-grounded retrieval from a D1 `knowledge_chunks` table;
- a strict distinction between verified knowledge and general model knowledge.

## Important truth about the current knowledge library

The migration creates the knowledge-library schema only. It does not pretend that the
library already contains verified Torah, Kabbalah, psychology, or psychiatry sources.
Until curated chunks are added and reviewed, retrieval returns no sources and the model
is explicitly forbidden from inventing citations. Building and reviewing that corpus is
a separate workstream.

## Integration point in the current Worker

In the current `/api/chat` route:

1. Keep authentication and the existing user/session tables unchanged.
2. Read `state_json` from `conversations` as currently done.
3. Replace the direct `env.AI.run(...)` call with `generateSoulmateTurn(env, message, history, state.agentDevelopment)`.
4. Store `result.reply` in the message history.
5. Store `result.state` back under `state.agentDevelopment`.
6. Return `mode`, `reply`, and `knowledge_used` to the client.
7. Keep internal rationale server-side; do not return it to the browser.
8. Do not automatically save personal memories to the `memories` table.

The Worker currently has a single inline `worker.js` module. Before deployment, bundle this
module into that Worker or move to a multi-file module Worker. Do not deploy this package
without tests and a verified rollback point.

## Database migration

Apply `migrations/0002_knowledge_library.sql` to the existing D1 database only after
review. It creates one new table and index; it does not alter existing data.

## Evaluation

`tests/conversation-evaluations.json` defines regression scenarios derived from the
observed failure modes. Each scenario should be run against the actual Workers AI model
and scored for progress, continuity, source integrity, and user autonomy.

## Not production-ready yet

This package is an implementation slice, not a deployed change. Required next engineering
work before production:
- add deterministic unit tests for state normalization, retrieval, JSON validation, and
  loop detection;
- add an integration test using a test D1 database;
- seed the knowledge corpus with reviewed, source-attributed material;
- integrate the module into the Worker;
- run end-to-end conversation tests;
- only then deploy with explicit approval.
