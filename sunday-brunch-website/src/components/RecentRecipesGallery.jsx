import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecentRecipes } from '../lib/content'
import { getRecipeRatings } from '../lib/ratings'
import { trackRecentRecipeClick, trackSeeAllRecipesClick } from '../lib/analytics'
import WhimsicalButton from './WhimsicalButton'
import './RecentRecipesGallery.css'

/**
 * RecentRecipesGallery - Display newest recipes in grid layout
 *
 * Shows 6-8 most recent recipes with images, ratings, and metadata
 * to encourage exploration beyond the single featured recipe.
 *
 * @param {Object} props
 * @param {number} props.limit - Number of recipes to display (default: 8)
 */
function RecentRecipesGallery({ limit = 8 }) {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRecipes() {
            try {
                const recentRecipes = await getRecentRecipes(limit)

                // Fetch ratings for each recipe
                const enrichedRecipes = await Promise.all(
                    recentRecipes.map(async (recipe) => {
                        const { data: ratings } = await getRecipeRatings(recipe.slug)
                        return {
                            ...recipe,
                            averageRating: ratings?.average_rating || 0,
                            ratingCount: ratings?.rating_count || 0
                        }
                    })
                )

                setRecipes(enrichedRecipes)
                setLoading(false)
            } catch (error) {
                console.error('Error loading recent recipes:', error)
                setLoading(false)
            }
        }

        loadRecipes()
    }, [limit])

    const handleRecipeClick = (slug, position) => {
        trackRecentRecipeClick(slug, position)
    }

    const handleSeeAllClick = () => {
        trackSeeAllRecipesClick()
    }

    if (loading) {
        return (
            <div className="recent-additions" data-testid="recent-recipes">
                <h3>Fresh from the Oven</h3>
                <div className="recent-grid">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="library-book skeleton">
                            <div className="book-cover">📖</div>
                            <div className="book-info">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (recipes.length === 0) {
        return null
    }

    return (
        <div className="recent-additions" data-testid="recent-recipes">
            <h3>Fresh from the Oven</h3>

            <div className="recent-grid">
                {recipes.map((recipe, index) => (
                    <Link
                        key={recipe.slug}
                        to={`/recipes/${recipe.slug}`}
                        className="library-book"
                        data-testid="recipe-card"
                        onClick={() => handleRecipeClick(recipe.slug, index)}
                    >
                        <div className="book-cover">
                            {recipe.emoji || '📖'}
                        </div>
                        <div className="book-info">
                            <div className="book-title">{recipe.title}</div>
                            <div className="book-meta">
                                {recipe.averageRating > 0 && (
                                    <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                                )}
                                {recipe.times?.total && (
                                    <span>⏱️ {recipe.times.total}</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="browse-cta">
                <Link to="/recipes" onClick={handleSeeAllClick}>
                    <WhimsicalButton type="primary" showPaw={false}>
                        Browse the Full Collection →
                    </WhimsicalButton>
                </Link>
            </div>
        </div>
    )
}

export default RecentRecipesGallery
