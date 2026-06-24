---
name: sunday-brunch-content-preflight
description: Use BEFORE writing, editing, or reviewing/critiquing ANY Sunday Brunch With Giselle creative content — a podcast segment or episode script, a blog post, a recipe, a recipe headnote/story, a Sheltie character box, an About-page memorial or dedication, or launch/social copy. Loads the canon preflight (the CANON-INDEX, the character bibles, the voice/format guides, the timeline/continuity check, and the logged writing-issues) so every piece stays consistent and correct across the podcast and the blog. Also use when asked to run a critic, humanizer, prose, or consistency review of that work — e.g. "have my prose critic and humanizer review this," "check this for AI tells," "review our work for consistency," or "write / draft the next segment."
---

# Sunday Brunch — Content Preflight

The podcast and the blog are two deliveries of the **same** characters, voice, and canon, and they
must agree. This skill loads the right source-of-truth before any writing or review, so consistency
is the default instead of something rediscovered every time. It is the **pre-work** counterpart to
the `prepublish-editorial-pass` skill (the post-work gate).

**Do this before you draft or critique a single line.** If you skip it, you will drift.

## 1. Read the map
Read **`Personas/CANON-INDEX.md`** in full. It is the index of every source-of-truth file and the
authoritative version of the reading lists below. If it and this skill ever disagree, the index wins.

## 2. Load the ALWAYS set (every task — podcast or blog)
- `Personas/Character-Bible-Stacey-DRAFT.md` — Stacey's voice, public/private self, and her **banned-word / AI-tell list**.
- `Personas/Character-Bible-The-Pack-DRAFT.md` — the four Shelties: each one's essence and range, Giselle's **laugh→melt→love** goal + Effie mask-slip register, and the family cross-talk rules.
- `Personas/Canon-Timeline-WORKING.md` — life spans + the **30-second continuity check** (run it; it's what keeps a dog from being misplaced in time — e.g. Giselle was NOT alive for the 2009/original bake; Athena was).
- `Personas/writing-issues/signature-phrase-echo.md` and `texture-metaphor-crowding.md` — the recurring patterns to actively avoid (origin-tagline / "too much" over-repetition; "cloud" belongs to Tiana; don't double silk/satin/mousse/velvet).
- `Pre-planning/Concept.txt`, `Pre-planning/Promo.txt`, `Pre-planning/worldbuilding.txt` — **origin / brand context (dated):** the brand promise, tagline, and worldbuilding motifs everything serves. Mine for voice and positioning, not operational detail (the bibles/guides win there). For review tasks, the yardstick for "does this still honor the original promise?"

## 3. Load the per-surface set
**Podcast segment / episode script** — also read:
- `Episodes/SCRIPT-VOICE-GUIDE.md` — the audio craft rubric (Deb/Kenji two-host dynamic, de-purpling, the whimsy + wit guardrails, two-sides-of-one-coin, full-range/mutual-seeing, audio craft).
- `Episodes/Final Scripts/` — the already-finalized segments of the same episode, so voice, motifs, and running jokes stay consistent and you don't reuse a phrase that is another segment's home.
- The episode's canon record in `content/records/episodes/` (read-only).

**Blog / recipe page** — also read:
- `Personas/Recipe-Story-Guide.md` (headnote/story), `Personas/Recipe-Page-Sheltie-Segments-Guide.md` (the Sheltie boxes + family/equity rules), `Personas/Recipe-Writing-Guide.md` (the recipe itself).
- The recipe's canon record in `content/records/recipes/` (read-only) — its `story.body` is the canonical headnote.

**Tender / memorial / dedication** — also read:
- `Personas/About-Page-Memorials-and-Dedication-DRAFT.md` — human-voice-only; the dogs never narrate a real memory; grief stays gentle (no medical detail).

## 4. If the task is a REVIEW / critique / humanizer pass
Load everything above, **plus**:
- The exact draft under review, and its consistency anchors (the canon record's `story.body`, and any already-finalized segment of the same episode).
- Grade against: the relevant guide(s); the Stacey **banned-word list**; the two **writing-issues**; and the standing AI-tell patterns prior passes caught — em-dash density, the setup→dash→ironic-reversal template, triad/rule-of-three stacking, anthropomorphized-ingredient over-budget, signature-phrase echo, tidy-summary closings.
- Respect file status: the bibles are canon-on-approval, `content/records/` is immutable canon, and any `.txt`/early scratch drafts are **superseded** — don't grade against those.

## 5. Hard rules that always apply
- **`content/records/` is read-only.** If you find a canon error (a time, a sugar term, a name), **flag it for Stacey**; never edit the JSON. Corrections go through her editorial process.
- **Stacey holds all authority** — safety, allergens, raw-egg/temperature calls, real memories, and the final recipe word are always hers; the dogs joke and explain *around* these, never override them.
- **Real memories of the real dogs are human-voice-only.** The dogs never narrate a real memory; Giselle's passing is never blog content.

## 6. After writing (hand off to the gate)
When a recipe/episode entry is drafted, run the **`prepublish-editorial-pass`** skill and
`npm run lint:editorial` (from `sunday-brunch-website/`) before anything is called final.

## Maintenance
If a canon file, guide, or writing-issue is added or moved, update `Personas/CANON-INDEX.md` (and
this skill's lists if needed) in the same change. A stale preflight recreates the drift it prevents.
