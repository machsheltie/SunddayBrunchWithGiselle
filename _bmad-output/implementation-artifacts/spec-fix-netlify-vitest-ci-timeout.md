---
title: 'Fix Netlify CI Timeout: Vitest Watch Mode'
type: 'bugfix'
created: '2026-06-11'
status: 'done'
route: 'one-shot'
---

## Intent

**Problem:** Netlify builds timeout after 18 minutes because `npm test` runs `vitest` in watch mode, which never exits. The build command `npm test && npm run build` in `netlify.toml` never reaches the build step.

**Approach:** Change `"test": "vitest"` to `"test": "vitest run"` in `package.json` so Vitest runs all tests once and exits with the correct code. Also align `test:coverage` to use `vitest run --coverage` for consistency.

## Suggested Review Order

1. [`sunday-brunch-website/package.json:10`](../../sunday-brunch-website/package.json) — `test` script changed to `vitest run`; `test:coverage` changed to `vitest run --coverage`

## Code Map

- `sunday-brunch-website/package.json` -- npm scripts; `test` and `test:coverage` fixed
- `netlify.toml` -- unchanged; build command `npm test && npm run build` now unblocks

## Tasks & Acceptance

**Execution:**
- [x] `sunday-brunch-website/package.json` -- change `"test": "vitest"` → `"test": "vitest run"` and `"test:coverage": "vitest --coverage"` → `"test:coverage": "vitest run --coverage"` -- ensures CI exits cleanly

**Acceptance Criteria:**
- Given a Netlify deploy is triggered, when the build runs `npm test && npm run build`, then tests complete and exit within the time limit and the build succeeds.
- Given tests fail, when `npm test` is run in CI, then the process exits with a non-zero code and the build is blocked.

## Spec Change Log

## Verification

**Commands:**
- `npm test` -- expected: all tests run, process exits (non-zero on failure)
- `npm run test:coverage` -- expected: coverage report generated, process exits
