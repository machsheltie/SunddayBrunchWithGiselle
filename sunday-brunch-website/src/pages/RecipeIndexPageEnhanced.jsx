import { useEffect, useState } from 'react'
import { getRecipes } from '../lib/content'
import { applyMeta } from '../lib/seo'
import ErrorBoundary from '../components/ErrorBoundary'
import SearchBar from '../components/search/SearchBar'
import RecipeFilters from '../components/search/RecipeFilters'
import SearchResults from '../components/search/SearchResults'
import useRecipeSearch from '../hooks/useRecipeSearch'
import './RecipeIndexPageEnhanced.css'

function RecipeIndexPageEnhanced() {
  const [allRecipes, setAllRecipes] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    dietary: [],
    season: 'all',
    difficulty: 'all',
    cookTime: 'all',
    tags: [],
    sortBy: 'newest'
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applyMeta({
      title: 'Recipe Index | Sunday Brunch With Giselle',
      description: 'Search and filter through our whimsical collection of baking recipes. Find your perfect cake, cookie, or pastry!'
    })

    setLoading(true)
    setError(null)

    getRecipes()
      .then(data => {
        setAllRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load recipes:', err)
        setError('Unable to load recipes. Please try refreshing the page.')
        setLoading(false)
      })
  }, [])

  const searchResults = useRecipeSearch(allRecipes, {
    searchQuery,
    ...filters
  })

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen)
  }

  // Escape key and focus trap for mobile drawer
  useEffect(() => {
    if (mobileFiltersOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setMobileFiltersOpen(false)
        }
      }

      document.addEventListener('keydown', handleEscape)

      // Optional: Focus trap
      const focusableElements = document.querySelectorAll(
        '.recipe-filters button, .recipe-filters input, .recipe-filters select, .mobile-close-btn'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const trapFocus = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      document.addEventListener('keydown', trapFocus)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('keydown', trapFocus)
      }
    }
  }, [mobileFiltersOpen])

  return (
    <div className="recipe-index-enhanced">
      {/* Mobile Filter Toggle */}
      <button
        className="mobile-filter-toggle"
        onClick={toggleMobileFilters}
        aria-label="Toggle filters"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        Filters
        {searchResults.count < (allRecipes?.length || 0) && (
          <span className="filter-badge">{searchResults.count}</span>
        )}
      </button>

      <div className="recipe-index-enhanced__layout">
        {/* Sidebar Filters */}
        <aside className={`recipe-index-enhanced__sidebar ${mobileFiltersOpen ? 'is-open' : ''}`}>
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button
              className="mobile-close-btn"
              onClick={toggleMobileFilters}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>

          <RecipeFilters
            filters={filters}
            onChange={handleFiltersChange}
          />
        </aside>

        {/* Main Content */}
        <main className="recipe-index-enhanced__main">
          <header className="recipe-index-enhanced__header">
            <h1 className="recipe-index-enhanced__title">The Recipe Box</h1>
            <p className="recipe-index-enhanced__subtitle">
              Whimsical bakes for every skill level
            </p>
          </header>

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading recipes...</p>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <ErrorBoundary fallback={
              <div className="search-error">
                <p>Search is temporarily unavailable. Please try again.</p>
              </div>
            }>
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                debounceMs={300}
              />

              <SearchResults
                results={searchResults.results}
                loading={searchResults.loading}
                searchQuery={searchQuery}
                highlightSearch={searchQuery.length > 0}
                groupByCategory={false}
              />
            </ErrorBoundary>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileFiltersOpen && (
        <div
          className="mobile-overlay"
          onClick={toggleMobileFilters}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default RecipeIndexPageEnhanced
