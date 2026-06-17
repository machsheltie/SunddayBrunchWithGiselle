# ART-016 AI Voice Provider And Rights Audit

Artifact status: `draft`

Decision status: `D-04 closed`

Owner, rights reviewer, and approver: Stacey

Review date: 2026-06-11

## Approved Provider Direction

Stacey approved the following on 2026-06-11:

- Use a paid ElevenLabs plan and Voice Design for all four Shelties.
- Create original synthetic character voices rather than clones of identifiable people.
- Treat named actors or performers in creative references as mood, pacing, or performance references only. They are not imitation targets.
- Do not activate PlayHT or another fallback provider without a new availability and rights audit.
- Recheck provider terms before the first public release and whenever the provider, plan, model, or intended commercial use changes.

PlayHT cannot currently serve as a fallback. Its official terms page stated on 2026-06-11 that the service had shut down. Any future PlayHT use requires proof that service has resumed and a fresh audit.

## Current Terms Findings

ElevenLabs terms reviewed:

- Terms of Service, last updated March 31, 2026: https://elevenlabs.io/terms-of-use
- Prohibited Use Policy, reviewed June 11, 2026: https://elevenlabs.io/use-policy

Findings:

- Commercial use requires a paid plan and remains subject to the terms and Prohibited Use Policy.
- Stacey retains rights in generated output as between Stacey and ElevenLabs, subject to the provider terms.
- Input, output, and any user voice model grant ElevenLabs broad service and improvement licenses. The account provides a content-training opt-out, but prior uses are not reversed.
- A user voice model may use only Stacey's voice or a voice Stacey is authorized to provide.
- Stacey must hold all rights needed for every input and output.
- Unauthorized, harmful, or deceptive impersonation is prohibited.
- Provider terms and supplemental terms may change and must be rechecked before release.

Fallback source reviewed:

- PlayAI end-user terms, last updated July 10, 2025 and reviewed June 11, 2026: https://play.ht/terms/
- The page states that the service has shut down. PlayHT is therefore unavailable and unapproved.

## Character Audit Matrix

| Character | Provider and method | Voice specification authority | Human voice clone | Actor imitation | Commercial status | Remaining evidence |
|---|---|---|---|---|---|---|
| Giselle | Creator plan; Voice Design with `eleven_ttv_v3`; release with `eleven_v3` | `character-canon.md` | Prohibited | Prohibited | Policy approved; publication requires D-05 and complete asset record | Record voice ID, settings, generation date, listening approval, and terms version |
| Phaedra | Creator plan; Voice Design with `eleven_ttv_v3`; release with `eleven_v3` | `character-canon.md` | Prohibited | Prohibited | Policy approved; publication requires D-05 and complete asset record | Record voice ID, settings, generation date, listening approval, and terms version |
| Tiana | Creator plan; Voice Design with `eleven_ttv_v3`; release with `eleven_v3` | `character-canon.md` | Prohibited | Prohibited | Policy approved; publication requires D-05 and complete asset record | Record voice ID, settings, generation date, listening approval, and terms version |
| Havok | Creator plan; Voice Design with `eleven_ttv_v3`; release with `eleven_v3` | `character-canon.md` | Prohibited | Prohibited | Policy approved; publication requires D-05 and complete asset record | Record voice ID, settings, generation date, listening approval, and terms version |

## Controls Already Approved

- Stacey owns the provider account, generated assets, approvals, and archive records, subject to provider terms.
- AI-generated dialogue remains a draft until Stacey approves it against the active canon.
- Stacey's human voice remains mandatory for the subjects listed in `character-canon.md`.
- No voice may be represented as a real person's speech or as the literal consciousness of a dog.
- No generated asset may publish without provenance, rights status, listening approval, and the approved disclosure.
- ElevenLabs content-training opt-out must be enabled unless Stacey later approves and records a change.

## Approved Use Matrix

Allowed:

- Podcast episodes and website audio.
- Optional cooking-companion audio.
- Project-related promotional clips.
- Monetized or sponsored Sunday Brunch content with required disclosure.
- Internal testing, editing, backup, restoration, and archival.
- Merchandise or third-party media only after a fresh rights review approves that use.

Prohibited:

- Cloning an identifiable person without documented authorization and a separate rights approval.
- Imitating a named actor, performer, public figure, or other identifiable person.
- Presenting a character voice as real human speech or as a dog's literal consciousness.
- Using a character voice as the sole delivery for human-voice-only subjects.
- Unsupervised generation or publication.
- Reusing a voice outside its assigned character without a new approval.
- Selling, sharing, sublicensing, or transferring a voice model.
- Enabling provider training without a later explicit decision recorded in the decision log.

## Approved Production Model Policy

- Use the paid ElevenLabs Creator plan for production.
- Create original voices with Voice Design model `eleven_ttv_v3`.
- Generate final character performances with `eleven_v3`.
- Use `eleven_multilingual_v2` only as a stability fallback after Stacey's listening approval.
- Use Flash models for previews only, never as release masters.
- Record each character's voice ID and settings after selection.
- Treat any voice substitution as a new version requiring Stacey's approval and an updated asset record.

Official documentation reviewed:

- Models: https://elevenlabs.io/docs/overview/models
- Pricing: https://elevenlabs.io/pricing

## Open Items Before ART-016 Acceptance

- Record the selected voice ID, settings, generation date, model, plan, and listening approval for each character.
- Record proof that the ElevenLabs content-training opt-out is enabled.
- Recheck all applicable provider and supplemental terms immediately before first public release and record the terms version and review date.
- Record each voice's rights status and permitted uses.
- Resolve or escalate any likeness, trademark, publicity-right, or voice-cloning concern to qualified counsel.

D-05 disclosure approval is complete through accepted ART-015.

## Completion Register

| Requirement | Giselle | Phaedra | Tiana | Havok |
|---|---|---|---|---|
| Voice ID and settings | Pending | Pending | Pending | Pending |
| Creator plan and production model recorded | Pending | Pending | Pending | Pending |
| Generation date | Pending | Pending | Pending | Pending |
| Rights status and permitted uses | Pending | Pending | Pending | Pending |
| Stacey listening approval | Pending | Pending | Pending | Pending |

Shared controls:

- Content-training opt-out evidence: pending
- Pre-release terms recheck and versions: pending
- Unresolved likeness, trademark, publicity-right, or cloning concerns: pending review
- Stacey final approval: pending

## Evidence-Contract Approval

- Completion contract status: approved
- Contract owner, rights reviewer, and approver: Stacey
- Approval date: 2026-06-12
- Boundary: contract approval does not accept ART-016 or prove that production voices, settings, opt-out evidence, pre-release terms review, or listening approvals exist

## Acceptance Decision

ART-016 remains unaccepted because the four production voice IDs, settings, and completion evidence do not yet exist. D-04 is closed; its provider, use, and production-model policies may not be changed silently.
