// Editorial lint for Sunday Brunch With Giselle recipe entries.
//
// Catches the *mechanical* recurring patterns the reviewers keep re-finding, so they
// stop being re-discovered each episode (see Personas/writing-issues/ for the rationale
// behind each rule). This is the deterministic gate; the judgment passes (critic,
// humanizer, continuity) live in the .claude/skills/prepublish-editorial-pass skill.
//
// Usage:
//   node scripts/editorial-lint.mjs            # lint every recipe record
//   node scripts/editorial-lint.mjs REC-001    # lint one record by id (or slug substring)
//
// Exit code: 1 only on schema-validation ERRORS. Everything else is a WARNING that a
// human/skill reviews before publish (some repetition — "too much", "silk" — is canon).

import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateRecord } from '../src/content-contract/index.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const websiteRoot = path.resolve(here, '..')
const repoRoot = path.resolve(websiteRoot, '..')
const recipesDir = path.join(repoRoot, 'content', 'records', 'recipes')
const draftsDir = path.join(repoRoot, 'docs', 'editorial-drafts')

// ---------------------------------------------------------------------------
// Rule config — extend these as new patterns recur (mirror Personas/writing-issues/).
// ---------------------------------------------------------------------------

// Phrases that should live in ONE hero spot. Warn if they appear across >1 surface.
// `info: true` = tracked but never warned (intentional brand repetition).
const PHRASE_RULES = [
    { label: 'origin tagline', re: /started (everything|all of this|it all)|that started (it all|everything)|the one that started/i, maxSurfaces: 1 },
    { label: '"too much" / "a bit much" hook', re: /\b(a bit much|too much)\b/i, info: true }
]

// Texture metaphors that should be "owned" by a single voice/surface (warn if on >1).
// `silk`/`silky`/`mousse`/`satin` are intentional/brand descriptors for this pie, so
// they are tracked-only (listed in TEXTURE_INVENTORY) but never warned.
const SIGNATURE_TEXTURES = ['cloud', 'velvet', 'pillowy', 'fluffy cloud']
const TEXTURE_INVENTORY = ['cloud', 'silk', 'silky', 'satin', 'satin-smooth', 'velvet', 'mousse', 'pillowy', 'creamy', 'cloud-soft']

// Story-guide banned "AI-tell" words.
const BANNED_WORDS = [
    'genuinely', 'testament', 'elevate', 'nestled', 'boasts', 'vibrant',
    'a perfect blend of', 'a symphony of', 'whimsical dance', 'tapestry'
]

// Em-dash caps per surface (rhythm guard; whole-page total also reported).
const EM_DASH_CAPS = { story: 6, _segment: 2, _default: 3 }

// Sheltie segment word-count ceilings (segments guide).
const SEGMENT_CEILINGS = { havok: 110, tiana: 85, phaedra: 140, giselle: 55 }

// Conscious, author-accepted exceptions: record id -> check types to downgrade from
// "warn" to "accept" (still shown, not counted). Keep a dated rationale next to each.
const ACCEPTED = {
    // REC-001 (author-accepted 2026-06-22):
    //  - length: the Sheltie boxes run over their ceilings on purpose — the cross-talk
    //    cut-ins and Tiana's signature tail-wag are worth the words.
    //  - em-dash: Havok's box keeps 3 em-dashes; his clipped-dispatch style earns them
    //    (reviewer-sanctioned defensible voice, not residue).
    'REC-001': ['length', 'em-dash']
}

// ---------------------------------------------------------------------------

const EM_DASH = /—/g
const countMatches = (text, re) => (text.match(new RegExp(re, re.flags.includes('g') ? re.flags : re.flags + 'g')) || []).length
const words = (text) => (text.trim().match(/\S+/g) || []).length
const normalize = (text) => text
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/["*_>#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const characterKey = (segment) => {
    const id = (segment.characterId || '').toLowerCase()
    if (id.includes('giselle')) return 'giselle'
    if (id.includes('phaedra')) return 'phaedra'
    if (id.includes('tiana')) return 'tiana'
    if (id.includes('havok')) return 'havok'
    return (segment.segment || 'segment').toLowerCase().split(/\s+/)[0]
}

