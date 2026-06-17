# ART-020 Administrative Access And MFA Audit

- Status: draft
- Contract owner, system administrator, recovery owner, reviewer, and approver: Stacey
- Evidence-contract approval date: 2026-06-12
- Final acceptance: pending complete privileged-service inventory and verification
- Governing artifacts: ART-019 and `operations-and-ownership.md#access-control`

## Evidence Contract

ART-020 is accepted only when every privileged service is inventoried and passes ownership, least-privilege, MFA, recovery, and review checks.

Each service record must include:

- System or service name
- Sanitized account identifier
- Stacey as account owner and recovery owner
- Current role and permissions
- Least-privilege justification
- MFA method, enabled status, and verification date
- Secure recovery-material location reference
- Publish, approve, withdraw, delete, and administer rights where supported
- Confirmation that shared administrative credentials are prohibited
- Last review date and result
- Required remediation, owner, and deadline
- Stacey's final approval

This artifact must not contain passwords, API keys, recovery codes, secret values, full credential exports, or other authentication material.

## Required Service Inventory

| Service category | Service | Sanitized account | Least privilege | MFA verified | Recovery reference | Review result |
|---|---|---|---|---|---|---|
| Source control | Pending | Pending | Pending | Pending | Pending | Pending |
| Website hosting or deployment | Pending | Pending | Pending | Pending | Pending | Pending |
| Domain and DNS | Pending | Pending | Pending | Pending | Pending | Pending |
| Email and newsletter | Pending | Pending | Pending | Pending | Pending | Pending |
| Podcast host or distribution | Pending | Pending | Pending | Pending | Pending | Pending |
| Storage and backup | Pending | Pending | Pending | Pending | Pending | Pending |
| AI voice provider | Pending | Pending | Pending | Pending | Pending | Pending |
| Other privileged service | Pending or none | Pending | Pending | Pending | Pending | Pending |

## Acceptance Boundary

Approval of this evidence contract does not verify an account, permission, MFA method, or recovery process. ART-020 remains unaccepted until every privileged service is listed, failures have owned remediation, all required checks pass, and Stacey gives final approval.

