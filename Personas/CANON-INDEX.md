# READ FIRST — Sunday Brunch Canon Index

*The map of every source-of-truth file for **both** the podcast and the blog/recipe pages, and the
reading you must do **before** writing or editing any creative content. If you are about to author or
revise a podcast segment, a recipe page, a headnote, a Sheltie box, a memorial, or launch copy —
start here. Writing without these is how the project loses consistency; this index exists to make
that impossible by accident.*

> **THE RULE:** Read the **Always** set plus the relevant **per-surface** set below *before* drafting.
> Run the **post-write checks** before anything is called final. The bibles and the canon records win
> over any other document, including this one.
>
> The **`sunday-brunch-content-preflight`** skill loads this index and the right reading set
> automatically whenever a writing or review task begins; the **`prepublish-editorial-pass`** skill is
> the post-write gate. This index is the human-readable map behind both.

---

## The two surfaces (one canon underneath)

The **podcast** (audio scripts in `Episodes/`) and the **blog/recipe pages** (`content/`, the site)
are two deliveries of the **same** characters, voice, and canon. They must agree. Both derive from the
Personas bibles and the canon records; neither is allowed to drift from them.

---

## Preflight reading

### ALWAYS (every creative task — podcast or blog)
- `Personas/Character-Bible-Stacey-DRAFT.md` — who Stacey is (voice, history, the public/private self, banned-word list).
- `Personas/Character-Bible-The-Pack-DRAFT.md` — the four Shelties (essence, range, the "laugh→melt→love" goal, Giselle's mask-slip/Effie register, the family cross-talk rules).
- `Personas/Canon-Timeline-WORKING.md` — life spans + the **30-second continuity check** (run it; it's what stops a dog being misplaced in time).
- `Personas/writing-issues/` — the logged recurring problems to **actively avoid** while drafting:
  - `signature-phrase-echo.md` — don't multiply "started everything / all of this" or "too much."
  - `texture-metaphor-crowding.md` — "cloud" belongs to Tiana; don't double up silk/satin/mousse/velvet across surfaces.

### FOUNDATIONAL / origin concept (read for brand intent — dated, but it holds the *why*)
Superseded on operational detail by the bibles and guides, but these carry the original vision that
everything else serves — the brand promise, the tagline, the worldbuilding motifs, the positioning:
- `Pre-planning/Concept.txt` — the original podcast concept (format, cast, audience, "Lamb Chop for grownups").
- `Pre-planning/Promo.txt` — the public-facing pitch: tagline, elevator description, cast one-liners, the brand promise ("coziness with a sparkle of sarcasm"; "more glitter, and Shelties who talk back").
- `Pre-planning/worldbuilding.txt` — the sensory world + recurring motifs (kitchen as sanctuary, baking-as-alchemy, food as a love language, the Shelties as a microcosm of humanity).

*(For review tasks especially: these are the yardstick for "does this still honor the original promise?")*

### PODCAST segment — also read
- `Episodes/SCRIPT-VOICE-GUIDE.md` — how to write the audio scripts (the Deb/Kenji two-host dynamic, de-purpling, the whimsy + wit guardrails, audio craft).
- `Episodes/Final Scripts/` — the already-finalized segments of the same episode, so voice, motifs, and running jokes stay consistent and you don't repeat a phrase that's another segment's home.
- The episode's canon record in `content/records/episodes/` (e.g. `EP-001-the-first-sunday.json`) — **read-only canon.**

### BLOG / RECIPE page — also read
- `Personas/Recipe-Story-Guide.md` — writing the headnote/story.
- `Personas/Recipe-Page-Sheltie-Segments-Guide.md` — the four Sheltie boxes + the family/equity rules.
- `Personas/Recipe-Writing-Guide.md` — the recipe itself (clarity-first, the faithfulness rule).
- The recipe's canon record in `content/records/recipes/` (e.g. `REC-001-french-silk-pie.json`) — **read-only canon.**

### TENDER / memorial / dedication content — also read
- `Personas/About-Page-Memorials-and-Dedication-DRAFT.md` — the "For Giselle" page voice and boundaries (human-voice-only; dogs never narrate a real memory; grief gentle, no medical detail).

---

## The read-only canon (never edit directly)
`content/records/` is the **editorial source of truth** (governance D-02) and is **read-only** to
writers and agents — the content-contract write boundary rejects non-canonical writes. Corrections to
canon (e.g. a recipe time, a sugar term) happen through **Stacey's human editorial process**, never by
an agent editing the JSON. When you spot a canon error, **flag it for Stacey**; don't fix it in place.

---

## Post-write checks (before anything is "final")
1. **Continuity:** run the 30-second check in `Canon-Timeline-WORKING.md` (no dog out of its lifespan; ages/kinship right).
2. **Writing-issues watch:** scan against each open issue in `Personas/writing-issues/`.
3. **Banned words / voice:** check against the Stacey bible's AI-tell + banned-word list.
4. **Cross-surface consistency:** does this agree with the canon record and the other surface (blog ↔ podcast)?
5. **The `prepublish-editorial-pass` skill** is the enforced gate for recipe/episode entries — run it before publish.

---

## Full file map

**Characters (canon — the bibles win):**
- `Personas/Character-Bible-Stacey-DRAFT.md` — Stacey (DRAFT, canonical-on-approval).
- `Personas/Character-Bible-The-Pack-DRAFT.md` — the four Shelties + departed/guest lineage (DRAFT, canonical-on-approval).
- `Personas/Character-Notes-WORKING.md` — raw interview capture / brainstorm the bibles are built from (WORKING — mine for detail; bibles are the synthesis).
- `Personas/Stacey.*`, `Giselle.*`, `Havok.*`, `Phaedra.*`, `Tiana.*`, `staceysguide.*` — **raw original source material**; superseded by the `.md` bibles. Mine for detail, but the bibles are canon.

**Voice & format guides:**
- `Episodes/SCRIPT-VOICE-GUIDE.md` — podcast scripts (how-to; points back here).
- `Personas/Recipe-Story-Guide.md` — blog headnote/story.
- `Personas/Recipe-Page-Sheltie-Segments-Guide.md` — blog Sheltie boxes + family rules.
- `Personas/Recipe-Writing-Guide.md` — the recipe itself.

**Continuity & quality:**
- `Personas/Canon-Timeline-WORKING.md` — chronology + continuity check.
- `Personas/writing-issues/*.md` — logged recurring patterns to avoid.

**Tender / about:**
- `Personas/About-Page-Memorials-and-Dedication-DRAFT.md` — the "For Giselle" dedication + memorials.

**Canon records (READ-ONLY):**
- `content/records/recipes/` — recipe records (e.g. `REC-001-french-silk-pie.json`).
- `content/records/episodes/` — episode records (e.g. `EP-001-the-first-sunday.json`).

**Foundational concept (origin — dated; brand intent, not operational canon):**
- `Pre-planning/Concept.txt`, `Pre-planning/Promo.txt`, `Pre-planning/worldbuilding.txt` — original concept, public pitch, and worldbuilding motifs.

**Working drafts / output:**
- `Episodes/Final Scripts/` — finalized podcast segment scripts (the canonical script source).
- `Episodes/Episode 1/`, `Episodes/Episode1_*_RETOOL.md` — podcast working drafts.
- `docs/editorial-drafts/` — blog/recipe working drafts.

---

## Maintenance
When a new canon file, guide, or writing-issue is added, **add it here in the same commit**, and add a
pointer to it from the relevant entry-point guide. An index that goes stale recreates the exact problem
it was built to prevent.
