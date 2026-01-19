import { useState, useEffect } from 'react'
import { getRecipes } from '../lib/content'
import { getAllCollections } from '../data/collections'
import RecipeCollectionCard from './RecipeCollectionCard'
import './RecipeCollectionsSection.css'

/**
 * RecipeCollectionsSection - Curated recipe collections for content discovery
 *
 * Displays 4 recipe collections that help users find recipes by purpose:
 * - Quick Sunday Morning Bakes (under 30 min)
 * - Perfect for Gifting
 * - Beginner-Friendly Favorites
 * - Seasonal Specials (dynamic based on current season)
 */
function RecipeCollectionsSection() {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCollections() {
            try {
                const allRecipes = await getRecipes()
                const collectionDefinitions = getAllCollections()

                // For each collection, find matching recipes
                const enrichedCollections = collectionDefinitions.map(collection => {
                    const matchingRecipes = allRecipes.filter(recipe => {
                        // Skip placeholder recipes
                        if (recipe.slug.includes('placeholder')) return false

                        const filters = collection.filters

                        // Filter by cook time (maxOnly means "under X minutes")
                        if (filters.cookTime !== undefined) {
                            const recipeCookTime = recipe.cookTime || recipe.times?.total || 999
                            if (filters.maxOnly && recipeCookTime > filters.cookTime) {
                                return false
                            }
                        }

                        // Filter by occasion
                        if (filters.occasion && recipe.occasion !== filters.occasion) {
                            return false
                        }

                        // Filter by skill level
                        if (filters.skill && recipe.skill !== filters.skill) {
                            return false
                        }

                        // Filter by season
                        if (filters.season && recipe.season !== filters.season) {
                            return false
                        }

                        return true
                    })

                    return {
                        ...collection,
                        featured: matchingRecipes.slice(0, 3) // First 3 for preview
                    }
                })

                setCollections(enrichedCollections)
                setLoading(false)
            } catch (error) {
                console.error('Error loading collections:', error)
                setLoading(false)
            }
        }

        loadCollections()
    }, [])

    if (loading) {
        return (
            <div className="recipe-collections-section" data-testid="recipe-collections">
                <div className="recipe-collections-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="recipe-collection-card skeleton">
                            <div className="skeleton-header"></div>
                            <div className="skeleton-preview"></div>
                            <div className="skeleton-footer"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <section className="recipe-sanctuary" data-testid="recipe-collections">
            <div className="sanctuary-header">
                <h2>The Recipe Sanctuary</h2>
                <p className="sanctuary-subtitle">Curated for every mood & moment</p>
            </div>
            <div className="recipe-collections-grid">
                {collections.map(collection => (
                    <RecipeCollectionCard
                        key={collection.id}
                        collection={collection}
                        previewRecipes={collection.featured}
                    />
                ))}
            </div>
        </section>
    )
}

export default RecipeCollectionsSection
