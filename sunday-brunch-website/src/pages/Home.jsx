import { useEffect, useState } from 'react'
import CTAForm from '../components/CTAForm'
import FeaturedRecipeCard from '../components/FeaturedRecipeCard'
import FeaturedEpisodeCard from '../components/FeaturedEpisodeCard'
import ShareBar from '../components/ShareBar'
import LoadingSkeleton from '../components/LoadingSkeleton'
import WhimsicalHero from '../components/WhimsicalHero'
import RecipeCollectionsSection from '../components/RecipeCollectionsSection'
import SocialProofSection from '../components/SocialProofSection'
import RecentRecipesGallery from '../components/RecentRecipesGallery'
import { getFeatured } from '../lib/content'
import { applyMeta } from '../lib/seo'
import './Home.css'

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
            {/* Hero Section - Matches preview-magical.html exactly */}
            <WhimsicalHero />

            {/* Gradient divider between hero and content sections */}
            <div className="hero-content-divider"></div>

            {/* Featured Recipe Section */}
            <section className="section featured-recipe-section" data-testid="featured-recipe">
                {loading && <LoadingSkeleton type="recipe" />}
                {!loading && featured.recipe && (
                    <FeaturedRecipeCard recipe={featured.recipe} />
                )}
                {!loading && !featured.recipe && <p className="small-muted">No recipe available yet.</p>}
            </section>

            {/* Recipe Collections - Curated discovery paths */}
            <RecipeCollectionsSection />

            {/* Recent Recipes Gallery - Newest additions */}
            <RecentRecipesGallery limit={8} />

            {/* Latest Episode Section */}
            <section className="section latest-episode-section">
                <div className="section__header">
                    <h2 className="section__title">Latest Episode</h2>
                </div>
                {loading && <LoadingSkeleton type="episode" />}
                {!loading && featured.episode && (
                    <>
                        <FeaturedEpisodeCard episode={featured.episode} />
                        <CTAForm headline="Get recipes, Sunday letters, early drops" />
                    </>
                )}
                {!loading && !featured.episode && <p className="small-muted">No episode available yet.</p>}
            </section>

            {/* Social Proof - Community testimonials */}
            <SocialProofSection />
        </div>
    )
}

export default Home
