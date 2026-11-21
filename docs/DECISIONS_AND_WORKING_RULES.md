# Decisions and Working Rules

## Non-negotiable project boundaries
- Canonical project name: SOULMATE AMI.
- Canonical GitHub repository: `beeberr/soulmate`.
- Keep SOULMATE separate from MASTER MIND and ACC (Agent Command Center).
- Do not create another repository or move project data elsewhere unless the user explicitly requests it.
- No paid plan upgrades, spending, or production deployments without explicit user approval.

## Product behavior
- The system should help resolve resistance, not create new resistance.
- Do not make users pass worldview, faith, identity, or values screening before receiving help.
- Do not fill the empty chat canvas with prompts or declarations.
- Do not simply repeat the user's own words; contribute careful analysis, connections, and questions.
- Do not abandon a difficult subject because it is uncomfortable.
- Distinguish immediate relief from addressing root causes.
- Respect uncertainty and disagreement between sources.

## Data quality
Every knowledge item should carry:
- stable source ID;
- author and exact title/edition;
- tradition/domain and source type;
- rights status and ingestion status;
- URL or storage location;
- page/section/chunk locator;
- extraction and processing timestamps;
- confidence/quality notes where relevant.

## Continuity and truthfulness
- A file in GitHub, a row in D1, a vector in Vectorize, and a retrievable source in chat are four different states. Track them separately.
- Never report “saved”, “ingested”, “indexed”, “retrievable”, or “connected” unless the corresponding operation has succeeded and been verified.
- When blocked, identify the exact blocked operation and preserve the work as a documented pending task; do not invent a workaround or ask the user to repeat known context.
- Treat repository files as the durable project record; update them when decisions change.


## Mandatory continuity workflow

The project must preserve not only files and technical decisions, but also the evolution of the user's ideas and the reasoning behind them. The repository is the durable record; conversational context alone is not sufficient.

Maintain five linked records:

1. **Worldview and product thinking** — evolving principles, conceptual models, examples, insights, and the reasons they matter.
2. **Decision log** — each decision, rationale, date, alternatives considered, status, and any later superseding decision.
3. **System map** — how each product principle or knowledge requirement maps to a concrete component, data structure, workflow, or evaluation.
4. **Knowledge library** — source-level catalog with provenance, rights, ingestion, processing, indexing, and retrieval status kept distinct.
5. **Continuation checkpoint** — last verified state, work completed, blockers, unresolved questions, and the exact next action.

### Rules for every work session

- Before continuing an existing task, inspect the relevant repository records and current system state. Do not ask the user to repeat information already present.
- During work, record durable new ideas and decisions in the appropriate file; do not leave them only in chat.
- At the end of a substantial work session, update the continuation checkpoint with evidence and links.
- Distinguish proposed, researched, downloaded, stored, extracted, processed, indexed, retrievable, and integrated states. Never collapse these into a single “done” status.
- Do not claim background work occurred between turns. Report only operations actually performed and verified.
- If a source or prior decision cannot be recovered, state exactly what is missing and continue searching the existing records before asking the user to recreate it.
- Keep this continuity workflow within SOULMATE AMI; do not mix it with MASTER MIND or ACC.
