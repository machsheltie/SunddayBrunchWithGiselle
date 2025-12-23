import { useEffect } from 'react'
import CTAForm from '../components/CTAForm'
import { applyMeta } from '../lib/seo'

function MediaKitPage() {
    useEffect(() => {
        applyMeta({
            title: 'Media Kit | Sunday Brunch With Giselle',
            description: 'On-brand sponsorships for cozy baking fans with transcripts, recipes, and warm audio.',
            canonical: '/media-kit'
        })
    }, [])

    return (
        <section className="section">
            <div className="section__header">
                <h1 className="section__title">Media Kit</h1>
                <span className="pill">Brand-safe</span>
            </div>
            <div className="card stack">
                <p className="small-muted">We are cozy, baking-first, pet-loving, and tea/coffee friendly. We decline diet fads, off-brand finance, or low-quality gadgets.</p>
                <div className="grid">
                    <div className="stack">
                        <h3>Inventory</h3>
                        <ul className="media-kit__list">
                            <li>Site placements (hero, inline modules, tools-used mentions)</li>
                            <li>Email mentions in Sunday letter + recipe drops</li>
                            <li>Audio reads with transcript callouts</li>
                        </ul>
                    </div>
                    <div className="stack">
                        <h3>Audience</h3>
                        <ul className="media-kit__list">
                            <li>Home bakers and brunch lovers</li>
                            <li>Mobile-first readers; transcripts always available</li>
                            <li>Prefers warmth, pets, tea/coffee rituals</li>
                        </ul>
                    </div>
                    <div className="stack">
                        <h3>Guardrails</h3>
                        <ul className="media-kit__list">
                            <li>Allow: baking/kitchen gear, ingredients, tea/coffee, cozy home, pet/Sheltie</li>
                            <li>Deny: diet fads, off-brand finance, low-quality gadgets</li>
                            <li>Disclosures and UTM tagging on outbound links</li>
                        </ul>
                    </div>
                </div>
                <CTAForm headline="Request a bundle" subcopy="Tell us what you need and we will reply quickly." mode="contact" />
            </div>
        </section>
    )
}

export default MediaKitPage
