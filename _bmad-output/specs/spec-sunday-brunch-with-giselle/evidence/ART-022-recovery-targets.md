# ART-022 Recovery Targets

Artifact status: `blocked`

Decision: `D-06 closed`

Owner, backup administrator, and approver: Stacey

Approval date: 2026-06-11

## Definitions

- Recovery point objective (RPO): maximum acceptable data loss measured backward from an incident.
- Recovery time objective (RTO): maximum acceptable time to restore the required capability after an incident is confirmed.

## Approved Targets

| Backup set | RPO | RTO |
|---|---|---|
| Canonical content, canon, policies, code, and configuration | 24 hours | 1 business day |
| New photography, source audio, and generated voice assets | End of each production session | 1 business day |
| Published release packages | Backup before publication; no released-version loss | 8 hours |
| Rights, approvals, corrections, and asset registers | Same day | 1 business day |
| Credentials, MFA recovery, domain, and critical service access | Immediately after each change | 4 hours |

## Solo-Operator Controls

- Stacey owns every recovery action.
- Publishing pauses when recovery cannot meet these targets.
- Provider outages, illness, and access loss are documented exceptions rather than silent failures.
- Each exception records the affected set, cause, expected duration, mitigation, publication decision, and closure evidence.
- Targets are reviewed at the Phase 0 gate, after a material service or architecture change, and annually.

## Feasibility And Exceptions

The targets are approved as operational requirements for a solo, version-controlled publishing system. Final feasibility evidence requires:

- ART-021 backup inventory and recent job evidence.
- ART-023 tabletop restoration report.
- ART-024 practical restoration report with measured recovery time and data loss.

If testing misses a target, Stacey must remediate the backup or restoration process, approve a documented exception, or revise the target through change control before Phase 0 can pass.

## Feasibility Completion Register

| Backup set | ART-021 inventory and jobs | ART-023 tabletop | ART-024 practical result | Measured RPO/RTO | Exception or remediation | Feasibility |
|---|---|---|---|---|---|---|
| Canonical content, canon, policies, code, and configuration | Blocked | Blocked | Blocked | Pending | Pending | Pending |
| New photography, source audio, and generated voice assets | Blocked | Blocked | Blocked | Pending | Pending | Pending |
| Published release packages | Blocked | Blocked | Blocked | Pending | Pending | Pending |
| Rights, approvals, corrections, and asset registers | Blocked | Blocked | Blocked | Pending | Pending | Pending |
| Credentials, MFA recovery, domain, and critical service access | Blocked | Blocked | Blocked | Pending | Pending | Pending |

Any exception must record the affected backup set, cause, expected duration, mitigation, publication decision, Stacey as owner, closure evidence, and whether the target remains valid or requires change control.

## Feasibility-Contract Approval

- Completion contract status: approved
- Contract owner, backup administrator, restore operator, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: contract approval does not establish feasibility or prove that backup inventory, restore tests, measured recovery results, or exceptions exist

## Acceptance Decision

D-06 is closed. ART-022 remains blocked by ART-021 because the approved targets cannot be accepted as feasible until every backup set has an identified source, destination, job, and recent evidence.
