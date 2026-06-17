# ART-005 Canonical Content Source Decision

- Decision: D-02
- Status: accepted
- Decision owner: Stacey
- Decision date: 2026-06-11

## Selected Source

Version-controlled structured content is the canonical editorial source for launch.

## Rejected Launch Option

A small headless CMS is not the launch authority. It may be reconsidered later through the schema and source change-control process when multiple nontechnical editors or publishing volume justify the added service dependency.

## Authority Boundary

- Canonical recipes, episodes, characters, collections, media references, and campaign relationships live in validated structured files.
- Git history provides revision, review, comparison, and rollback evidence.
- Supabase may support operational features such as authentication, but it is not authoritative for editorial content.
- Generated pages, feeds, sitemaps, indexes, structured data, analytics, caches, and local state are projections and cannot write back.

## Versioning And Validation

- Every record follows `content-model.md` and `source-of-truth.md`.
- Schema validation rejects unknown fields, inactive record types, and invalid lifecycle states.
- Published corrections create new versions and preserve history.

## Export, Backup, And Exit

- Structured records remain portable and exportable without a vendor-specific database.
- The canonical repository and independent backups protect source history.
- A future CMS migration must preserve stable IDs, versions, relationships, approvals, correction history, rights references, and exports.

## Acceptance Dependencies

ART-005 dependencies are satisfied:

- D-03 and D-07 are closed.
- Stacey owns the content-architect role.
- ART-026 was accepted on 2026-06-12.

Stacey accepted ART-005 on 2026-06-12.
