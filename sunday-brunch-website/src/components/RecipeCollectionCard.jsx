import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
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
    // Total matching recipes (set by RecipeCollectionsSection), not the 3-item preview slice
    const recipeCount = collection.recipeCount ?? previewRecipes.length

    const handleClick = () => {
        trackCollectionView(collection.id, recipeCount)
    }

    return (
        <Link
            to={collectionURL}
            className="collection-portal"
            onClick={handleClick}
            style={{ '--portal-color': collection.color }}
        >
            <div className="portal-content">
                <div className="portal-header">
                    <div className="portal-icon">{collection.icon}</div>
                    <div>
                        <div className="portal-title">{collection.title}</div>
                        <div className="portal-subtitle">{collection.subtitle}</div>
                    </div>
                </div>

                {/* Always 3 thumbs (preview parity): recipe image when available,
                    recipe emoji when not, collection icon for unfilled slots */}
                <div className="portal-preview">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const recipe = previewRecipes[index]
                        if (!recipe) {
                            return (
                                <div key={`empty-${index}`} className="preview-thumb" aria-hidden="true">
                                    {collection.icon}
                                </div>
                            )
                        }
                        return (
                            <div key={recipe.slug} className="preview-thumb">
                                {recipe.image ? (
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        loading="lazy"
                                    />
                                ) : (
                                    <span role="img" aria-label={recipe.title}>{recipe.emoji || '📖'}</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="portal-count">
                    <span>
                        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
                    </span>
                    <span className="portal-arrow">→</span>
                </div>
            </div>
        </Link>
    )
}

RecipeCollectionCard.propTypes = {
    collection: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
        recipeCount: PropTypes.number,
    }).isRequired,
    previewRecipes: PropTypes.arrayOf(PropTypes.shape({
        slug: PropTypes.string,
        title: PropTypes.string,
        image: PropTypes.string,
    })),
};

export default RecipeCollectionCard
