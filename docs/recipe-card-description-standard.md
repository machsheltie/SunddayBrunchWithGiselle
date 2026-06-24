# Recipe Card Description Standard — Sunday Brunch With Giselle

*A small standard, in the spirit of our voice guides: it exists so that the
unexpanded recipe card actually tells a visitor **what the recipe is** — before
they ever click "View Full Recipe."*

---

## The one rule above all

**The card blurb describes the dish, not the story.**

The unexpanded featured card (and the page's SEO meta description) leads with one
short line. That line answers a hungry, scanning visitor's only question: *what
is this, and do I want to make it?* It is **not** the opening sentence of the
recipe's story.

> **Litmus test:** read the line with no other context. If a stranger searching
> for dessert would learn what the dish is, it passes. If they'd roll their eyes
> ("…okay, but what *is* it?"), it fails.

**Before (the story hook — wrong):**
> "The first French Silk Pie I ever made was a bribe."

**After (the dish — right):**
> "A cold, silky, mousse-like chocolate pie in a flaky crust under sweetened
> whipped cream and chocolate shards."

The story is still the star — it lives in the expanded card and on the recipe
page. It just isn't the *card blurb*.

---

## Where the text comes from

The card blurb is the canonical record's **`summary`** field
(`content/records/recipes/<id>/REC-*.json`), projected to `recipe.description`
(`src/lib/content.js`). The card uses `recipe.description` and only falls back to
the story excerpt if a record is missing its summary — which the guard below
won't allow for published recipes.

Because `summary` is **canonical content**, it is authored and approved through
the editorial process (governance D-02), never generated or edited by a build
tool or an agent. See `CLAUDE.md` → "The content boundary."

---

## The standard (what a good `summary` looks like)

1. **Describes the dish.** Lead with what it *is* — form, texture, key flavors
   ("a cold, silky, mousse-like chocolate pie…"). Nouns and adjectives about the
   food, not narrative.
2. **One sentence, one line.** No line breaks. It has to sit on a card and inside
   a `<meta name="description">`.
3. **Length: 40–160 characters.** Long enough to be informative, short enough for
   a card and SEO snippet (search engines truncate ~155–160). French Silk = 109.
4. **No story reuse.** It must not be the story's opening line (the regression
   this standard guards against).
5. **On-brand, lightly.** Warm and appetizing is welcome; precious is not. Match
   blog-Stacey: "say the delicious thing plainly." Skip "the most decadent,
   life-changing, impossibly rich…" stacking.

### Quick checklist for a new recipe

- [ ] `summary` present in the record
- [ ] Reads as "what the dish is," passes the litmus test
- [ ] 40–160 characters, single line
- [ ] Not the story's first line
- [ ] Appetizing without overselling

---

## How it's enforced

A guard test runs the rules above over every projected recipe:

- Validator: `src/lib/recipeDescriptionStandard.js` (`validateRecipeDescription`)
- Test: `src/tests/lib/recipeDescriptionStandard.test.js`

If a recipe's `summary` is missing, too short/long, multi-line, or duplicates its
story opening line, the test fails. **Fix the record's `summary` to meet this
standard — do not weaken the test.** (Tests are the contract; see `CLAUDE.md`.)

If the standard itself needs to change (e.g. different length bounds), update the
bounds in the validator, this document, and the test together, and say why.
