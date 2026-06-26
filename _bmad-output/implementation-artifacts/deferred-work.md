# Deferred Work

## REC-001 French Silk Pie — render a "Read This First" safety section on the page
**Surfaced by:** spec-french-silk-pie-pasteurized-eggs review (2026-06-26), edge-case + blind reviewers.
**Issue (pre-existing, not caused by the pasteurized-egg change):** the egg ingredient note says "see Read This First", but the website projects/renders no Read-This-First or safety section (`recipes.js` has no such field; `RecipeTemplate.jsx` no such block). The Recipe-Writing-Guide mandates a top-of-page "Read This First" carrying the safety note in Stacey's voice. On the live page that pointer currently resolves to nothing (the "or use the cooked-egg method" half still works via Notes).
**Mitigation already shipped:** step 5 now states the raw-egg/pasteurized safety payoff explicitly in Stacey's voice, so the page no longer depends solely on the missing section.
**Scope to do later:** add a `readThisFirst`/safety field to the canon record schema + project it in `recipes.js` + render it in `RecipeTemplate.jsx` (top of page, print-visible) + tests. Decide whether to also add the vulnerable-population caveat (pregnant/elderly/immunocompromised/young children) per standard raw-egg guidance.
