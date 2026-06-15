# Canonical Editorial Content

This directory is the canonical editorial source selected by D-02 (2026-06-11).

- Records in `records/` are the authoritative version of all editorial content.
- This directory is a read-only source for the website build and all projections.
- Records are versioned via Git history; corrections preserve prior versions in the record's `history` array.
- No build tool, projection, CMS output, or AI-generated file may modify files in this directory without human authorship and approval.

Governing documents:
- `_bmad-output/specs/spec-sunday-brunch-with-giselle/content-model.md`
- `_bmad-output/specs/spec-sunday-brunch-with-giselle/source-of-truth.md`

Validation: `node content/art-007-run.js`
