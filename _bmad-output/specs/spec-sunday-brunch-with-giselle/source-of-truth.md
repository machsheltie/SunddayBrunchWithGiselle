# Source-Of-Truth Hierarchy And Schema Boundaries

## Authority Hierarchy

When records conflict, the higher numbered rank does not override a lower numbered rank. The first applicable source in this list governs:

1. Settled decisions and explicit changes approved by Stacey in `.decision-log.md`.
2. `SPEC.md` constraints, capabilities, non-goals, and success signal.
3. Approved companions: character canon, this hierarchy, content model, editorial policies, operations, artifact register, and execution plan.
4. Closed decision artifacts `D-01` through `D-07` and accepted evidence artifacts.
5. The selected canonical content source from `D-02`.
6. Accepted operational registers for rights, voice assets, ownership, access, corrections, backups, and restoration.
7. Published projections: website pages, structured data, feeds, sitemaps, search indexes, podcast-host records, newsletters, and social metadata.
8. Runtime and observational data: caches, local state, analytics, logs, search queries, and user-interface state.
9. Drafting aids: AI output, scripts in progress, mock data, fixtures, sample reviews, placeholder content, and experiments.

Rules:

- Higher-authority policy controls lower-authority data.
- The canonical content source controls content values only within the approved policy and schema.
- Operational registers control their own evidence domains and reference canonical IDs; they do not redefine content or canon.
- Projections are regenerated from authoritative sources.
- Runtime data may inform a proposed change but cannot become product truth without review and approval.
- A conflict is an incident: preserve both values, stop unsafe publication, identify the owning authority, resolve, and record the decision.

## Launch-Core Schema Allowlist

Only the following record types may be active in the launch-core model:

- Recipe
- Ingredient group
- Ingredient item
- Instruction section
- Instruction step
- Episode
- Chapter
- Transcript
- Character
- Character profile version
- Collection
- Media asset
- Person
- Review or approval
- Newsletter or campaign

Launch-core operational registers may reference these records:

- Decision
- Artifact
- Ownership and delegation
- Access review
- Rights and license
- Voice asset
- Correction or incident
- Backup inventory and job
- Restoration report

An active record type must:

- Have a stable ID, owner, lifecycle, version rule, validation contract, and authoritative storage location.
- Be required to create, govern, publish, correct, or recover the core recipe-and-podcast product.
- Have accepted schema evidence in ART-006 and ART-007.

## Reserved Future Boundary

The following remain reserved and inactive:

- Contributor profile
- Pet profile
- Submission
- Moderation action
- Consent grant and withdrawal
- Contest and eligibility
- Merchandise item
- Artwork-commercialization version
- Product sample approval
- Fulfillment provider or order relationship
- Public review, rating, comment, follower, feed, direct-message, or popularity-ranking record
- Personalized recommendation, achievement, saved-plan, or cross-device profile record

Reserved means:

- Names and relationships may be documented for future compatibility.
- No production table, collection, endpoint, form, workflow, migration, public page, account permission, or analytics event may activate the record.
- No launch-core record may require a reserved record to validate or publish.
- A reserved type can be promoted only by an explicit spec update, a new stable capability ID when behavior changes, Stacey's approval, schema migration plan, privacy and security review, and updated acceptance evidence.

## Prohibited Authority And Data Practices

The following are prohibited:

- Maintaining two editable canonical copies of the same record.
- Treating code constants, seed data, fixtures, generated JSON, static pages, feeds, sitemaps, search indexes, podcast-host metadata, or analytics as authoritative content.
- Allowing a projection, cache, client state, analytics pipeline, or third-party integration to write directly into canonical records.
- Silently accepting unknown fields, record types, lifecycle states, or relationships.
- Adding schema fields to satisfy one page or component without model review and accepted validation evidence.
- Activating reserved future records during Phase 0 or using them to expand Phase 1 scope.
- Publishing a record without canonical ID, version, owner, approval, and source reference.
- Overwriting published records or deleting revision, correction, withdrawal, rights, or approval history. Approved or scheduled but unpublished records may be revised only with version, audit, update-history, and current-approval traceability.
- Letting AI-generated text, audio, metadata, classifications, or relationships become canonical without human review and approval.
- Storing secrets, provider credentials, recovery codes, or payment data inside content records or evidence artifacts.
- Copying character facts into recipe or episode records when a character-version reference can preserve one authority.
- Copying rights or license terms into multiple records when a rights-register reference can preserve one authority.
- Resolving conflicts by choosing the newest timestamp without checking authority and approval.

