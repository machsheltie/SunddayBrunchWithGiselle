import { useEffect, useState } from 'react'
import CTAForm from '../components/CTAForm'
import FeaturedRecipeCard from '../components/FeaturedRecipeCard'
import FeaturedEpisodeCard from '../components/FeaturedEpisodeCard'
import ShareBar from '../components/ShareBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import WhimsicalHero from '../components/WhimsicalHero'
import EmailCTAInline from '../components/EmailCTAInline'
import RecipeCollectionsSection from '../components/RecipeCollectionsSection'
import SocialProofSection from '../components/SocialProofSection'
import RecentRecipesGallery from '../components/RecentRecipesGallery'
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

            {/* Inline email CTA - subtle hero conversion touchpoint */}
            <EmailCTAInline message="Get weekly recipes in your inbox" />

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

            {/* Recipe Collections - curated discovery paths */}
            <RecipeCollectionsSection />

            {/* Social Proof - community testimonials */}
            <SocialProofSection />

            <section className="section" id="episodes">
                <div className="section__header">
                    <h2 className="section__title">Latest Episode</h2>
                </div>
                <div className="card">
                    {loading && <LoadingSkeleton type="episode" />}
                    {!loading && featured.episode && (
                        <>
                            <FeaturedEpisodeCard episode={featured.episode} />
                            <CTAForm headline="Get recipes, Sunday letters, early drops" />
                        </>
                    )}
                    {!loading && !featured.episode && <p className="small-muted">No episode available yet.</p>}
                </div>
            </section>

            {/* Recent Recipes Gallery - newest additions */}
            <RecentRecipesGallery limit={8} />
        </div>
    )
}

export default Home
