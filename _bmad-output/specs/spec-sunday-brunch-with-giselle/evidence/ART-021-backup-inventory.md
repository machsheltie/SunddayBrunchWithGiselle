# ART-021 Backup Inventory And Job Record

- Status: draft
- Contract owner, backup administrator, job reviewer, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Final acceptance: pending complete inventory and recent job evidence
- Governing artifacts: ART-006, ART-019, D-06, and `operations-and-ownership.md#backup-sets`

## Evidence Contract

ART-021 is accepted only when every required backup set has a controlled inventory record and recent success or failure evidence.

Each backup-set record must include:

- Stable backup-set ID and content scope
- Authoritative source and Stacey as owner
- Working copy, independent backup, and offsite copy in a separate failure domain
- Sanitized destination reference without credentials or secret values
- Backup frequency and event trigger
- Version-history and retention rules
- Encryption and access-control status
- Latest successful job date, result, evidence reference, and covered source version
- Latest failed job, response owner, remediation, and closure, or explicit `none`
- Applicable approved RPO and RTO
- Stacey's final approval

## Required Backup Sets

| Backup set | Source | Independent destination | Offsite failure domain | Frequency or trigger | Versioning and retention | Latest job evidence |
|---|---|---|---|---|---|---|
| Canonical content, canon, policies, code, and configuration | Pending | Pending | Pending | At least every 24 hours | Pending | Pending |
| New photography, source audio, and generated voice assets | Pending | Pending | Pending | End of each production session | Pending | Pending |
| Published release packages | Pending | Pending | Pending | Before publication | Pending | Pending |
| Rights, approvals, corrections, and asset registers | Pending | Pending | Pending | Same day | Pending | Pending |
| Credentials, MFA recovery, domain, and critical service access | Secure references only | Pending | Pending | Immediately after each change | Pending | Pending |

Coverage must include canonical and exported content, reproducible code and configuration, original and approved media, source and generated audio, edited dialogue and masters, transcripts and release metadata, canon and voice specifications, rights and approval records, and environment or service configuration without storing secrets in this artifact.

## Job Review

| Check | Result |
|---|---|
| Every required set has a source and owner | Pending |
| Every set has an independent backup | Pending |
| Every set has an offsite separate failure domain | Pending |
| Critical records have version history | Pending |
| Recent jobs have inspectable success or failure evidence | Pending |
| Failures have Stacey as response owner and recorded closure | Pending |
| Approved RPO and RTO are mapped | Pending |
| Stacey final approval | Pending |

## Acceptance Boundary

Approval of this evidence contract does not prove that a backup destination, job, version history, encryption control, or recovery copy exists. ART-021 remains unaccepted until the complete inventory and recent job evidence pass every check and Stacey gives final approval.

