# Editorial Policies

## Audience-Facing Architecture

Content pillars:

1. The Sunday Table
2. Recipes From Giselle's Kitchen
3. Tales From the Kitchen
4. The Sunday Brunch Podcast
5. Friends At Our Table
6. The Gentle Kitchen

Production streams:

1. Cook With Stacey and Giselle
2. Sunday Brunch Podcast
3. Notes From the Shelties
4. Stories From Our Table
5. Friends At Our Table

Every content item declares one primary pillar, one production stream, one user purpose, one owner, and relevant recipe, episode, character, collection, or campaign links.

Friends At Our Table is reserved future direction. Phase 0 defines its taxonomy but does not solicit content.

Approval status: accepted unchanged by Stacey on 2026-06-11. Evidence: `evidence/ART-002-product-direction-approval.md`.

## Recipe Quality Checklist

A production recipe cannot be approved until evidence exists for every applicable item.

Identity and authority:

- Clear title and outcome summary
- Named author, tester, reviewer, approver, and owner
- Test date, revision state, update history, and source evidence
- Primary pillar, production stream, collections, and relationships

Cooking contract:

- Prep, cook, and total time
- Yield, difficulty, equipment, and pan or vessel details
- Structured ingredient groups and ordered instructions
- Scaling and unit-conversion rules tested where enabled
- Allergens and dietary disclosures reviewed
- Pet-safe kitchen note where directly relevant

Confidence:

- Why-this-works evidence
- Sensory checkpoints
- Common mistakes and recovery
- Tested substitutions with expected effects
- Storage, freezing, reheating, make-ahead, transport, and gifting guidance where applicable
- Hero photography and process photography where uncertainty is high

Usability and truth:

- Standard labels carry essential information
- Character guidance is optional, useful, and canon-compliant
- Measurements, warnings, and safety remain under human authority
- Print, copy, scale, and mobile presentation requirements are documented for later implementation
- Placeholder, prototype, and unverified material is labeled and cannot be approved for public release
- Media has alt text, provenance, rights, and approved uses

Approval record:

- Checklist result, failed items, evidence links, reviewer, Stacey approval, and next revision

ART-008 approval:

- Status: accepted
- Owner, reviewer, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: ART-009 must apply this checklist to a representative recipe; checklist approval alone is not recipe acceptance

## Episode Brief

Every episode begins with:

- Working title, episode ID, owner, target release window, and status
- Primary pillar and production stream
- Cooking objective and featured recipe or article
- Human emotional thread
- Primary comic engine
- Cast and current canon version
- Character purpose by scene or segment
- Factual, recipe, safety, grief, consent, or rights sensitivities
- Subjects reserved for Stacey's human voice
- Required source material and rights
- Intended duration and format
- Audience takeaway
- Companion content and one clear next action
- Accessibility and transcript plan
- Approval by Stacey before script production

ART-010 approval:

- Status: accepted
- Owner, producer, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: ART-012 must apply the brief to a representative episode; brief approval alone is not episode-package acceptance

## Episode Release Checklist

Editorial:

- Approved brief and final script
- Recipe, factual, safety, character, and sensitive-content review
- Stacey approval of every final character line
- No invented memories or unlabeled fictional claims

Performance and audio:

- Source recordings and generated assets stored separately
- Voice-asset register complete
- Edited dialogue and mastered release traceable to the script
- Music and effects rights recorded
- Human listening review complete

Audience package:

- Title, summary, date, duration, artwork, cast, credits, show notes, and chapters
- Corrected speaker-labeled transcript
- Featured recipe or companion article
- Podcast-host record and app or download fallback
- AI-performance disclosure
- One clear next action
- Accessibility review

Release and archive:

- Metadata and social copy approved
- Release copy and identifiers recorded
- Scheduled or published state approved
- Source, master, transcript, artwork, metadata, and rights records backed up
- Correction, rollback, and withdrawal owner identified

ART-011 approval:

- Status: accepted
- Owner, release reviewer, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: ART-012 must apply the brief and release checklist to a representative episode package; checklist approval alone is not release acceptance

## Correction And Revision Policy

Report channels:

- Internal quality review
- Audience correction contact
- Rights or consent request
- Safety or accessibility incident

