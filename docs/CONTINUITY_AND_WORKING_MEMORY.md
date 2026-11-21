# SOULMATE AMI — Continuity and Working Memory

## Purpose
This document defines the durable working record that prevents the project's worldview, decisions, system design, and knowledge work from being lost between conversations.

## Five linked records

### 1. Worldview and product thinking
Preserve the user's evolving conception of the human being and of SOULMATE: principles, conceptual models, examples, insights, tensions, and the reasoning behind them. Preserve nuance; do not flatten a developed idea into a slogan.

### 2. Decision log
For each meaningful decision, record the date, decision, rationale, alternatives, status (proposed / accepted / superseded), and links to affected artifacts.

### 3. System map
Connect each principle and requirement to implementation: component, data model, workflow, source pipeline, retrieval behavior, or evaluation. Mark unimplemented requirements explicitly.

### 4. Knowledge library
Maintain a source catalog with stable IDs, author, exact title and edition, source type, domain, rights, canonical URL/storage location, page or section locators, and separate statuses for discovery, download, storage, extraction, processing, indexing, retrieval, and chat integration.

### 5. Continuation checkpoint
At each substantial stopping point, record:
- last verified repository and infrastructure state;
- work actually completed, with commit/file links;
- work attempted but blocked, including exact blocker;
- unresolved decisions and questions;
- one concrete next action.

## Session protocol
1. Read the relevant existing records before acting.
2. Recover existing context from the repository and available history; do not ask the user to repeat known details.
3. Capture new durable ideas and decisions in the same session in which they arise.
4. Perform work in verifiable increments.
5. Verify each write by fetching the committed file again.
6. Update the checkpoint before ending substantial work.
7. Report evidence, not intentions. Never say a source is downloaded, ingested, indexed, retrievable, or integrated unless that specific state has been verified.

## Current checkpoint — 2026-11-19
This continuity protocol has been created and the mandatory workflow has been added to `docs/DECISIONS_AND_WORKING_RULES.md`. The next action is to create/update the worldview log and decision log with the recoverable project history, then reconcile the knowledge catalog and technical ingestion state.

## Boundaries
- Canonical project: SOULMATE AMI.
- Canonical repository: `beeberr/soulmate`.
- Keep separate from MASTER MIND and ACC.
- No paid upgrades, spending, destructive changes, or production deployment without explicit approval.
