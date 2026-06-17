# Canonical Content Model

This model is subordinate to the authority and boundary rules in `source-of-truth.md`. A record type or field is active only when that companion places it inside the launch-core allowlist.

## Source Decision

D-02 selected version-controlled structured content as the canonical editorial source on 2026-06-11.

- Canonical content uses validated structured files with Git history.
- A small headless CMS is deferred and cannot become authoritative without source and schema change control.
- Supabase may support operational features such as authentication but is not authoritative for editorial content.
- Generated site files, feeds, search indexes, analytics stores, and media derivatives are projections, not competing sources of truth.

The source decision cannot change the source-of-truth hierarchy or activate a reserved record type. Those changes require the approval path in `source-of-truth.md`.

## Common Record Contract

Every record has:

- `id`: stable, unique, human-inspectable identifier; never reused.
- `type`: controlled record type.
- `status`: allowed lifecycle state.
- `version`: monotonically increasing revision.
- `createdAt`, `updatedAt`: timestamps.
- `createdBy`, `updatedBy`: person IDs.
- `ownerId`: accountable owner.
- `sourceRefs`: evidence or originating records.
- `revisionNote`: reason for the current revision.

Published records additionally have `slug`, `publishedAt`, `approvedBy`, and `approvedAt`. Withdrawn records retain their IDs and history.

## Lifecycle States

Core content states:

`draft -> review -> scheduled -> published -> corrected -> archived`

Exceptional terminal or reversible state:

`withdrawn`

Rules:

- Only approved records may become scheduled or published.
- Corrections create a new version and preserve the prior version.
- Archived records remain addressable internally.
- Withdrawn records retain reason, authority, public handling, and restoration conditions.

Reserved future submission states:

`draft -> submitted -> under-review -> changes-requested -> approved -> scheduled -> published`

Alternative outcomes:

`rejected`, `withdrawn`, `archived`

These reserved states support future model compatibility; no submission feature is in Phase 0 scope.

## Recipe Aggregate

Required recipe fields:

- Identity: `id`, `slug`, `title`, `summary`, `primaryPillarId`, `productionStreamId`, `ownerId`.
- Authority: author, tester, reviewer, approver, test date, revision state, update history.
- Commitment: prep time, cook time, total time, yield, difficulty, equipment.
- Classification: collections, season, occasion, skill, dietary disclosures, allergens.
- Structure: ordered ingredient groups, ordered instruction sections, notes.
- Narrative: optional `story` headnote — a markdown `body` with an optional `headline` — carrying the personal context, occasion, and reason-to-cook that a recipe-blog entry leads with. Optional in the schema but expected for published recipes by the ART-008 checklist. Versioned as part of the recipe; photography stays in Media. Added under change control by D-08 (2026-06-17).
- Guidance: sensory checkpoints, tested substitutions and impacts, common mistakes, recovery, storage, freezing, reheating, make-ahead, transport, gifting, pet-safe note where relevant, and why-it-works evidence.
- Behavior: scaling eligibility, supported scale factors, unit-conversion eligibility, print eligibility, copy eligibility.
- Media: hero asset, process assets where needed, social or pin derivatives, alt text, rights and provenance.
- Relationships: featured episode, related episodes, characters, collections, campaigns.

Ingredient group:

- `id`, recipe ID, label, order, and ordered ingredient items.

Ingredient item:

- `id`, quantity, unit, ingredient name, preparation, optional flag, scaling rule, conversion rule, allergen references, and note.

Instruction section:

- `id`, recipe ID, label, order, and ordered steps.

Instruction step:

- `id`, body, order, duration where applicable, equipment references, ingredient references, sensory checkpoint, warning, recovery note, and media references.

## Episode Aggregate

Required episode fields:

- Identity: `id`, `slug`, `title`, `summary`, episode number or sequence, primary pillar, production stream, owner.
- Editorial: approved brief, objective, emotional thread, featured recipe or article, primary comic engine, cast, canon version.
- Release: publication date, duration, artwork, show notes, chapters, corrected transcript, one next action.
- Audio: source recordings, generated performances, edited dialogue, master, podcast-host URL, download or app fallback.
- Governance: character review, factual review, safety review, accessibility review, rights status, AI disclosure, approver.
- Relationships: recipes, characters, collections, newsletter or campaign.
- Archive: release copy, metadata snapshot, transcript version, audio checksums, correction history, backup locations.

Chapter:

- `id`, episode ID, title, start time, order, related content, and transcript anchor.

Transcript:

- `id`, episode ID, language, corrected text, speaker labels, accessibility notes, version, reviewer, and approval.

## Character Aggregate

Character:

- `id`, public name, role, visual identity, relationship summary, active canon version.

Character profile version:

- Version ID, effective date, biography, real facts, fictional embellishments, appearance, voice, vocabulary, pace, emotional range, signature phrases, specialty, comic mechanism, strengths, flaws, relationships, permitted subjects, prohibited or human-only subjects, recurring segments, continuity notes, rights notes, and Stacey approval.

## Supporting Records

Collection:

- `id`, name, slug, purpose, inclusion rules, owner, status, and ordered content references.

Media asset:

- `id`, asset type, source file, derivatives, creator, rights holder, license, allowed uses, alt text or transcript, checksum, storage locations, and related records.

Person:

- `id`, name, role, contact scope, permissions, and active status.

Review or approval:

- `id`, subject record and version, review type, reviewer, result, notes, date, and evidence.

Newsletter or campaign:

- `id`, name, promise, owner, related content, audience, disclosure requirements, status, and release date.

## Reserved Future Records

Define but do not implement:

- Contributor and pet profiles
- Submission and moderation action
- Consent grant and withdrawal
- Contest and eligibility record
- Merchandise item, artwork version, rights clearance, sample approval, and fulfillment provider

Reserved records must reference stable person, character, content, media, rights, and approval IDs rather than duplicate them.

Reserved records are definitions only. They cannot be instantiated, published, exposed through an API, migrated into production storage, or used to justify Phase 1 implementation until explicitly promoted into the launch-core allowlist.

## Validation Evidence

The model is accepted when:

1. A representative recipe validates with no invented field.
2. A representative episode validates with no invented field.
3. A recipe links to its episode, characters, collection, media, people, and campaign.
4. A correction creates a new version without deleting history.
5. A withdrawn record retains traceability.
6. Media and generated performances expose provenance and rights.
7. Every published record has an owner, reviewer, approver, and recoverable source.
8. An unknown field or reserved record is rejected rather than silently accepted.
9. A generated projection cannot write back to the canonical content source.

## ART-006 Acceptance

- Status: accepted
- Owner, content architect, and approver: Stacey
- Approval date: 2026-06-12
- Approved scope: common record contract, lifecycle and history rules, recipe, episode, chapter, transcript, character, supporting-record aggregates, relationships, reserved future records, and validation obligations
- D-08 amendment approval: Stacey approved the optional recipe `story` headnote amendment on 2026-06-18 under schema version `CONTENT-MODEL-2026-06-17.1`
- Boundary: ART-007 must provide representative executable validation evidence; ART-006 approval does not claim that validators or production storage already exist
- D-08 boundary: approval of the optional story field does not accept ART-009, any production recipe, or any representative recipe evidence
