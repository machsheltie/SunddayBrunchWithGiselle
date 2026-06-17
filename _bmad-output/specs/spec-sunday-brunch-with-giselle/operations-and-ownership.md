# Operations And Ownership

## Approval Authority

Stacey is accountable for product intent, recipe authority, character canon, sensitive editorial judgment, corrections, AI performance, and Phase 0 gate approval.

Stacey is the sole operator and holds every Phase 0 role. No human delegate exists.

## Owner Matrix

| Responsibility | Accountable | Named owner | Required role | Delegate | Capacity rule | Concentration risk and control | Artifacts | Acceptance responsibility |
|---|---|---|---|---|---|---|---|---|
| Product position, promise, pillars, streams | Stacey | Stacey | Product/editorial owner | None | Schedule explicitly | Self-approval bias; use written criteria and decision log | ART-002 | Exact wording and taxonomy approved |
| Character canon and continuity | Stacey | Stacey | Canon editor | None | Schedule explicitly | Continuity drift; use versioned canon and blind test | ART-003, ART-004 | Canon and blind test approved |
| Canonical authority, source, schema boundary, and model | Stacey | Stacey | Content architect | None | Schedule explicitly | Schema drift; enforce validation and change control | ART-005, ART-006, ART-007, ART-026 | Hierarchy, source, boundary, prohibitions, and validation accepted |
| Recipe development and testing | Stacey | Stacey | Recipe tester | None | Schedule explicitly | Author-tester bias; require recorded evidence and repeatable checks | ART-008, ART-009 | Checklist evidence complete |
| Photography and visual media | Stacey | Stacey | Photographer/media editor | None | Schedule explicitly | Rights or provenance omission; require asset records | ART-009, ART-012, ART-016 | Rights, provenance, and accessibility evidence complete |
| Episode brief and script | Stacey | Stacey | Episode producer | None | Schedule explicitly | Scope overload; brief must be approved before production | ART-010, ART-012 | Brief and script approved |
| Voice generation and asset register | Stacey | Stacey | Voice production operator | None | Schedule explicitly | Untraceable generation; asset register is mandatory | ART-016, ART-017 | Rights and sample trace complete |
| Recording, editing, and mastering | Stacey | Stacey | Audio editor | None | Schedule explicitly | Quality fatigue; use release checklist and listening pass | ART-012, ART-017 | Release master approved and traceable |
| Transcript and chapters | Stacey | Stacey | Transcript editor | None | Schedule explicitly | Missed corrections; compare against final master | ART-012 | Corrected transcript and chapters accepted |
| Accessibility review | Stacey | Stacey | Accessibility reviewer | None | Schedule explicitly | Limited independent perspective; use formal checklist and external review when needed | ART-009, ART-012, ART-015 | Review records complete |
| Metadata, publication, and archive | Stacey | Stacey | Publisher | None | Schedule explicitly | Publication error; preview, checklist, rollback, and archive required | ART-012, ART-025 | Release and archive evidence complete |
| Rights and licensing review | Stacey | Stacey | Rights reviewer | External counsel when legally required | Schedule before use | Legal expertise limit; escalate unresolved or high-risk use to counsel | ART-015, ART-016 | Allowed, prohibited, unresolved, and counsel-required uses documented |
| Correction and withdrawal | Stacey | Stacey | Correction coordinator | None | Reserve response time | Self-review conflict; preserve evidence and apply severity rules | ART-013, ART-014 | Exercise closed with preserved history |
| Backup administration | Stacey | Stacey | Backup administrator | None | Automate and review | Single-person access loss; maintain tested recovery kit and independent backups | ART-021, ART-022 | Inventory, jobs, and targets accepted |
| Restoration testing | Stacey | Stacey | Restore operator | None | Test periodically | Same-person blind spot; use scripted restore and recorded checks | ART-023, ART-024 | Tabletop and practical restore accepted |
| Administrative access review | Stacey | Stacey | System administrator | None | Review on schedule | Sole credential holder; MFA, recovery kit, and independent storage required | ART-020 | Least privilege and MFA verified |
| Future moderation policy | Stacey | Stacey | Policy owner | None | No operation authorized | No moderation capacity; community remains closed | ART-019 | Policy ownership assigned; no operation authorized |

