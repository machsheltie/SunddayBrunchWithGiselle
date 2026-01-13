import { Link } from 'react-router-dom'
import { buildCollectionURL } from '../data/collections'
import { trackCollectionView } from '../lib/analytics'
import './RecipeCollectionsSection.css'

/**
 * RecipeCollectionCard - Individual collection card component
 *
 * Displays a curated recipe collection with preview images, count, and link.
 *
 * @param {Object} props
 * @param {Object} props.collection - Collection object from collections.js
 * @param {Array} props.previewRecipes - First 3 matching recipes for preview
 */
function RecipeCollectionCard({ collection, previewRecipes = [] }) {
    const collectionURL = buildCollectionURL(collection.filters)
    const recipeCount = previewRecipes.length

    const handleClick = () => {
        trackCollectionView(collection.id, recipeCount)
    }

    return (
        <Link
            to={collectionURL}
            className="recipe-collection-card"
            onClick={handleClick}
            style={{ '--collection-color': collection.color }}
        >
            <div className="recipe-collection-card__header">
                <span className="recipe-collection-card__icon">{collection.icon}</span>
                <div className="recipe-collection-card__titles">
                    <h3 className="recipe-collection-card__title">{collection.title}</h3>
                    <p className="recipe-collection-card__subtitle">{collection.subtitle}</p>
                </div>
            </div>

            {previewRecipes.length > 0 && (
                <div className="recipe-collection-card__preview">
                    {previewRecipes.slice(0, 3).map((recipe, index) => (
                        <div
                            key={recipe.slug}
                            className="recipe-collection-card__preview-image"
                        >
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="recipe-collection-card__footer">
                <span className="recipe-collection-card__count">
                    {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
                </span>
                <span className="recipe-collection-card__arrow">→</span>
            </div>
        </Link>
    )
}

export default RecipeCollectionCard
