import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import PinterestButton from '../PinterestButton'
import './SearchResults.css'

function SearchResults({
  results,
  loading = false,
  searchQuery = '',
  groupByCategory = false,
  highlightSearch = false,
  itemsPerPage = 20,
  infiniteScroll = false,
  onLoadMore = null
}) {
  const sentinelRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)

  const highlightText = (text, query) => {
    if (!query || !highlightSearch) return text

    // Escape special regex characters to prevent crashes and XSS
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const escapedQuery = escapeRegex(query)

    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} data-testid="highlighted-text" className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const formatCookTime = (time) => {
    if (!time) return 'N/A'
    if (time < 60) return `${time} min`
    const hours = Math.floor(time / 60)
    const mins = time % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Reset to page 1 when results change
  useEffect(() => {
    setCurrentPage(1)
  }, [results, searchQuery])

  // Proper IntersectionObserver cleanup to prevent memory leaks
  useEffect(() => {
    if (!infiniteScroll || !sentinelRef.current || !onLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [infiniteScroll, onLoadMore])

  // Pagination handlers
  const totalPages = Math.ceil(results.length / itemsPerPage)

  const goToPrevPage = () => {
    setCurrentPage(prev => {
      const newPage = Math.max(1, prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return newPage
    })
  }

  const goToNextPage = () => {
    setCurrentPage(prev => {
      const newPage = Math.min(totalPages, prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return newPage
    })
  }

  // Calculate paginated results
  const paginatedResults = groupByCategory
    ? results
    : results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <div className="search-results__loading">
        <div className="loading-spinner" data-testid="loading-spinner" />
        <p>Searching for delicious recipes...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="search-results__empty">
        <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <h3>No recipes found</h3>
        <p>Try different filters or search terms!</p>
      </div>
    )
  }

  const resultCount = results.length
  const resultText = resultCount === 1 ? 'recipe' : 'recipes'

  const renderRecipeCard = (recipe) => (
    <div key={recipe.slug} role="listitem">
      <Link
        to={`/recipes/${recipe.slug}`}
        className="recipe-card"
      >
        <div className="recipe-card__image">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} />
          ) : (
            <div className="recipe-card__placeholder" data-testid="recipe-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}

          <PinterestButton
            url={`${window.location.origin}/recipes/${recipe.slug}`}
            description={`Check out this ${recipe.title} from Sunday Brunch With Giselle!`}
            image={recipe.image}
          />

          <span className="recipe-card__difficulty">{recipe.skill || recipe.difficulty}</span>
        </div>

        <div className="recipe-card__content">
          <h3 className="recipe-card__title">
            {highlightSearch ? highlightText(recipe.title, searchQuery) : recipe.title}
          </h3>

          {recipe.cookTime && (
            <p className="recipe-card__time">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatCookTime(recipe.cookTime)}
            </p>
          )}

          {recipe.dietary && recipe.dietary.length > 0 && (
            <div className="recipe-card__tags">
              {recipe.dietary.map(diet => (
                <span key={diet} className="tag">
                  {diet}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  )

  const renderGroupedResults = () => {
    const grouped = results.reduce((acc, recipe) => {
      const cat = recipe.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(recipe)
      return acc
    }, {})

    return Object.entries(grouped).map(([category, recipes]) => (
      <section key={category} className="search-results__category">
        <h2 className="search-results__category-title">{category}</h2>
        <div className="recipe-grid">
          {recipes.map(renderRecipeCard)}
        </div>
      </section>
    ))
  }

  return (
    <div className="search-results" role="region" aria-label="Search results">
      <div className="search-results__header">
        <p className="search-results__count">
          Found <strong>{resultCount}</strong> {resultText}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {groupByCategory ? (
        renderGroupedResults()
      ) : (
        <div className="recipe-grid recipe-grid--mobile" role="list" aria-label="Recipe results">
          {paginatedResults.map(renderRecipeCard)}
        </div>
      )}

      {infiniteScroll && results.length > itemsPerPage && (
        <div
          ref={sentinelRef}
          className="infinite-scroll-sentinel"
          data-testid="infinite-scroll-sentinel"
          aria-hidden="true"
        />
      )}

      {!infiniteScroll && !groupByCategory && totalPages > 1 && (
        <div className="search-results__pagination">
          <button
            className="pagination-button"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    cookTime: PropTypes.number,
    skill: PropTypes.string,
    difficulty: PropTypes.string,
    category: PropTypes.string,
    dietary: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  loading: PropTypes.bool,
  searchQuery: PropTypes.string,
  groupByCategory: PropTypes.bool,
  highlightSearch: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  infiniteScroll: PropTypes.bool,
  onLoadMore: PropTypes.func
}

SearchResults.defaultProps = {
  loading: false,
  searchQuery: '',
  groupByCategory: false,
  highlightSearch: false,
  itemsPerPage: 20,
  infiniteScroll: false,
  onLoadMore: null
}

export default SearchResults
