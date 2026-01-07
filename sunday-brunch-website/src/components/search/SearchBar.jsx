import { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import './SearchBar.css'

function SearchBar({
  value,
  onChange,
  placeholder = 'Search recipes... (Press / to focus)',
  debounceMs = 0
}) {
  const inputRef = useRef(null)
  const debounceTimeout = useRef(null)

  // Internal state for immediate display
  const [localValue, setLocalValue] = useState(value)

  // Sync local value with prop changes (for external resets)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced update to parent
  useEffect(() => {
    if (debounceMs > 0) {
      const timer = setTimeout(() => {
        onChange(localValue)
      }, debounceMs)
      return () => clearTimeout(timer)
    } else {
      onChange(localValue)
    }
  }, [localValue, debounceMs, onChange])

  const handleChange = (e) => {
    setLocalValue(e.target.value)  // Update local state immediately
  }

  const handleClear = useCallback(() => {
    setLocalValue('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeydown = (e) => {
      // Use "/" key (like GitHub search)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault()
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
      // Keep Cmd/Ctrl+K but don't prevent default to allow browser behavior
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        aria-label="Search icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        aria-label="Search recipes"
      />

      {localValue && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <div className="search-bar__hint">
        Press <kbd>/</kbd> to focus
      </div>
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number
}

SearchBar.defaultProps = {
  placeholder: 'Search recipes... (Press / to focus)',
  debounceMs: 0
}

export default SearchBar