Severity:

- `S1 Critical`: credible safety, legal, consent, rights, or materially harmful error. Withdraw or disable affected content immediately pending review.
- `S2 Major`: instructions, measurements, attribution, transcript, disclosure, or media error that can materially mislead. Correct promptly and add a visible notice where audience action may be affected.
- `S3 Minor`: clarity, spelling, formatting, metadata, or non-material continuity issue. Correct in the next controlled revision.

Required correction record:

- Subject ID and affected version
- Reporter and date
- Severity and rationale
- Immediate containment
- Accountable owner and approver
- Evidence and investigation
- Corrected version and changed fields
- Public notice or explanation
- Rollback, withdrawal, restoration, or no-action decision
- Related episode, recipe, campaign, or asset impact
- Closure date and prevention action

No published version is silently overwritten. Corrections preserve history and create a new version.

ART-013 approval:

- Status: accepted
- Owner, correction coordinator, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: ART-014 must exercise an S1 or S2 case with preserved history and closure evidence; policy approval alone is not correction-process acceptance

## AI-Performance Disclosure

Approved audience-facing wording:

> The Shelties are authored characters performed with synthetic voices created using AI tools. Stacey writes, directs, edits, and approves every published performance. Giselle's character is inspired by the real Giselle and created in her honor; it is not presented as her literal consciousness.

Placement requirements:

- Available on podcast and character information pages.
- Included on every episode page.
- Included in durable show notes or feed metadata.
- Placed near any standalone character-audio player.
- Included in transcripts when context requires it.
- Available as accessible text rather than only as audio, an image, a tooltip, or inaccessible metadata.

The disclosure does not need to interrupt every scene or joke. Material changes require a new version and Stacey's approval.

Approval: Stacey, 2026-06-11. Rights basis: ART-016.

## AI Voice Use Policy

Allowed:

- Podcast episodes, website audio, optional cooking-companion audio, and project-related promotional clips.
- Monetized or sponsored Sunday Brunch content with the approved disclosure.
- Internal testing, editing, backup, restoration, and archival.
- Merchandise or third-party media only after a fresh rights review approves that use.

Prohibited:

- Cloning an identifiable person without documented authorization and separate rights approval.
- Imitating a named actor, performer, public figure, or other identifiable person.
- Presenting a character voice as real human speech or as a dog's literal consciousness.
- Character delivery as the sole authority for human-voice-only subjects.
- Unsupervised generation or publication.
- Reusing a voice outside its assigned character without a new approval.
- Selling, sharing, sublicensing, or transferring a voice model.
- Enabling provider training without a later explicit decision recorded in `.decision-log.md`.

The ElevenLabs content-training opt-out must be enabled by default.

## AI Voice Production Model Policy

- Production plan: paid ElevenLabs Creator.
- Voice creation: Voice Design model `eleven_ttv_v3`.
- Final character performances: `eleven_v3`.
- Stability fallback: `eleven_multilingual_v2`, subject to Stacey's listening approval.
- Flash models: previews only; they cannot produce release masters.
- Each selected character voice records its voice ID and settings.
- A voice substitution creates a new version and requires Stacey's approval.

## AI Voice Asset Register

Each generated performance records:

- Asset ID and character
- Provider, model, license, and account owner
- Approved voice specification and settings
- Script ID, script version, and canon version
- Generation date and generated source file
- Editor, edits, edited dialogue file, and master references
- Human listener and Stacey approval
- Rights status and permitted uses
- Published episode, page, campaign, or other use
- Disclosure version
- Archive and backup locations
- Incident, correction, withdrawal, or replacement history

## AI Incident Policy

Trigger: unsafe, inaccurate, inappropriate, infringing, deceptive, out-of-character, unapproved, or untraceable performance.

Response:

1. Stop publication or withdraw the affected use.
2. Preserve the asset, script, settings, logs, and published version as evidence.
3. Assign severity and owner.
4. Review factual, safety, canon, rights, and disclosure impact.
5. Correct, replace, or permanently withdraw.
6. Update affected transcript, show notes, pages, feeds, and campaigns.
7. Record audience notice where material.
8. Close only after Stacey approves the resolution and prevention action.
