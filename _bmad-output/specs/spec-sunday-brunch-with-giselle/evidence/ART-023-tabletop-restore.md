# ART-023 Tabletop Restoration Report

- Status: blocked
- Contract owner, restore operator, scenario reviewer, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Blocking dependencies: accepted ART-021 backup inventory and accepted ART-022 recovery-target feasibility
- Final acceptance: pending completed tabletop scenario
- Governing artifacts: ART-021, ART-022, D-06, and `operations-and-ownership.md#restoration-procedure`

## Evidence Contract

ART-023 is accepted only when one simulated recovery scenario walks the approved restoration procedure from incident declaration through remediation and closure.

The tabletop report must identify:

- Scenario ID and exercise date
- Affected system, records, time window, and Stacey as incident owner
- Publication and destructive-synchronization pause
- Authoritative source and known-good backup selection
- Checksum or version-identity verification method
- Planned isolated restoration steps
- Planned validation of record counts, relationships, media integrity, permissions, and secret handling
- Restoration order: authoritative source first, then regenerated projections
- Checks for representative recipe, episode, character, media, rights, and correction records
- Communications, audience impact, and publication decision
- Expected data loss and recovery time compared with the applicable D-06 RPO and RTO
- Anticipated failures, remediation owner, closure conditions, and follow-up actions
- Stacey's final approval

## Tabletop Scenario

| Scenario field | Result |
|---|---|
| Scenario and affected scope | Pending |
| Publication or synchronization pause | Pending |
| Authority and backup selection | Blocked by ART-021 |
| Identity or checksum verification method | Pending |
| Isolated restore steps | Pending |
| Integrity, relationship, media, permission, and secret checks | Pending |
| Authority-first and projection-regeneration order | Pending |
| Representative-record verification | Pending |
| Communications and publication decision | Pending |
| Expected RPO/RTO comparison | Blocked by ART-022 |
| Anticipated failures and remediation | Pending |
| Closure and Stacey approval | Pending |

## Acceptance Boundary

Approval of this evidence contract does not prove that a backup was selected or a restoration occurred. Tabletop timing is expected timing, not measured recovery performance. ART-023 remains blocked until ART-021 and ART-022 are accepted, then remains unaccepted until the complete scenario is exercised and Stacey gives final approval.

