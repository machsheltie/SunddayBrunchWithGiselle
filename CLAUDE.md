# CLAUDE.md — Sunday Brunch With Giselle (web app)

This document is a constitution, not a checklist. It explains *why* this codebase is the
way it is so that when you hit a decision these notes don't cover, you can reason from the
same values the maintainers would. When a rule and the reasoning behind it ever seem to
conflict, follow the reasoning — that's the thing the rule was trying to protect.

---

## What this project is

**Sunday Brunch With Giselle** is a cozy, whimsical recipe-blog + podcast brand (host Stacey
and her AI-voiced Shelties). This file covers the **website code only**. The brand voice,
persona scripts, and episode content are governed elsewhere and are off-limits to code changes
(see "The content boundary" below).

**The canonical, deployed app is `sunday-brunch-website/`.** It is a React 18 + Vite 6
single-page app, deployed to Netlify, backed by Supabase (auth + ratings) and ConvertKit
(email). Unless a task explicitly says otherwise, *this* is the app you are working in.

> **Important:** the repository root is cluttered with historical material — old app
> directories, a hundred-plus status/audit reports, and scratch files. Most of it is
> **not** the live app and some of it is **stale or wrong**. See "Reading this repository"
> before you trust any document here.

---

## Why this codebase exists the way it does (the constitution)

