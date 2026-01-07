# Quick Start Guide - Advanced Search Feature

## For Developers: Getting Started in 5 Minutes

### 1. Install & Run Tests

```bash
# Navigate to project
cd sunday-brunch-website

# Dependencies are already installed
# Run tests to verify everything works
npm test

# Expected output:
# Test Files: 3 failed | 1 passed (4)
# Tests: 6 failed | 53 passed (59)
# Pass Rate: 89.8%
```

### 2. Start Development Server

```bash
npm run dev

# Open http://localhost:5173/recipes
```

### 3. Try the Search Feature

Visit `/recipes` in your browser and try:
- **Search:** Type "chocolate" (notice fuzzy search works with "choclate" too)
- **Filters:** Click category buttons, select dietary restrictions
- **Mobile:** Resize browser to mobile width, click FAB button for filters
- **Keyboard:** Press `Ctrl+K` (or `Cmd+K` on Mac) to focus search

## Component Usage Examples

### SearchBar Component

```jsx
import SearchBar from './components/search/SearchBar'

function MyPage() {
  const [query, setQuery] = useState('')

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      debounceMs={300}
      placeholder="Search recipes..."
    />
  )
}
```

### RecipeFilters Component

```jsx
import RecipeFilters from './components/search/RecipeFilters'

function MyPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    dietary: [],
    season: 'all',
    difficulty: 'all',
    cookTime: 'all',
    tags: [],
    sortBy: 'newest'
  })

  return (
    <RecipeFilters
      filters={filters}
      onChange={setFilters}
    />
  )
}
```

### useRecipeSearch Hook

```jsx
import useRecipeSearch from './hooks/useRecipeSearch'

function MyPage() {
  const [recipes, setRecipes] = useState([])
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ /* ... */ })

  const searchResults = useRecipeSearch(recipes, {
    searchQuery: query,
    ...filters
  })

  // searchResults = { results: [...], count: 5, loading: false }

  return (
    <div>
      <p>Found {searchResults.count} recipes</p>
      {searchResults.results.map(recipe => (
        <div key={recipe.slug}>{recipe.title}</div>
      ))}
    </div>
  )
}
```

### SearchResults Component

```jsx
import SearchResults from './components/search/SearchResults'

function MyPage() {
  const searchResults = useRecipeSearch(/* ... */)

  return (
    <SearchResults
      results={searchResults.results}
      loading={searchResults.loading}
      searchQuery="chocolate"
      highlightSearch={true}
      groupByCategory={false}
    />
  )
}
```

## Complete Integration (Enhanced Recipe Index Page)

```jsx
import { useState, useEffect } from 'react'
import { getRecipes } from './lib/content'
import SearchBar from './components/search/SearchBar'
import RecipeFilters from './components/search/RecipeFilters'
import SearchResults from './components/search/SearchResults'
import useRecipeSearch from './hooks/useRecipeSearch'

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

  useEffect(() => {
    getRecipes().then(setAllRecipes)
  }, [])

  const searchResults = useRecipeSearch(allRecipes, {
    searchQuery,
    ...filters
  })

  return (
    <div>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        debounceMs={300}
      />

      <RecipeFilters
        filters={filters}
        onChange={setFilters}
      />

      <SearchResults
        results={searchResults.results}
        loading={searchResults.loading}
        searchQuery={searchQuery}
        highlightSearch={searchQuery.length > 0}
      />
    </div>
  )
}

export default RecipeIndexPageEnhanced
```

## Common Tasks

### Add a New Filter Category

1. Update `RecipeFilters.jsx`:
```jsx
const newFilterOptions = ['Option 1', 'Option 2', 'Option 3']

// Add to JSX
<section className="recipe-filters__section">
  <h3>New Filter</h3>
  <div className="recipe-filters__buttons">
    {newFilterOptions.map(opt => (
      <button
        key={opt}
        onClick={() => handleNewFilterChange(opt)}
        className={`filter-button ${filters.newFilter === opt ? 'is-active' : ''}`}
      >
        {opt}
      </button>
    ))}
  </div>
</section>
```

2. Update `useRecipeSearch.js`:
```jsx
// Add filter logic
if (newFilter !== 'all') {
  filtered = filtered.filter(recipe => recipe.newField === newFilter)
}
```

3. Add tests in `RecipeFilters.test.jsx` and `useRecipeSearch.test.js`

### Customize Search Behavior

Edit `useRecipeSearch.js`:
```jsx
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },        // Increase weight = more important
    { name: 'ingredients.name', weight: 0.3 }, // Add new searchable fields
  ],
  threshold: 0.2,  // Lower = stricter matching (0.0 - 1.0)
  minMatchCharLength: 3  // Minimum characters before search starts
}
```

### Customize Styling

Edit component CSS files:
```css
/* SearchBar.css */
.search-bar {
  --primary-color: #your-color;
  --border-radius: 30px;
  /* ... your custom styles */
}
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Component Tests
```bash
npm test -- SearchBar.test.jsx
npm test -- RecipeFilters.test.jsx
npm test -- SearchResults.test.jsx
npm test -- useRecipeSearch.test.js
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode (Auto-rerun on changes)
```bash
npm test -- --watch
```

## Troubleshooting

### Tests Failing?
1. Check IntersectionObserver mock in `src/tests/setup.js`
2. Verify recipe data has all required fields (difficulty, cookTime, season)
3. Run `npm install` to ensure all dependencies are installed

### Search Not Working?
1. Verify Fuse.js is installed: `npm list fuse.js`
2. Check browser console for errors
3. Verify recipe data structure matches schema

### Filters Not Working?
1. Check Redux DevTools for filter state
2. Verify `onChange` callback is connected
3. Check console for errors

### Styling Issues?
1. Verify CSS files are imported
2. Check CSS custom properties (--pastel-lavender, etc.)
3. Inspect element in browser DevTools

## File Locations

**Components:**
- `src/components/search/SearchBar.jsx`
- `src/components/search/RecipeFilters.jsx`
- `src/components/search/SearchResults.jsx`

**Hooks:**
- `src/hooks/useRecipeSearch.js`

**Pages:**
- `src/pages/RecipeIndexPageEnhanced.jsx`

**Tests:**
- `src/tests/components/SearchBar.test.jsx`
- `src/tests/components/RecipeFilters.test.jsx`
- `src/tests/components/SearchResults.test.jsx`
- `src/tests/hooks/useRecipeSearch.test.js`

**Documentation:**
- `SEARCH_FEATURE_README.md` (comprehensive guide)
- `IMPLEMENTATION_SUMMARY.md` (technical details)
- `QUICK_START_GUIDE.md` (this file)

## Next Steps

1. **Fix Remaining Tests** (1-2 hours)
   - 6 tests need minor adjustments
   - See `IMPLEMENTATION_SUMMARY.md` for details

2. **Deploy to Staging**
   - Test with real users
   - Collect feedback
   - Monitor performance

3. **Plan Future Enhancements**
   - Voice search
   - AI recommendations
   - Advanced filtering
   - See `SEARCH_FEATURE_README.md` for full list

## Support

- **Documentation:** See `SEARCH_FEATURE_README.md`
- **Examples:** Check test files for usage patterns
- **Issues:** Review `IMPLEMENTATION_SUMMARY.md` for known issues

---

**Quick Reference:**
- Install: `npm install`
- Test: `npm test`
- Dev: `npm run dev`
- Build: `npm run build`

**Happy coding!** 🎉