## Change Control

A launch-core schema change requires:

1. Proposed field, type, state, or relationship and the user or operational decision it supports.
2. Confirmation that an existing field or relationship cannot satisfy the need.
3. Classification as launch-core change, operational-register change, or future reservation.
4. Impact analysis for existing records, validation, publishing, corrections, backups, exports, and projections.
5. Migration and rollback plan where stored data changes.
6. Content architect review and Stacey approval.
7. Updated ART-006, ART-007, and ART-026 evidence.

No downstream implementer may bypass this process because a framework, CMS, component, or integration offers an extra field.

## Acceptance Evidence

ART-026 passes when:

- Every active record type appears in the launch-core allowlist.
- Every model record in `content-model.md` is classified as active, operational, or reserved.
- A test conflict resolves according to the hierarchy.
- Validation rejects one unknown field and one reserved record instance.
- A generated projection is shown to be replaceable from authoritative sources and unable to write back.
- Stacey and the content architect approve the hierarchy, allowlist, prohibitions, and promotion process.

## D-07 Approval

- Decision status: closed
- Owner and content architect: Stacey
- Approval date: 2026-06-11
- Approved: authority hierarchy, launch-core allowlist, operational-register boundary, reserved future boundary, prohibitions, and promotion process
- ART-003 dependency: accepted on 2026-06-11
- Remaining ART-026 evidence: completed below

## ART-026 Tabletop Validation

Validation type: Phase 0 contract tabletop, not implementation-code evidence

Owner, content architect, reviewer, and approver: Stacey

Approval date: 2026-06-12

| Test | Input or conflict | Governing rule | Expected and approved result | Result |
|---|---|---|---|---|
| Authority conflict | Canonical recipe title conflicts with a generated webpage title | Canonical content outranks published projections | Preserve the canonical title, reject webpage authority, and regenerate the webpage | Pass |
| Unknown field | Recipe contains `popularityScore` | Unknown fields require schema change control | Reject the record; do not store, publish, or silently discard the field | Pass |
| Reserved instance | A `public-review` record is submitted | Public reviews are reserved and inactive | Reject the instance and do not create storage, workflow, page, permission, or analytics support | Pass |
| Projection writeback | Website, feed, or search index attempts to modify a canonical recipe | Projections are replaceable and cannot write back | Reject the write and regenerate the projection from the canonical source | Pass |
| Classification | Every defined record type is inspected | Each type must be launch-core, operational, or reserved | Apply the classification below; no unclassified type remains | Pass |

Classification:

- Launch-core content: Recipe, ingredient group, ingredient item, instruction section, instruction step, episode, chapter, transcript, character, character profile version, collection, media asset, person, review or approval, newsletter or campaign.
- Operational registers: Decision, artifact, ownership and delegation, access review, rights and license, voice asset, correction or incident, backup inventory and job, restoration report.
- Reserved future records: Contributor profile, pet profile, submission, moderation action, consent grant and withdrawal, contest and eligibility, merchandise item, artwork-commercialization version, product sample approval, fulfillment provider or order relationship, public review, rating, comment, follower, feed, direct message, popularity ranking, personalized recommendation, achievement, saved plan, and cross-device profile.
- `rights clearance` in `content-model.md` is classified as evidence inside the operational rights-and-license register; it is not a separate active content type.

## ART-026 Acceptance

- Status: accepted
- Evidence scope: hierarchy, classification, conflict handling, unknown-field rejection, reserved-instance rejection, and projection no-writeback
- Approval: Stacey, 2026-06-12
- Boundary: ART-007 must later demonstrate these same rejection and no-writeback rules through the selected executable validation mechanism.
