import { useState } from 'react'
import PropTypes from 'prop-types'
import { FILTER_OPTIONS } from '../../config/filterConfig'
import './RecipeFilters.css'

function RecipeFilters({ filters, onChange }) {
  const [collapsed, setCollapsed] = useState({
    category: false,
    dietary: false,
    season: false,
    difficulty: false,
    cookTime: false,
    tags: false
  })

  const toggleCollapse = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Use filter options from config
  const categories = FILTER_OPTIONS.categories
  const dietaryOptions = FILTER_OPTIONS.dietary
  const seasons = FILTER_OPTIONS.seasons
  const difficulties = FILTER_OPTIONS.difficulties
  const cookTimes = FILTER_OPTIONS.cookTimes
  const availableTags = FILTER_OPTIONS.tags
  const sortOptions = FILTER_OPTIONS.sortOptions

  const handleCategoryChange = (cat) => {
    const value = cat === 'All Categories' ? 'all' : cat
    onChange({ ...filters, category: value })
  }

  const handleDietaryChange = (diet) => {
    const newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet]
    onChange({ ...filters, dietary: newDietary })
  }

  const handleSeasonChange = (season) => {
    onChange({ ...filters, season })
  }

  const handleDifficultyChange = (difficulty) => {
    onChange({ ...filters, difficulty })
  }

  const handleCookTimeChange = (time) => {
    onChange({ ...filters, cookTime: time })
  }

  const handleTagChange = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    onChange({ ...filters, tags: newTags })
  }

  const handleSortChange = (e) => {
    onChange({ ...filters, sortBy: e.target.value })
  }

  const handleReset = () => {
    onChange({
      category: 'all',
      dietary: [],
      season: 'all',
      difficulty: 'all',
      cookTime: 'all',
      tags: [],
      sortBy: 'newest'
    })
  }

  const activeFilterCount = [
    filters.category !== 'all' ? 1 : 0,
    filters.dietary.length,
    filters.season !== 'all' ? 1 : 0,
    filters.difficulty !== 'all' ? 1 : 0,
    filters.cookTime !== 'all' ? 1 : 0,
    filters.tags.length
  ].reduce((sum, count) => sum + count, 0)

  return (
    <aside className="recipe-filters" aria-label="Recipe filters">
      <div className="recipe-filters__header">
        <h2 className="recipe-filters__title">Filter Recipes</h2>
        {activeFilterCount > 0 && (
          <span className="recipe-filters__badge" aria-label={`${activeFilterCount} active filters`}>
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* Category Filter */}
      <section
        className="recipe-filters__section"
        data-testid="filter-section-category"
        role="region"
        aria-label="Category filters"
      >
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('category')}
          aria-expanded={!collapsed.category}
          aria-controls="category-filters"
          aria-label="Toggle category filters"
        >
          <h3>Category</h3>
          <span className={`chevron ${collapsed.category ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.category && (
          <div className="recipe-filters__buttons" id="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`filter-button ${
                  (cat === 'All Categories' && filters.category === 'all') ||
                  filters.category === cat
                    ? 'is-active'
                    : ''
                }`}
                aria-pressed={
                  (cat === 'All Categories' && filters.category === 'all') ||
                  filters.category === cat
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Dietary Restrictions Filter */}
      <section
        className="recipe-filters__section"
        role="region"
        aria-label="Dietary restriction filters"
      >
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('dietary')}
          aria-expanded={!collapsed.dietary}
          aria-controls="dietary-filters"
          aria-label="Toggle dietary filters"
        >
          <h3>Dietary Restrictions</h3>
          <span className={`chevron ${collapsed.dietary ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.dietary && (
          <div className="recipe-filters__chips" id="dietary-filters">
            {dietaryOptions.map(diet => (
              <button
                key={diet}
                onClick={() => handleDietaryChange(diet)}
                className={`filter-chip ${filters.dietary.includes(diet) ? 'is-active' : ''}`}
                aria-pressed={filters.dietary.includes(diet)}
              >
                {diet}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Season Filter */}
      <section className="recipe-filters__section">
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('season')}
          aria-expanded={!collapsed.season}
          aria-controls="season-filters"
          aria-label="Toggle season filters"
        >
          <h3>Season</h3>
          <span className={`chevron ${collapsed.season ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.season && (
          <div className="recipe-filters__buttons" id="season-filters">
            {seasons.map(s => (
              <button
                key={s}
                onClick={() => handleSeasonChange(s === 'All Seasons' ? 'all' : s)}
                className={`filter-button ${
                  (s === 'All Seasons' && filters.season === 'all') ||
                  filters.season === s
                    ? 'is-active'
                    : ''
                }`}
                aria-pressed={
                  (s === 'All Seasons' && filters.season === 'all') ||
                  filters.season === s
                }
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Difficulty Filter */}
      <section className="recipe-filters__section">
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('difficulty')}
          aria-expanded={!collapsed.difficulty}
          aria-controls="difficulty-filters"
          aria-label="Toggle difficulty filters"
        >
          <h3>Difficulty</h3>
          <span className={`chevron ${collapsed.difficulty ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.difficulty && (
          <div className="recipe-filters__buttons" id="difficulty-filters">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff === filters.difficulty ? 'all' : diff)}
                className={`filter-button ${filters.difficulty === diff ? 'is-active' : ''}`}
                aria-pressed={filters.difficulty === diff}
              >
                {diff}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Cook Time Filter */}
      <section className="recipe-filters__section">
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('cookTime')}
          aria-expanded={!collapsed.cookTime}
          aria-controls="cookTime-filters"
          aria-label="Toggle cook time filters"
        >
          <h3>Cook Time</h3>
          <span className={`chevron ${collapsed.cookTime ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.cookTime && (
          <div className="recipe-filters__buttons" id="cookTime-filters">
            {cookTimes.map(time => (
              <button
                key={time.value}
                onClick={() => handleCookTimeChange(time.value === filters.cookTime ? 'all' : time.value)}
                className={`filter-button ${filters.cookTime === time.value ? 'is-active' : ''}`}
                aria-pressed={filters.cookTime === time.value}
              >
                {time.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Tags Filter */}
      <section className="recipe-filters__section">
        <button
          className="recipe-filters__section-header"
          onClick={() => toggleCollapse('tags')}
          aria-expanded={!collapsed.tags}
          aria-controls="tags-filters"
          aria-label="Toggle tag filters"
        >
          <h3>Tags</h3>
          <span className={`chevron ${collapsed.tags ? '' : 'is-open'}`}>▾</span>
        </button>

        {!collapsed.tags && (
          <div className="recipe-filters__chips" id="tags-filters">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`filter-chip ${filters.tags.includes(tag) ? 'is-active' : ''}`}
                aria-pressed={filters.tags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Sort By */}
      <section className="recipe-filters__section">
        <h3>Sort By</h3>
        <select
          className="recipe-filters__select"
          value={filters.sortBy}
          onChange={handleSortChange}
          aria-label="Sort by"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Reset Button */}
      <button
        className="recipe-filters__reset"
        onClick={handleReset}
        disabled={activeFilterCount === 0}
      >
        Clear All Filters
      </button>
    </aside>
  )
}

RecipeFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    dietary: PropTypes.arrayOf(PropTypes.string),
    season: PropTypes.string,
    difficulty: PropTypes.string,
    cookTime: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    sortBy: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default RecipeFilters
