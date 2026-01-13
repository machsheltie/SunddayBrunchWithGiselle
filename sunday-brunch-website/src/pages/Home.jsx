import { useEffect, useState } from 'react'
import CTAForm from '../components/CTAForm'
import FeaturedRecipeCard from '../components/FeaturedRecipeCard'
import EpisodeTemplate from '../components/EpisodeTemplate'
import ShareBar from '../components/ShareBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import WhimsicalHero from '../components/WhimsicalHero'
import { getFeatured } from '../lib/content'
import { applyMeta } from '../lib/seo'

function Home() {
    const [featured, setFeatured] = useState({ recipe: null, episode: null })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        applyMeta({
            title: 'Sunday Brunch With Giselle | Cozy Baking & Stories',
            description: 'A cozy baking podcast featuring whimsical recipes, stories, and four Shetland Sheepdogs.'
        })

        getFeatured().then(data => {
            setFeatured(data)
            setLoading(false)
        })
    }, [])

    return (
        <div className="home">
            <WhimsicalHero />

            {/* Decorative divider between hero and content */}
            <div className="hero-content-divider"></div>

            <section className="section" id="recipes">
                <div className="section__header">
                    <h2 className="section__title">Featured Recipe</h2>
                </div>
                {loading && <LoadingSkeleton type="recipe" />}
                {!loading && featured.recipe && (
                    <FeaturedRecipeCard recipe={featured.recipe} />
                )}
                {!loading && !featured.recipe && <p className="small-muted">No recipe available yet.</p>}
            </section>

            <section className="section" id="episodes">
                <div className="section__header">
                    <h2 className="section__title">Latest Episode</h2>
                    <span className="pill">Audio + transcript</span>
                </div>
                <div className="card">
                    {loading && <LoadingSkeleton type="episode" />}
                    {!loading && featured.episode && (
                        <>
                            <EpisodeTemplate episode={featured.episode} />
                            <CTAForm headline="Get recipes, Sunday letters, early drops" />
                        </>
                    )}
                    {!loading && !featured.episode && <p className="small-muted">No episode available yet.</p>}
                </div>
            </section>

            <section className="section" id="media-kit">
                <div className="section__header">
                    <h2 className="section__title">Media Kit (on-brand only)</h2>
                    <span className="pill">Sponsors</span>
                </div>
                <div className="card stack">
                    <p className="small-muted">We are cozy, baking-first, pet-loving, and tea/coffee friendly. We decline diet fads, off-brand finance, or low-quality gadgets.</p>
                    <ul className="media-kit__list">
                        <li>Inventory: site placements, email mentions, audio reads.</li>
                        <li>Allow: baking/kitchen gear, ingredients, tea/coffee, cozy home, pet/Sheltie.</li>
                        <li>Deny: diet fads, off-brand finance, low-quality gadgets.</li>
                    </ul>
                    <CTAForm headline="Request a bundle" subcopy="Tell us what you need and we will reply quickly." mode="contact" />
                </div>
            </section>
        </div>
    )
}

export default Home
