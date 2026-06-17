---
id: SPEC-sunday-brunch-with-giselle
companions:
  - settled-decisions.md
  - character-canon.md
  - source-of-truth.md
  - content-model.md
  - editorial-policies.md
  - operations-and-ownership.md
  - artifact-register.md
  - execution-plan.md
sources:
  - ../../planning-artifacts/sunday-brunch-with-giselle-multi-stage-plan-2026-06-11.md
  - ../../planning-artifacts/sunday-brunch-with-giselle-character-podcast-guidance-2026-06-11.md
  - ../../planning-artifacts/research/market-current-recipe-website-ui-ux-competitive-review-research-2026-06-11.md
  - ../../../docs/prd.md
  - ../../../brand_style_guide.md
  - ../../../audio_template_guide.md
  - ../../../Personas/Giselle.txt
  - ../../../Personas/Phaedra.txt
  - ../../../Personas/Tiana.txt
  - ../../../Personas/Havok.txt
---

> **Canonical Phase 0 contract.** This SPEC and the files in `companions:` are the complete contract for Product Contract and Governance work. They define what must be decided, documented, approved, and demonstrated before Phase 1 implementation may begin.

# Sunday Brunch With Giselle: Phase 0 Product Contract

## Why

Sunday Brunch With Giselle has a settled memorial purpose, protected visual identity, established character ensemble, weekly recipe-and-podcast core, and evidence-gated roadmap. Phase 0 converts those decisions into an operating system so recipes, episodes, character performances, corrections, assets, and later product records can be created without inventing rules, ownership, or approval paths during production.

## Capabilities

- id: CAP-1
  intent: The creator team can operate from one approved product contract for content, characters, audio, publication, correction, rights, ownership, and recovery.
  success: Every required artifact in `artifact-register.md` has an owner, approver, acceptance evidence, dependency state, and controlled location, and every gate-required artifact is accepted.
- id: CAP-4
  intent: Stacey can maintain a versioned character canon that preserves each established character while controlling every published performance.
  success: Stacey and all four Shelties have approved roles, voices, specialties, boundaries, relationships, human-voice-only subjects, and versioned reference records; blind review distinguishes each speaker.
- id: CAP-13
  intent: The team can apply explicit quality, accessibility, security, provenance, and recoverability standards before production begins.
  success: Recipe and episode walkthroughs identify required evidence, access is least-privilege with MFA, and a documented restore drill recovers representative content, media, and configuration.
- id: CAP-14
  intent: The team can make product and editorial decisions from an approved position, promise, audience jobs, content pillars, and production streams.
  success: The wording and taxonomy are signed off, and every proposed content item can map to one primary pillar, one production stream, one user purpose, and one owner.
- id: CAP-15
  intent: Creators and implementers can use one authoritative content model for recipes, episodes, characters, collections, media, people, campaigns, and reserved future records.
  success: The selected content source enforces the precedence, launch-core allowlist, stable IDs, required fields, relationships, lifecycle states, validation rules, revision history, and prohibited write paths defined in `source-of-truth.md` and `content-model.md`.
- id: CAP-16
  intent: Recipe producers can evaluate a recipe against one approved production quality standard.
  success: A representative recipe passes or fails every item in the recipe quality checklist with named evidence, reviewer, approver, and revision state.
- id: CAP-17
  intent: Episode producers can move an episode from approved brief through release archive using one documented workflow.
  success: A representative episode package completes the standard brief and release checklist with traceable script, performance, transcript, rights, accessibility, metadata, approval, and archive records.
- id: CAP-18
  intent: The team can correct, revise, withdraw, and restore recipes or episodes without hiding history or confusing audiences.
  success: A tabletop correction exercise records the issue, severity, owner, decision, changed version, public notice, rollback or withdrawal action, and closure evidence.
- id: CAP-19
  intent: Stacey can govern every AI-assisted character performance through disclosure, provenance, rights review, human approval, incident response, and archival controls.
  success: A representative generated line is traceable from approved script and canon version through provider metadata, rights status, edited asset, human approval, disclosure, publication use, and correction path.
- id: CAP-20
  intent: Every launch-critical responsibility, administrative permission, backup set, and restoration action can be assigned and audited.
  success: The ownership matrix has named assignees and delegates, privileged accounts pass access review and MFA verification, and backup and restoration procedures have recorded test evidence.

## Constraints

- All ten settled product decisions in `settled-decisions.md` are immutable within this Phase 0 run unless Stacey explicitly changes one and records the change in `.decision-log.md`.
- Stacey is the human host, storyteller, recipe authority, editor, safety and correction authority, and final approver of character behavior and published dialogue.
- The visual and motion identity is protected; quality or performance standards cannot require flattening the art direction.
- AI output cannot publish unsupervised, invent memories, or become canon automatically.
- Standard task language, recipe reliability, accessibility, safety, truthful proof, and human authority take precedence over branded delight.
- Phase 0 defines contracts and demonstrates workflows; it does not implement Phase 1 through Phase 7 product features.
- Public reviews, submissions, comments, contests, direct messages, social feeds, merchandise checkout, and large account or personalization systems remain excluded.
- Rights-sensitive voice, music, art, trademarks, publicity rights, contributor material, and future commercial uses require documented permission or professional legal review where appropriate.
- Current private placeholders may support design work, but the contract must require removal, disabling, or unmistakable labeling before public release.
- Phase advancement remains evidence-based rather than date-based.
- Lower-authority projections, caches, code constants, fixtures, feeds, indexes, analytics, and AI output cannot overwrite or silently extend a higher-authority source.

## Non-goals

- Repairing or extending the website, recipe UI, search, navigation, cook mode, schema output, tests, or deployment.
- Producing the launch recipe library, photography, podcast pilot, episode reserve, or public launch.
- Opening community participation, profiles, ratings, comments, uploads, contests, or moderation operations.
- Building retention features, recommendations, cross-device accounts, Sunday plans, or audio bake-alongs.
- Designing, selling, or fulfilling merchandise.
- Selecting implementation architecture beyond the Phase 0 decision between version-controlled structured content and a small headless CMS.
- Rewriting established character personalities, replacing the protected visual system, or reopening settled product decisions without explicit creator direction.

## Success signal

Phase 0 is complete when a representative recipe can be created and reviewed, and a representative episode can move from brief to archived release package, using only this contract. No participant has to invent a field, lifecycle state, quality rule, character boundary, disclosure, approval, owner, rights record, correction action, backup set, or restoration step; all required evidence is recorded and Stacey approves the gate.

## Assumptions

- The June 11, 2026 multi-stage plan remains authoritative where older documents conflict.
- Later-phase requirements may inform schema extensibility and quality checklists, but their features are not active Phase 0 scope.
- Stacey is the sole operator and owns every Phase 0 role; the contract uses compensating controls instead of human delegation.
- The compact canon in `character-canon.md` is the authoritative baseline distilled from existing persona material, not a redesign.
