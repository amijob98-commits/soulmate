# SOULMATE AMI

A personal AI companion for deep, practical human development. SOULMATE is designed to connect a coherent model of the person, cross-disciplinary knowledge, careful reasoning, dialogue, and reliable memory/retrieval.

## Project principles
- Help turn understanding into meaningful action.
- Recognize recurring patterns without reducing a person to labels.
- Distinguish symptom relief from addressing underlying causes.
- Compare sources, surface uncertainty, and respect personal autonomy.
- Keep the opening screen and empty chat canvas blank.
- Never claim human consciousness or lived experience.

## Repository map
- [Project charter](docs/PROJECT_CHARTER.md)
- [Architecture and verified system state](docs/ARCHITECTURE_AND_SYSTEM_STATE.md)
- [Knowledge libraries and sources](docs/KNOWLEDGE_LIBRARIES_AND_SOURCES.md)
- [Decisions and working rules](docs/DECISIONS_AND_WORKING_RULES.md)
- [Roadmap](docs/ROADMAP.md)
- [Source ingestion register](docs/INGESTION_REGISTER.md)
- [Retrieval and indexing standard](docs/RETRIEVAL_INDEXING_STANDARD.md)
- [D1 knowledge retrieval engine](docs/KNOWLEDGE_RETRIEVAL_ENGINE.md)
- Rebuild local FTS5 index: `scripts/rebuild_local_index.py`

## Project boundary
This repository is for SOULMATE AMI only. It is separate from MASTER MIND and ACC (Agent Command Center).

## Important truthfulness rule
A source being discussed, catalogued, stored, chunked, embedded, or retrievable are different states. Do not claim the live agent uses a source until end-to-end retrieval through the deployed chat service has been tested.

See the documentation above for current verified infrastructure, known limitations, rights policy, and next steps.


## Transfer status

See [the verified transfer register](docs/TRANSFER_STATUS_2026-11-19.md) for the exact state of the D1 export, source code package, PDF source, and remaining migration blockers. The migration is not complete until the SQL and PDF bytes are stored in durable repository-controlled storage and verified.