Stacey must set realistic capacity during work-package scheduling. No weekly public cadence begins until private production evidence demonstrates that the solo workload is sustainable.

## Sole-Operator Compensating Controls

- Maintain a tested recovery kit for credentials, MFA recovery codes, domain access, canonical content, podcast hosting, storage, and voice services.
- Store recovery materials securely and separately from the primary workstation.
- Keep at least one independent backup in a separate failure domain.
- Use checklists, version history, and recorded evidence to separate creator, reviewer, and approver actions in time.
- Obtain external legal or rights review when the contract marks it required; Stacey remains accountable for the decision.
- Keep community closed because no separate moderation capacity exists.
- Treat illness, access loss, or workload overload as an operational incident with authority to pause publishing.

## Access Control

Requirements:

- Every person uses an individual account; shared administrative credentials are prohibited.
- Privileges are limited to current responsibilities.
- Administrative, content-source, podcast-host, storage, email, domain, and voice-provider accounts require MFA.
- Recovery codes and emergency access are stored in an approved secure location.
- Access is reviewed at Phase 0 gate, quarterly after launch, and when a role changes.
- Departed or reassigned people lose access promptly.
- Secrets are not stored in source content, scripts, transcripts, or decision records.
- Rights to publish, approve, withdraw, delete, and administer are distinct where the platform permits.

Access audit evidence:

- System or service
- Account owner
- Role and privileges
- MFA status
- Recovery owner
- Last review
- Required remediation

## Backup Sets

Backup inventory must cover:

- Canonical content source and exported records
- Source code and configuration needed to reproduce the product
- Original photographs, art, and approved derivatives
- Source recordings and generated voice assets
- Edited dialogue and mastered episodes
- Transcripts, chapters, show notes, artwork, and release metadata
- Character canon and voice specifications
- Rights, consent, license, approval, and correction records
- Environment and service configuration without exposing secrets in plain text

Minimum provisional pattern:

- Working copy
- Independent local or provider-managed backup
- Offsite backup in a separate failure domain

Critical records must have version history. Backup jobs must produce success or failure evidence and a named response owner.

## Approved Recovery Targets

Decision `D-06` approved these targets on 2026-06-11:

| Backup set | RPO | RTO |
|---|---|---|
| Canonical content, canon, policies, code, and configuration | 24 hours | 1 business day |
| New photography, source audio, and generated voice assets | End of each production session | 1 business day |
| Published release packages | Backup before publication; no released-version loss | 8 hours |
| Rights, approvals, corrections, and asset registers | Same day | 1 business day |
| Credentials, MFA recovery, domain, and critical service access | Immediately after each change | 4 hours |

Stacey owns every recovery action. Publishing pauses when recovery cannot meet these targets. Provider outages, illness, and access loss are documented exceptions rather than silent failures. Targets are reviewed at the Phase 0 gate, after a material service or architecture change, and annually.

## Restoration Procedure

1. Declare the affected system, records, time window, and incident owner.
2. Stop destructive synchronization or publication.
3. Select a known-good backup and verify checksum or version identity.
4. Restore to an isolated location first.
5. Validate record counts, relationships, media integrity, permissions, and secrets handling.
6. Obtain owner approval before replacing production data.
7. Restore the authoritative source, then regenerate projections.
8. Verify representative recipe, episode, character, media, rights, and correction records.
9. Record elapsed time, recovered version, data loss, failures, remediation, and Stacey approval.

Phase 0 requires one tabletop drill and one practical restore of representative content, media, and configuration.

## Operational Records

Maintain:

- Decision register
- Artifact register
- Ownership and delegation register
- Access and MFA audit
- Backup inventory and job history
- Restore drill reports
- Voice asset register
- Rights and license register
- Correction and incident register
- Canon revision record
- Recipe and episode approval records

Records use stable IDs, named owners, dates, status, evidence links, and revision history.

## ART-019 Acceptance

- Status: accepted
- Approver: Stacey
- Date: 2026-06-11
- Decision: D-03
- Evidence: Stacey is named for all seventeen responsibilities; absence of human delegates is explicit; capacity and concentration risks have compensating controls.
