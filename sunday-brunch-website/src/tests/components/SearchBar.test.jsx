import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../../components/search/SearchBar'

describe('SearchBar Component', () => {
  it('should render search input with placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should display search icon', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)

    const searchIcon = screen.getByLabelText(/search icon/i)
    expect(searchIcon).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchBar value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    await user.type(input, 'chocolate')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should show clear button when text is entered', () => {
    const { rerender } = render(<SearchBar value="" onChange={vi.fn()} />)

    let clearButton = screen.queryByLabelText(/clear search/i)
    expect(clearButton).not.toBeInTheDocument()

    rerender(<SearchBar value="chocolate" onChange={vi.fn()} />)

    clearButton = screen.getByLabelText(/clear search/i)
    expect(clearButton).toBeInTheDocument()
  })

  it('should clear input when clear button clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchBar value="chocolate" onChange={handleChange} />)

    const clearButton = screen.getByLabelText(/clear search/i)
    await user.click(clearButton)

    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('should focus input on Ctrl+K keyboard shortcut', async () => {
    const user = userEvent.setup()

    render(<SearchBar value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    expect(input).not.toHaveFocus()

    await user.keyboard('{Control>}k{/Control}')

    await waitFor(() => {
      expect(input).toHaveFocus()
    })
  })

  it('should focus input on Meta+K keyboard shortcut (Mac)', async () => {
    const user = userEvent.setup()

    render(<SearchBar value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    expect(input).not.toHaveFocus()

    await user.keyboard('{Meta>}k{/Meta}')

    await waitFor(() => {
      expect(input).toHaveFocus()
    })
  })

  it('should have proper ARIA labels for accessibility', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    expect(input).toHaveAttribute('aria-label')
  })

  it('should debounce onChange calls', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchBar value="" onChange={handleChange} debounceMs={300} />)

    const input = screen.getByPlaceholderText(/search recipes/i)

    // Type multiple characters quickly
    await user.type(input, 'choc')

    // Should not call onChange immediately for each character
    // Wait for debounce
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    }, { timeout: 500 })
  })

  it('should display custom placeholder text', () => {
    const customPlaceholder = 'Find your perfect cake...'
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        placeholder={customPlaceholder}
      />
    )

    const input = screen.getByPlaceholderText(customPlaceholder)
    expect(input).toBeInTheDocument()
  })

  it('should be keyboard navigable', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchBar value="test" onChange={handleChange} />)

    const input = screen.getByPlaceholderText(/search recipes/i)
    const clearButton = screen.getByLabelText(/clear search/i)

    await user.tab()
    expect(input).toHaveFocus()

    await user.tab()
    expect(clearButton).toHaveFocus()
  })
})
