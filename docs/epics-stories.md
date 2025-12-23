Epics and Stories (MVP Kick-off)
===============================

Epic 1: Recipe Content Delivery
- Story: Render recipe template (story + structured recipe)
  - AC:
    - Displays title, hero image, optional story body.
    - Structured block includes ingredients list, steps, time(s), yield.
    - Uses semantic headings/lists; keyboard/screen-reader friendly.
- Story: Jump-to-recipe anchor
  - AC:
    - “Jump to recipe” button focuses recipe heading/anchor.
    - Works with keyboard and screen reader.
- Story: Tools-used block w/disclosure
  - AC:
    - Renders list of items (name + link + category tag).
    - Displays affiliate disclosure adjacent.
    - Links open in new tab; keyboard accessible.
- Story: Print-friendly view
  - AC:
    - Print hides nav/noise; shows ingredients/steps/time/yield, tools-used.
    - Layout fits A4/Letter; legible on b/w.
- Story: Save/Print/Share actions
  - AC:
    - Print triggers print stylesheet; share provides link/social/email; accessible controls.
    - Save/bookmark optional; if omitted, hide control.
- Story: Copy ingredients
  - AC:
    - Button copies ingredient list; shows confirmation; works on desktop/mobile.
- Story: Related/Seasonal modules
  - AC:
    - Renders cards for related recipes/episodes/collections when provided.
    - Hides gracefully if empty.
    - Cards are keyboard/touch accessible.

Epic 3: CTAs & Email Capture
- Story: CTA component (ConvertKit)
  - AC:
    - Shows value copy: “Get recipes, Sunday letters, early drops.”
    - Email field with label/placeholder; submit button.
    - Accessible form (labels, focus, error/success states).
    - On success: confirmation message; on error: inline error.
    - Works inline on recipes/episodes and in footer/site-wide.
    - Uses env-driven formId; no secrets in client bundle.
- Story: Sponsor contact CTA (media kit page)
  - AC:
    - Form fields: name, email, message/requested bundle.
    - Accessible labels/states; confirmation on submit.
    - Displays allow/deny categories and inventory text on page.
    - Errors shown inline; success confirmation visible without page reload.

Optional (linking Episode epic if desired)
- Story: Audio player fallback linkage (impacts recipe pages that tie to episodes)
  - AC:
    - If audio present, inline player with basic controls.
    - Fallback links: “Listen in podcast app” and “Download audio.”
    - If player fails, message shows and transcript remains available.
