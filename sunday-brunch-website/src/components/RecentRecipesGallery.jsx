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
            <div className="recent-recipes-gallery" data-testid="recent-recipes">
                <div className="recent-recipes-grid">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="recent-recipe-card skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
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
        <div className="recent-recipes-gallery" data-testid="recent-recipes">
            <div className="recent-recipes-gallery__header">
                <h2 className="recent-recipes-gallery__title">Fresh From The Oven</h2>
                <p className="recent-recipes-gallery__subtitle">Newest additions to the collection</p>
            </div>

            <div className="recent-recipes-grid">
                {recipes.map((recipe, index) => (
                    <Link
                        key={recipe.slug}
                        to={`/recipes/${recipe.slug}`}
                        className="recent-recipe-card"
                        data-testid="recipe-card"
                        onClick={() => handleRecipeClick(recipe.slug, index)}
                    >
                        <div className="recent-recipe-card__image-container">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="recent-recipe-card__image"
                                loading="lazy"
                            />
                            {recipe.category && (
                                <span className="recent-recipe-card__category">
                                    {recipe.category}
                                </span>
                            )}
                        </div>

                        <div className="recent-recipe-card__content">
                            <h3 className="recent-recipe-card__title">{recipe.title}</h3>

                            <div className="recent-recipe-card__meta">
                                {recipe.averageRating > 0 && (
                                    <div className="recent-recipe-card__rating">
                                        <span className="rating-stars">
                                            {'★'.repeat(Math.round(recipe.averageRating))}
                                            {'☆'.repeat(5 - Math.round(recipe.averageRating))}
                                        </span>
                                        <span className="rating-count">
                                            ({recipe.ratingCount})
                                        </span>
                                    </div>
                                )}

                                {recipe.cookTime && (
                                    <span className="recent-recipe-card__time">
                                        ⏱️ {recipe.cookTime} min
                                    </span>
                                )}
                            </div>

                            {recipe.dietary && recipe.dietary.length > 0 && (
                                <div className="recent-recipe-card__badges">
                                    {recipe.dietary.slice(0, 2).map(badge => (
                                        <span key={badge} className="dietary-badge">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="recent-recipes-gallery__footer">
                <Link to="/recipes" onClick={handleSeeAllClick}>
                    <WhimsicalButton type="secondary" showPaw={false}>
                        See All Recipes
                    </WhimsicalButton>
                </Link>
            </div>
        </div>
    )
}

export default RecentRecipesGallery
