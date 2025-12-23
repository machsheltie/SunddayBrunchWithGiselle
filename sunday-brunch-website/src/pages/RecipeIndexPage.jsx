import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getRecipes } from '../lib/content'
import { applyMeta } from '../lib/seo'
import './RecipeIndexPage.css'

function RecipeIndexPage() {
    const [allRecipes, setAllRecipes] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [activeCategory, setActiveCategory] = useState('all')
    const [activeSkill, setActiveSkill] = useState('all')
    const [activeDietary, setActiveDietary] = useState('all')
    const [activeOccasion, setActiveOccasion] = useState('all')
    const [ingredientSearch, setIngredientSearch] = useState('')

    // Collapse states
    const [collapsed, setCollapsed] = useState({
        types: false,
        level: false,
        dietary: false
    })

    const toggleCollapse = (section) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
    }

    useEffect(() => {
        applyMeta({
            title: 'Recipe Index | Sunday Brunch With Giselle',
            description: 'Filter and browse all recipes by category, skill level, and dietary needs.'
        })

        getRecipes().then(data => {
            setAllRecipes(data)
            setLoading(false)
        })
    }, [])

    const categoryList = [
        { id: 'cakes', name: 'Cakes' },
        { id: 'cookies', name: 'Cookies' },
        { id: 'pies', name: 'Pies' },
        { id: 'breads', name: 'Breads' },
        { id: 'brownies', name: 'Brownies' },
        { id: 'cheesecakes', name: 'Cheesecakes' },
        { id: 'cupcakes', name: 'Cupcakes' },
        { id: 'breakfast', name: 'Breakfast' },
        { id: 'pastries', name: 'Pastries' }
    ]

    const filterOptions = {
        skill: ['Beginner', 'Intermediate', 'Advanced'],
        dietary: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free', 'Egg-Free'],
        occasion: ['Birthdays', 'Holiday Gifting', 'Thanksgiving', 'Sunday Brunch', 'Movie Night', 'Dinner Party', 'Bake Sale', 'Weekend Mornings', 'Afternoon Tea']
    }

    const filteredRecipes = useMemo(() => {
        return allRecipes.filter(recipe => {
            const matchesCategory = activeCategory === 'all' || recipe.category.toLowerCase() === activeCategory
            const matchesSkill = activeSkill === 'all' || recipe.skill === activeSkill
            const matchesDietary = activeDietary === 'all' || recipe.dietary?.includes(activeDietary)
            const matchesOccasion = activeOccasion === 'all' || recipe.occasion === activeOccasion
            const matchesIngredient = ingredientSearch === '' ||
                recipe.ingredients?.some(i => i.toLowerCase().includes(ingredientSearch.toLowerCase())) ||
                recipe.title.toLowerCase().includes(ingredientSearch.toLowerCase())
            return matchesCategory && matchesSkill && matchesDietary && matchesOccasion && matchesIngredient
        })
    }, [allRecipes, activeCategory, activeSkill, activeDietary, activeOccasion, ingredientSearch])

    const groupedByCategory = useMemo(() => {
        return filteredRecipes.reduce((acc, recipe) => {
            const cat = recipe.category
            if (!acc[cat]) acc[cat] = []
            acc[cat].push(recipe)
            return acc
        }, {})
    }, [filteredRecipes])

    const resetFilters = () => {
        setActiveCategory('all')
        setActiveSkill('all')
        setActiveDietary('all')
        setActiveOccasion('all')
        setIngredientSearch('')
    }

    return (
        <div className="recipe-index-container">
            <aside className="recipe-sidebar modern-sidebar">
                <div className="sidebar-search-block">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="sidebar-search-input"
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                    />
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                <div className="sidebar-group">
                    <button
                        className="sidebar-group-header"
                        onClick={() => toggleCollapse('types')}
                    >
                        <h3 className="sidebar-group-title">Recipe Types</h3>
                        <span className={`chevron ${collapsed.types ? '' : 'is-open'}`}>▾</span>
                    </button>
                    {!collapsed.types && (
                        <div className="category-grid">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`category-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
                            >
                                All
                            </button>
                            {categoryList.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.name.toLowerCase())}
                                    className={`category-btn ${activeCategory === cat.name.toLowerCase() ? 'is-active' : ''}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-group">
                    <button
                        className="sidebar-group-header"
                        onClick={() => toggleCollapse('level')}
                    >
                        <h3 className="sidebar-group-title">Baking Level</h3>
                        <span className={`chevron ${collapsed.level ? '' : 'is-open'}`}>▾</span>
                    </button>
                    {!collapsed.level && (
                        <div className="filter-chips">
                            {filterOptions.skill.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveSkill(activeSkill === s ? 'all' : s)}
                                    className={`chip ${activeSkill === s ? 'is-active' : ''}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sidebar-group">
                    <button
                        className="sidebar-group-header"
                        onClick={() => toggleCollapse('dietary')}
                    >
                        <h3 className="sidebar-group-title">Dietary & Occasion</h3>
                        <span className={`chevron ${collapsed.dietary ? '' : 'is-open'}`}>▾</span>
                    </button>
                    {!collapsed.dietary && (
                        <div className="filter-chips">
                            {filterOptions.dietary.slice(0, 4).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setActiveDietary(activeDietary === d ? 'all' : d)}
                                    className={`chip ${activeDietary === d ? 'is-active' : ''}`}
                                >
                                    {d}
                                </button>
                            ))}
                            {/* More compact button for the rest */}
                            <select
                                className="filter-select"
                                value={activeOccasion}
                                onChange={(e) => setActiveOccasion(e.target.value)}
                            >
                                <option value="all">Any Occasion</option>
                                {filterOptions.occasion.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <button className="reset-sidebar-btn" onClick={resetFilters}>
                    Clear All Filters
                </button>
            </aside>

            <main className="recipe-index-content">
                <header className="recipe-index__header">
                    <h1 className="recipe-index__title">The Recipe Box</h1>
                    <p className="recipe-index__subtitle">Whimsical bakes for every skill level</p>
                </header>

                {loading && <div className="loading-state">Mixing the batter...</div>}

                {!loading && (
                    <div className="recipe-results">
                        {filteredRecipes.length === 0 ? (
                            <div className="no-results">
                                <p>No recipes match those filters. Try adjusting your search!</p>
                                <button onClick={resetFilters} className="text-link">Show all recipes</button>
                            </div>
                        ) : (
                            Object.keys(groupedByCategory).map(catName => (
                                <section key={catName} className="recipe-index-section">
                                    <div className="recipe-index-section__header">
                                        <h2 className="recipe-index-section__title">{catName}</h2>
                                    </div>
                                    <div className="recipe-index-grid">
                                        {groupedByCategory[catName].map(recipe => (
                                            <Link
                                                key={recipe.slug}
                                                to={`/recipes/${recipe.slug}`}
                                                className="recipe-index-card"
                                            >
                                                <div className="recipe-index-card__img-placeholder">
                                                    {recipe.image ? (
                                                        <img src={recipe.image} alt={recipe.title} className="recipe-img" />
                                                    ) : (
                                                        <div className="watercolor-blob"></div>
                                                    )}
                                                    <span className="recipe-badge">{recipe.skill}</span>
                                                </div>
                                                <div className="recipe-index-card__content">
                                                    <h3 className="recipe-index-card__title">{recipe.title}</h3>
                                                    <div className="recipe-index-card__tags">
                                                        {recipe.dietary?.map(d => <span key={d} className="tag-micro">{d}</span>)}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default RecipeIndexPage