**1. The whimsy *is* the product, not decoration.**
The brand promise is "Whimsy, Warmth & Wags." The Three.js watercolor canvas, the GSAP/
framer-motion animations, the floating paws and sparkles — those are the reason a visitor
stays. The build config literally keeps the animation libraries bundled together "for the
magic" and lazy-loads pages while "keeping ALL magic intact." So: do not strip, simplify, or
"optimize away" the visual layer to hit a number. When the magic and a metric collide, the
job is to make them *both* work (that's what code-splitting and lazy-loading are for), not to
sacrifice the experience. If you genuinely can't, surface the tradeoff rather than quietly
removing delight.

**2. Performance budgets exist *because* the magic is expensive.**
Three.js, GSAP, and framer-motion are heavy, and most visitors are on mobile. That tension is
the central engineering problem of this app. Core Web Vitals targets (LCP < 2.5s p75 mobile,
CLS < 0.1) and the vendor-chunking / lazy-route / `drop_console` build setup are all there to
let an indulgent visual experience still load fast. When you add anything heavy, assume you
are spending against this budget and pay for it deliberately — lazy-load it, code-split it, or
justify it. Don't treat the budget as red tape; it's how principles #1 and "fast site"
coexist.

**3. Tests are the contract, and they come first.**
This project practices TDD: write the test, then the code. Unit tests run on Vitest, end-to-end
flows on Playwright (including a visual-parity suite). The reason is practical — animations and
content projections break in ways that are easy to miss by eyeballing, and there isn't a large
team doing manual QA. A failing or deleted test means the *code* is wrong, not the test. Never
delete, skip, or weaken a test to get to green; if a test is genuinely obsolete, say so and
explain why before removing it.

**4. Accessibility is part of "warmth," not a compliance tax.**
The brand is about making people feel welcome, and that has to include people using screen
readers or keyboards. Target WCAG AA: semantic headings, real alt text, visible focus states,
keyboard navigation, and — because this is also a podcast — transcripts/captions available for
audio. An inaccessible cozy site is a contradiction in terms here.

**5. This is a public, production site, so secrets and surface area matter.**
Only ever use the Supabase **anon** key on the client; the service-role key must never reach
front-end code or the repo. Secrets live in `.env.local` (gitignored), never in source. The
Netlify config ships strict security headers and a Content-Security-Policy on purpose — if you
add a new external script, font, image host, or API, you must update the CSP `connect-src` /
`script-src` accordingly, or it will silently break in production while working locally.

**6. Minimum blast radius.**
The live app is one subdirectory inside a noisy repo, and a single visitor-facing brand depends
on it. Solve the specific task and resist touching unrelated files — every stray change is
untested surface area on a site real people visit. Prefer the smallest change that fully solves
the problem.

**7. Trust the running code over the written word.**
This repo has a documented history of *confidently wrong* docs (a previous CLAUDE.md even
described an entirely different project). Reports here are timestamped snapshots that rot.
So: verify claims against the actual code, config, and a fresh test run before you rely on
them — including the claims in *this* file. If something here contradicts what the repo
actually does, the repo wins; fix the doc.

---

## The content boundary (a hard rule, and the why behind it)

The root `content/` directory — especially `content/records/` — is the **canonical editorial
source of truth**, selected by governance decision D-02 (2026-06-11). It holds the authoritative
recipe and episode records.

- **Do not modify, generate, or overwrite anything in `content/records/`.** The website *reads*
  from it; it is a read-only source for the build and every projection.
- Corrections are versioned: they preserve prior versions in each record's `history` array,
  and only human-authored, approved changes may land. There is code that enforces this — the
  content-contract write boundary (`sunday-brunch-website/src/content-contract/`,
  `writeBoundary.js`) rejects writes from non-canonical sources.
- Why this is strict: editorial content is the brand. Letting a build tool, a CMS export, or an
  AI agent silently rewrite a recipe or episode would destroy authorship integrity and the audit
  trail. If a task seems to require editing canonical content, stop and ask a human — that work
  happens through the editorial process, not through code.
- Validate content with `node content/art-007-run.js` (see `content/README.md`).

### Authoring or reviewing podcast / blog content (the pre-work canon mandate)

If your task is to **write or edit creative content** — a podcast segment, a recipe page, a
headnote, a Sheltie box, an About-page memorial, or launch copy — or to **review/critique** that
work, **stop and read `Personas/CANON-INDEX.md` first** (or invoke the
`sunday-brunch-content-preflight` skill, which loads it for you). It is the canon map and preflight
reading list — characters, voice guides, timeline/continuity, and the recurring writing-issues to
avoid — for **both** the podcast and the blog, which must stay consistent with each other. Skipping
it is how the project drifts. This is separate from, and in addition to, the read-only
`content/records/` boundary above.

---

## Working in the app

All commands run **inside `sunday-brunch-website/`** (Node 18+):

```bash
npm install            # install dependencies
npm run dev            # Vite dev server on http://localhost:5178
npm run build          # production build to dist/
npm run preview        # serve the production build locally

npm test               # Vitest unit tests (run once)
npm run test:ui        # Vitest interactive UI
npm run test:coverage  # unit tests + coverage report
npm run test:e2e       # Playwright end-to-end suite
npm run test:e2e:ui    # Playwright in UI mode
npm run test:e2e:report# open the last Playwright HTML report

npm run validate:content  # content-record validation
```

For current test/coverage numbers, *run the suite* — don't quote a figure from a report file,
those go stale. (Older `AGENTS.md` / `@AGENT.md` files cite specific counts; treat them as
historical.)

**Environment variables** (in `sunday-brunch-website/.env.local`, copy from `.env.example`):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CONVERTKIT_FORM_ID`,
`VITE_CONVERTKIT_API_KEY`. Never commit real values.

---

## Code conventions (and why)

- **React 18, functional components and hooks only** — no class components, no Redux. Shared
  state is React Context (`src/contexts/AuthContext.jsx`, the achievement provider). The app is
  small enough that Context keeps things simple; reach for it, not a heavier state library.
- **Style to match the existing files: 4-space indentation, no semicolons.** Consistency beats
  personal preference here; a diff that only changes formatting is noise that hides real changes
  (see "minimum blast radius").
- **One CSS file per component**, imported by that component; class names kebab-case and scoped
  by feature. This keeps the heavy visual styling local and removable per-feature.
- **Routes are lazy-loaded** in `src/App.jsx` via `React.lazy` + `Suspense`, except the Home
  page which loads eagerly because it's the critical first paint. Add new pages the same way to
  protect the performance budget.
- **Centralize external calls** in `src/services/` (ConvertKit, sponsor) and `src/lib/`
  (Supabase client, analytics, web-vitals, logging). Don't scatter `fetch`/SDK calls through
  components — it makes them untestable and the CSP harder to reason about.
- **Use the logger** (`src/lib/logger.js`), not bare `console.*`. Production builds strip
  `console.log`/`console.info`, so a raw console call may simply vanish in prod.

---

## Architecture map (so you can see past the one file you're editing)

Inside `sunday-brunch-website/src/`:

- `App.jsx` / `main.jsx` — app entry, routing, providers.
- `pages/` — route-level screens (Home, RecipePage, EpisodePage, MediaKit, Team, Profile, etc.).
- `components/` — reusable UI, including the whimsy layer (watercolor canvas, paw follower,
  sparkles, Giselle whisper/guestbook, achievement toaster).
- `contexts/` — Context providers (auth, achievements).
- `lib/` — cross-cutting helpers: `supabase.js`, `analytics.js`, `webVitals.js`, `seo.js`,
  `logger.js`, `ratings.js`, animation/visual utilities.
- `services/` — third-party integrations (`convertkit.js`, `sponsor.js`).
- `data/` — static content helpers and templates the site projects from.
- `content-contract/` — the enforced write boundary protecting canonical content.
- `tests/` — Vitest setup; unit tests are colocated as `*.test.{js,jsx}`.
- `e2e/` — Playwright specs (auth, home, navigation, newsletter, visual-parity).

Supporting context worth reading before nontrivial work: `ARCHITECTURE.md` (root) for the
intended content/data model and SEO/perf/a11y guardrails; `docs/architecture-sunday-brunch-website.md`,
`docs/development-guide-sunday-brunch-website.md`, and `docs/design-system.md`; and the active
specs/governance under `_bmad-output/`. Prefer the documents whose names end in
`-sunday-brunch-website`; the plain `-website` variants describe the *old* app.

---

## Reading this repository (canonical vs. disposable)

The root directory is noisy. To avoid being misled:

**Canonical / live:**
- `sunday-brunch-website/` — the deployed app.
- `content/` (esp. `content/records/`) — canonical editorial source of truth.
- `_bmad-output/` and the `*-sunday-brunch-website` files in `docs/` — current specs/governance.
- `netlify.toml` — the real deploy/security config.

**Historical, stale, or scratch — do not treat as current, and don't "fix" them as part of a task:**
- The 100+ root reports (`PHASE*_*.md`, `*_REPORT.md`, `*_AUDIT*.md`, `SPRINT*_*.md`,
  `*_SUMMARY.md`, comparison/diff write-ups, etc.) are point-in-time snapshots that have rotted.
- `tmpclaude-*-cwd` files and stray `tmp*` artifacts are scratch; ignore them.
- `website/` and `backend/` are earlier, abandoned versions of the app (last touched Dec 2025).
  The root-level `src/` and root `package.json` (a serverless stub) are likewise not the live app.
- Multiple agent configs (`.codex/`, `.gemini/`, `.cursor/`, `.agent(s)/`, `_bmad/`) and the
  duplicate `AGENTS.md` / `@AGENT.md` exist for other tools and contain dated facts; mine them
  for history, don't trust their numbers.

This list is descriptive, not a cleanup instruction — leave these files alone unless explicitly
asked to clean them up.

---

## When you're unsure

Ask which principle is at stake, not which rule. If a change would shrink the magic, spend the
performance budget, weaken a test, reduce accessibility, touch canonical content, or expand the
blast radius beyond the task — pause and reconsider, and raise the tradeoff with a human rather
than guessing. The maintainer would rather answer a question than discover an unrequested
"improvement" on a live, visitor-facing site.
