# Phase 0 Execution Plan

Status values: `not-started`, `in-progress`, `blocked`, `ready-for-approval`, `approved`.

## Work Packages

| ID | Capability | Work package | Accountable | Depends on | Required artifacts | Acceptance evidence | Status |
|---|---|---|---|---|---|---|---|
| WP-00 | CAP-1 | Freeze settled decisions and change control | Stacey | None | ART-001 | Ten decisions present verbatim; change rule approved | approved |
| WP-01 | CAP-14 | Approve product direction and taxonomy | Stacey | WP-00 | ART-002 | `D-01` closed; exact wording signed; three sample items map cleanly | approved |
| WP-02 | CAP-4 | Approve compact canon and boundaries | Stacey | WP-00 | ART-003, ART-004 | Canon version signed; blind test passes; human-only subjects accepted | approved |
| WP-03 | CAP-15 | Select source and ratify source hierarchy and content model | Stacey | WP-01 | ART-005, ART-006, ART-007, ART-026 | `D-02` and `D-07` closed; hierarchy resolves conflicts; recipe and episode validate; unknown and reserved records are rejected | in-progress |
| WP-04 | CAP-16 | Ratify recipe quality standard | Stacey | WP-03 | ART-008, ART-009 | Representative recipe completes every applicable checklist item with evidence | in-progress |
| WP-05 | CAP-17 | Ratify episode production standard | Stacey | WP-02, WP-03 | ART-010, ART-011, ART-012 | Representative episode package reaches archive state with complete traceability | in-progress |
| WP-06 | CAP-18 | Ratify correction and revision policy | Stacey | WP-03 | ART-013, ART-014 | Tabletop S1 or S2 correction closes with preserved history and notice decision | in-progress |
| WP-07 | CAP-19 | Complete AI voice governance | Stacey | WP-02, WP-05 | ART-015, ART-016, ART-017, ART-018 | `D-04` and `D-05` closed; sample generated asset trace passes | in-progress |
| WP-08 | CAP-20 | Assign ownership and secure access | Stacey | WP-01 | ART-019, ART-020 | `D-03` closed; every row has named owner and delegate; MFA verified | in-progress |
| WP-09 | CAP-13, CAP-20 | Establish backup and restoration | Stacey | WP-03, WP-08 | ART-021, ART-022, ART-023, ART-024 | `D-06` closed; backup inventory complete; tabletop and practical restore pass | in-progress |
| WP-10 | CAP-1 | Run Phase 0 gate demonstration | Stacey | WP-00 through WP-09 | ART-025 | All gate-required artifacts accepted; recipe and episode walkthroughs require no invented rules | not-started |

## Decision Register

| ID | Decision | Options or required response | Owner | Acceptance evidence | Artifact | Blocks | Status |
|---|---|---|---|---|---|---|---|
| D-01 | Product direction and taxonomy | Market position, launch promise, audience jobs, pillars, and streams approved unchanged | Stacey | Exact approved wording, rationale, Stacey signoff, and three successful sample mappings recorded on 2026-06-11 | ART-002 | WP-01 | closed |
| D-02 | Canonical content source | Version-controlled structured content selected; headless CMS deferred | Stacey | Selection, rejected option, authority boundary, validation, export, backup, and migration conditions recorded on 2026-06-11 | ART-005 | WP-03 | closed |
| D-03 | Sole-operator ownership | Stacey owns all roles; no human delegate; compensating controls required | Stacey | All seventeen rows name Stacey, state capacity rules and concentration risks, and define recovery, checklist, pause, and external-counsel controls | ART-019 | WP-08 | closed |
| D-04 | AI voice provider and rights | Creator plan; `eleven_ttv_v3` voice design; `eleven_v3` release; `eleven_multilingual_v2` stability fallback; Flash preview-only; controlled uses and training opt-out | Stacey | Provider, plan, models, allowed and prohibited uses, version rules, current terms, and Stacey's approval recorded on 2026-06-11 | ART-016 | WP-07 | closed |
| D-05 | AI-performance disclosure | Approved exact synthetic-voice and memorial wording with accessible placement requirements | Stacey | Exact disclosure, placement rules, accessibility treatment, rights basis, date, and Stacey signoff recorded on 2026-06-11 | ART-015 | WP-07 | closed |
| D-06 | Recovery targets | Approved RPO and RTO for canonical records, production assets, releases, rights records, and critical access | Stacey | Targets, solo-operator controls, exception process, review schedule, and Stacey approval recorded on 2026-06-11 | ART-022 | WP-09 | closed |
| D-07 | Launch-core schema boundary | Approved authority hierarchy, active allowlist, operational registers, reserved future boundary, prohibitions, and promotion process | Stacey | Stacey approved every model classification plus the no-writeback and no-silent-expansion rules on 2026-06-11 | ART-026 | WP-03 | closed |

## Phase 0 Gate Checklist

Product and editorial:

- [x] Settled decisions and change control approved.
- [x] Market position, launch promise, audience jobs, pillars, and streams approved.
- [ ] Recipe checklist approved and demonstrated.
- [ ] Episode brief and release checklist approved and demonstrated.
- [ ] Correction and revision policy approved and exercised.

Canon and AI:

- [x] Every character has approved versioned canon, boundaries, specialty, and reference material.
- [x] Blind character test passes.
- [x] Human-voice-only subjects approved.
- [x] AI disclosure approved.
- [ ] Voice provider, license, provenance, approval, incident, and archive procedures pass a sample trace.

Content and operations:

- [x] Canonical source selected.
- [x] Source-of-truth hierarchy and launch-core schema boundary approved.
- [x] Stable IDs, relationships, states, validation obligations, and revision rules approved.
- [ ] Unknown fields, reserved records, and projection writeback are rejected.
- [ ] Representative recipe and episode validate without new fields.
- [x] Every launch-critical responsibility has a named assignee and explicit delegate status.
- [ ] Least-privilege and MFA audit passes.
- [ ] Backup inventory and jobs exist.
- [ ] Tabletop and practical restoration tests pass.

Final demonstration:

- [ ] A representative recipe moves from draft to approved record without invented rules.
- [ ] A representative episode moves from brief to archived release package without invented rules.
- [ ] A correction exercise preserves history and produces the required notice and evidence.
- [ ] Stacey signs the Phase 0 gate report.

## Gate Report

The gate report records:

- Date and participants
- Approved artifact versions
- Artifact register snapshot with acceptance status and evidence links
- Closed decisions
- Work package status
- Demonstration records
- Failed or waived checks with rationale
- Residual risks and named owners
- Stacey's decision: `pass`, `conditional-pass`, or `fail`

A conditional pass must state the condition, owner, due evidence, and whether Phase 1 may start before closure.