const collectFiles = async (dir, ext) => {
    let entries
    try {
        entries = await readdir(dir, { withFileTypes: true })
    } catch {
        return []
    }
    const out = []
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) out.push(...await collectFiles(full, ext))
        else if (entry.isFile() && entry.name.endsWith(ext)) out.push(full)
    }
    return out
}

const sectionText = (md, headingRe) => {
    const lines = md.split('\n')
    const start = lines.findIndex((l) => headingRe.test(l))
    if (start === -1) return ''
    const rest = lines.slice(start + 1)
    const end = rest.findIndex((l) => /^#{1,2}\s/.test(l))
    return (end === -1 ? rest : rest.slice(0, end)).join('\n')
}

// Build the named "surfaces" of prose for a record (+ its draft, if found).
const buildSurfaces = (record, draftMd) => {
    const surfaces = {}
    if (record.story) surfaces.story = `${record.story.headline || ''}\n${record.story.body || ''}`
    if (record.summary) surfaces.summary = record.summary
    if (record.whyItWorks) surfaces.whyItWorks = record.whyItWorks
    for (const seg of record.characterSegments || []) {
        surfaces[`segment:${characterKey(seg)}`] = seg.body || ''
    }
    if (draftMd) {
        const marketing = sectionText(draftMd, /^#\s+Part 3/)
        if (marketing.trim()) surfaces.marketing = marketing
        const recipeIntro = sectionText(draftMd, /^##\s+The recipe/).split('\n').find((l) => l.trim().startsWith('*'))
        if (recipeIntro) surfaces['one-liner'] = recipeIntro
    }
    return surfaces
}

const lintRecord = (record, draftMd, draftFound) => {
    const errors = []
    const warnings = []
    const surfaces = buildSurfaces(record, draftMd)
    const allText = Object.values(surfaces).join('\n')

    // 1. Schema validation (the only ERROR-level check).
    const validation = validateRecord(record)
    if (!validation.valid) for (const e of validation.errors) errors.push(`schema: ${e}`)

    // 2. Phrase echo / signature-phrase crowding.
    for (const rule of PHRASE_RULES) {
        const hits = Object.entries(surfaces).filter(([, t]) => rule.re.test(t)).map(([k]) => k)
        const total = countMatches(allText, rule.re)
        if (rule.info) {
            if (total) warnings.push(`info: ${rule.label} appears ${total}x (intentional hook — not a problem unless it feels mechanical)`)
            continue
        }
        if (hits.length > (rule.maxSurfaces ?? 1)) {
            warnings.push(`phrase-echo: ${rule.label} appears across ${hits.length} surfaces (keep to ${rule.maxSurfaces ?? 1}): ${hits.join(', ')}`)
        }
    }

    // 3. Texture-metaphor crowding (signature textures should be owned by one surface).
    for (const tex of SIGNATURE_TEXTURES) {
        const re = new RegExp(`\\b${tex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i')
        const hits = Object.entries(surfaces).filter(([, t]) => re.test(t)).map(([k]) => k)
        if (hits.length > 1) warnings.push(`texture-crowding: "${tex}" appears on ${hits.length} surfaces (let one voice own it): ${hits.join(', ')}`)
    }
    const inventory = TEXTURE_INVENTORY.filter((t) => new RegExp(`\\b${t}`, 'i').test(allText))
    if (inventory.length) warnings.push(`info: texture words in play (eyeball for crowding): ${inventory.join(', ')}`)

    // 4. Banned AI-tell words.
    for (const w of BANNED_WORDS) {
        for (const [k, t] of Object.entries(surfaces)) {
            if (new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(t)) {
                warnings.push(`banned-word: "${w}" in ${k}`)
            }
        }
    }

    // 5. Em-dash density.
    let totalDashes = 0
    for (const [k, t] of Object.entries(surfaces)) {
        const n = (t.match(EM_DASH) || []).length
        totalDashes += n
        const cap = k === 'story' ? EM_DASH_CAPS.story : k.startsWith('segment:') ? EM_DASH_CAPS._segment : EM_DASH_CAPS._default
        if (n > cap) warnings.push(`em-dash: ${k} has ${n} em-dashes (cap ${cap}) — convert a few to commas/periods`)
    }
    if (totalDashes >= 12) warnings.push(`info: ${totalDashes} em-dashes across the page — consider a light whole-page sweep`)

    // 6. Segment word-count ceilings.
    for (const seg of record.characterSegments || []) {
        const key = characterKey(seg)
        const ceiling = SEGMENT_CEILINGS[key]
        if (!ceiling) continue
        const n = words(seg.body || '')
        if (n > ceiling) warnings.push(`length: ${key}'s box is ${n} words (ceiling ${ceiling}) — trim ${n - ceiling}`)
    }

    // 7. Record <-> draft sync (best-effort, warn-only).
    if (!draftFound) {
        warnings.push('sync: no editorial draft found for this record (skipped sync check)')
    } else {
        const draftNorm = normalize(draftMd)
        const checkPresence = (label, body) => {
            if (!body) return
            const n = normalize(body)
            const slice = n.slice(Math.max(0, Math.floor(n.length / 2) - 25), Math.floor(n.length / 2) + 25)
            if (slice.length >= 15 && !draftNorm.includes(slice)) {
                warnings.push(`sync: ${label} in the record may not match the draft (possible drift) — re-mirror`)
            }
        }
        checkPresence('story.body', record.story?.body)
        for (const seg of record.characterSegments || []) checkPresence(`segment:${characterKey(seg)}`, seg.body)
    }

    return { errors, warnings }
}

// ---------------------------------------------------------------------------

const target = process.argv[2] || null

const recordFiles = (await collectFiles(recipesDir, '.json')).sort()
const draftFiles = await collectFiles(draftsDir, '.md')
const draftById = new Map()
for (const f of draftFiles) {
    const m = path.basename(f).match(/REC-\d+/i)
    if (m) draftById.set(m[0].toUpperCase(), f)
}

let totalErrors = 0
let totalWarnings = 0
let linted = 0

for (const file of recordFiles) {
    let record
    try {
        record = JSON.parse(await readFile(file, 'utf8'))
    } catch (e) {
        process.stdout.write(`\n✗ ${path.relative(repoRoot, file)} — invalid JSON: ${e.message}\n`)
        totalErrors += 1
        continue
    }
    if (record.type !== 'recipe') continue
    if (target && record.id !== target && !record.slug?.includes(target)) continue

    const draftFile = draftById.get((record.id || '').toUpperCase())
    let draftMd = ''
    if (draftFile) {
        try { draftMd = await readFile(draftFile, 'utf8') } catch { /* ignore */ }
    }

    const { errors, warnings } = lintRecord(record, draftMd, Boolean(draftFile))
    const accepted = ACCEPTED[record.id] || []
    const typeOf = (w) => w.split(':')[0].trim()
    const info = warnings.filter((w) => typeOf(w) === 'info')
    const waived = warnings.filter((w) => typeOf(w) !== 'info' && accepted.includes(typeOf(w)))
    const active = warnings.filter((w) => typeOf(w) !== 'info' && !accepted.includes(typeOf(w)))
    linted += 1
    totalErrors += errors.length
    totalWarnings += active.length

    const mark = errors.length ? '✗' : active.length ? '!' : '✓'
    process.stdout.write(`\n${mark} ${record.id} — ${record.title} (v${record.version}, ${record.status}/${record.revisionState})\n`)
    for (const e of errors) process.stdout.write(`    ERROR  ${e}\n`)
    for (const w of active) process.stdout.write(`    warn   ${w}\n`)
    for (const w of waived) process.stdout.write(`    accept ${w} [author-accepted]\n`)
    for (const w of info) process.stdout.write(`    info   ${w.replace(/^info:\s*/, '')}\n`)
    if (!errors.length && !active.length && !waived.length && !info.length) process.stdout.write('    clean\n')
}

process.stdout.write(`\n— editorial-lint: ${linted} recipe(s), ${totalErrors} error(s), ${totalWarnings} warning(s) —\n`)
process.stdout.write('Errors block publish. Warnings are for review — some repetition ("too much", "silk") is canon.\n')

if (totalErrors > 0) process.exitCode = 1
