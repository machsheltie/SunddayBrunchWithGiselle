# Phase 0 Artifact Register

This register is the authoritative inventory of Phase 0 contract artifacts and acceptance evidence. An artifact is accepted only when its acceptance evidence exists, its accountable owner and approver agree, and its status is recorded here.

Status values:

- `draft`: content exists but has not passed acceptance.
- `ready-for-approval`: required evidence exists and awaits approval.
- `accepted`: approver signed and evidence is linked.
- `blocked`: a dependency or decision prevents acceptance.
- `planned`: artifact is required but execution has not started.

## Contract And Evidence Artifacts

| ID | Artifact | Capability / Work package | Accountable | Responsible owner | Approver | Acceptance evidence | Depends on | Controlled location | Status |
|---|---|---|---|---|---|---|---|---|---|
| ART-001 | Settled decisions and change control | CAP-1 / WP-00 | Stacey | Stacey | Stacey | Ten source decisions preserved verbatim and approved unchanged; change rule acknowledged on 2026-06-11 | None | `settled-decisions.md` | accepted |
| ART-002 | Product direction approval | CAP-14 / WP-01 | Stacey | Stacey | Stacey | Exact position, promise, audience jobs, pillars, and streams approved unchanged on 2026-06-11; three sample items map to one pillar, stream, purpose, and owner | ART-001, D-01 | `evidence/ART-002-product-direction-approval.md` | accepted |
| ART-003 | Versioned character canon | CAP-4 / WP-02 | Stacey | Stacey | Stacey | `CANON-2026-06-11.1`, character roles, voices, specialties, boundaries, relationships, human-only subjects, and revision controls approved by Stacey on 2026-06-11 | ART-001 | `character-canon.md` | accepted |
| ART-004 | Blind character test record | CAP-4 / WP-02 | Stacey | Stacey | Stacey | Effective score 9/10 with at least one correct line per speaker; failures, diagnostics, replacements, and Stacey approval recorded on 2026-06-12 | ART-003, D-03 | `evidence/ART-004-blind-character-test.md` | accepted |
| ART-005 | Canonical content source decision | CAP-15 / WP-03 | Stacey | Stacey | Stacey | Version-controlled structured content, rejected option, authority boundary, validation, export, backup, and exit approach accepted on 2026-06-12 | ART-002, ART-026, D-02, D-03 | `evidence/ART-005-content-source-decision.md` | accepted |
| ART-006 | Canonical content model | CAP-15 / WP-03 | Stacey | Stacey | Stacey | Common contract, lifecycle, aggregates, relationships, reserved records, validation obligations, and Stacey approval recorded on 2026-06-12 | ART-005, ART-026 | `content-model.md` | accepted |
| ART-007 | Content-model validation record | CAP-15 / WP-03 | Stacey | Stacey | Stacey | Website-scoped generated evidence recorded at `2026-06-16T09:27:26.369Z` in `_bmad-output/specs/spec-sunday-brunch-with-giselle/evidence/generated/ART-007-results.json`: 6/6 PASS for recipe, episode, correction traceability, unknown-field rejection, reserved-record rejection, and projection writeback rejection; Stacey approved final acceptance on 2026-06-16; evidence doc linked | ART-006, ART-026 | `evidence/ART-007-content-model-validation.md` | accepted |
| ART-008 | Recipe quality checklist | CAP-16 / WP-04 | Stacey | Stacey | Stacey | Identity, authority, cooking contract, confidence, usability, truth, accessibility, rights, approval, and Stacey signoff recorded on 2026-06-12 | ART-006, D-03 | `editorial-policies.md#recipe-quality-checklist` | accepted |
| ART-009 | Representative recipe acceptance record | CAP-16 / WP-04 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires one real recipe, accepted ART-007 validation, item-level ART-008 results, failure handling, revisions, and Stacey approval | ART-007, ART-008 | `evidence/ART-009-representative-recipe.md` | draft |
| ART-010 | Standard episode brief | CAP-17 / WP-05 | Stacey | Stacey | Stacey | Editorial, canon, purpose, risk, rights, accessibility, relationship, next-action, and Stacey approval fields accepted on 2026-06-12 | ART-003, ART-006, D-03 | `editorial-policies.md#episode-brief` | accepted |
| ART-011 | Episode release checklist | CAP-17 / WP-05 | Stacey | Stacey | Stacey | Editorial, performance, rights, audience package, accessibility, release, archive, correction ownership, and Stacey approval recorded on 2026-06-12 | ART-010 | `editorial-policies.md#episode-release-checklist` | accepted |
| ART-012 | Representative episode package | CAP-17 / WP-05 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; ART-007 blocker is satisfied by accepted website-scoped validation evidence; acceptance still requires one real representative episode package with complete brief-to-archive evidence and Stacey approval | ART-007, ART-010, ART-011 | `evidence/ART-012-representative-episode/` | draft |
| ART-013 | Correction and revision policy | CAP-18 / WP-06 | Stacey | Stacey | Stacey | Severity, containment, versioning, notice, withdrawal, restoration, closure, and prevention rules approved on 2026-06-12 | ART-006, D-03 | `editorial-policies.md#correction-and-revision-policy` | accepted |
| ART-014 | Correction exercise record | CAP-18 / WP-06 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; ART-007 blocker is satisfied by accepted website-scoped correction traceability validation; acceptance still requires a real S1 or S2 correction exercise with containment, notice, action, closure, prevention evidence, and Stacey approval | ART-007, ART-013 | `evidence/ART-014-correction-exercise.md` | draft |
| ART-015 | Approved AI-performance disclosure | CAP-19 / WP-07 | Stacey | Stacey | Stacey | Exact wording, placements, accessibility treatment, rights basis, date, and Stacey signoff recorded on 2026-06-11 | D-03, D-05 | `evidence/ART-015-ai-disclosure-approval.md` | accepted |
| ART-016 | AI voice provider and rights audit | CAP-19 / WP-07 | Stacey | Stacey | Stacey | Completion contract approved on 2026-06-12; acceptance still requires four voice IDs and settings, generation records, rights status, opt-out proof, listening approvals, pre-release terms review, and issue resolution | D-03, D-04 | `evidence/ART-016-ai-voice-rights-audit.md` | draft |
| ART-017 | Voice asset register and sample trace | CAP-19 / WP-07 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires one real asset traced through script, canon, generation, edits, rights, listening approval, use, disclosure, archive, backup, and correction controls | ART-012, ART-015, ART-016 | `evidence/ART-017-voice-asset-register.md` | blocked |
| ART-018 | AI incident policy exercise | CAP-19 / WP-07 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires one traced-asset incident with containment, evidence preservation, impact review, correction or withdrawal, updates, notice, closure, and prevention evidence | ART-013, ART-017 | `evidence/ART-018-ai-incident-exercise.md` | blocked |
| ART-019 | Sole-operator owner and control matrix | CAP-20 / WP-08 | Stacey | Stacey | Stacey | All seventeen responsibilities name Stacey; no human delegate is explicit; capacity, concentration risk, recovery, pause, and external-review controls approved on 2026-06-11 | D-03 | `operations-and-ownership.md#owner-matrix` | accepted |
| ART-020 | Administrative access and MFA audit | CAP-20 / WP-08 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires a sanitized inventory of every privileged service with owner, permissions, least privilege, MFA, recovery reference, review, remediation, and Stacey approval | ART-019 | `evidence/ART-020-access-mfa-audit.md` | draft |
| ART-021 | Backup inventory and job record | CAP-13, CAP-20 / WP-09 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires every backup set's source, independent and offsite destinations, frequency, retention, controls, RPO/RTO mapping, and recent job evidence | ART-006, ART-019 | `evidence/ART-021-backup-inventory.md` | draft |
| ART-022 | Approved recovery targets | CAP-13, CAP-20 / WP-09 | Stacey | Stacey | Stacey | Feasibility contract approved on 2026-06-12; D-06 targets remain blocked from artifact acceptance until ART-021 inventory, ART-023 tabletop, ART-024 practical measurements, exceptions, and Stacey approval prove feasibility | ART-021, D-06 | `evidence/ART-022-recovery-targets.md` | blocked |
| ART-023 | Tabletop restoration report | CAP-13, CAP-20 / WP-09 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-12; acceptance still requires one simulated scenario covering authority, known-good backup, isolated steps, validation, communications, expected RPO/RTO, remediation, closure, and Stacey approval | ART-021, ART-022 | `evidence/ART-023-tabletop-restore.md` | blocked |
| ART-024 | Practical restoration report | CAP-13, CAP-20 / WP-09 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-15; acceptance still requires one isolated restore with production-safety proof, integrity checks, measured time and data loss, RPO/RTO comparison, remediation, and Stacey approval | ART-021, ART-022, ART-023 | `evidence/ART-024-practical-restore.md` | blocked |
| ART-025 | Phase 0 gate report | CAP-1 / WP-10 | Stacey | Stacey | Stacey | Evidence contract approved on 2026-06-15; acceptance still requires a versioned register snapshot, every prerequisite accepted, all demonstrations evaluated, residual risks owned, a gate decision, and Stacey signature | ART-001 through ART-024, ART-026 | `evidence/ART-025-phase-0-gate-report.md` | blocked |
| ART-026 | Source hierarchy and launch-core schema boundary | CAP-15 / WP-03 | Stacey | Stacey | Stacey | Hierarchy, complete classification, conflict resolution, unknown-field rejection, reserved-instance rejection, projection no-writeback, and Stacey approval recorded on 2026-06-12 | ART-001, ART-003, D-03, D-07 | `source-of-truth.md` | accepted |

## Acceptance Rules

- Evidence must be inspectable; an assertion without a linked record is not acceptance evidence.
- Stacey's approval is required where shown and cannot be inferred from document existence.
- A blocked dependency keeps the dependent artifact blocked.
- Revisions retain the same artifact ID and increment the artifact version.
- Replaced evidence remains in history and links to its replacement.
- The gate report may waive an item only with rationale, risk owner, closure condition, and explicit statement about whether Phase 1 may begin.

## Register Maintenance

Each status change records:

- Artifact ID and version
- Previous and new status
- Evidence link
- Responsible owner
- Approver
- Date
- Reason or decision reference

The snapshot included in ART-025 is the final Phase 0 acceptance baseline.
