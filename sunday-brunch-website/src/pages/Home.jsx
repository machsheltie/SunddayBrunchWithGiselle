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
import RecipeSanctuary from '../components/RecipeSanctuary'
import LatestEpisodeSection from '../components/LatestEpisodeSection'
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
            {/* Outer container wrapping ALL content - matches preview-magical.html */}
            <div className="container">
                {/* Hero Section */}
                <WhimsicalHero />

                {/* Recipe Sanctuary - Unified section with gradient border */}
                <RecipeSanctuary>
                    {/* Featured Recipe */}
                    <section className="section featured-recipe-section" data-testid="featured-recipe">
                        {loading && <LoadingSkeleton type="recipe" />}
                        {!loading && featured.recipe && (
                            <FeaturedRecipeCard recipe={featured.recipe} />
                        )}
                        {!loading && !featured.recipe && <p className="small-muted">No recipe available yet.</p>}
                    </section>

                    {/* Paw Divider */}
                    <div className="paw-divider">🐾 🐾 🐾</div>

                    {/* Recipe Collections - Curated discovery paths */}
                    <RecipeCollectionsSection />

                    {/* Paw Divider */}
                    <div className="paw-divider">🐾 🐾 🐾</div>

                    {/* Recent Recipes Gallery - Newest additions */}
                    <RecentRecipesGallery limit={8} />
                </RecipeSanctuary>

                {/* Latest Episode Section - With gradient border wrapper */}
                <LatestEpisodeSection>
                    {loading && <LoadingSkeleton type="episode" />}
                    {!loading && featured.episode && (
                        <>
                            <FeaturedEpisodeCard episode={featured.episode} />
                            <CTAForm headline="Get recipes, Sunday letters, early drops" />
                        </>
                    )}
                    {!loading && !featured.episode && <p className="small-muted">No episode available yet.</p>}
                </LatestEpisodeSection>

                {/* Social Proof - Community testimonials */}
                <SocialProofSection />
            </div>
        </div>
    )
}

export default Home
