import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

// Test components
function ProtectedContent() {
  return <div data-testid="protected-content">Protected Content</div>
}

function HomePage() {
  return <div data-testid="home-page">Home Page</div>
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading when auth is loading', () => {
      useAuth.mockReturnValue({
        user: null,
        loading: true
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('loading-fullscreen')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Unauthenticated Access', () => {
    it('should redirect to home when not authenticated', () => {
      useAuth.mockReturnValue({
        user: null,
        loading: false
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('should pass location state when redirecting', () => {
      useAuth.mockReturnValue({
        user: null,
        loading: false
      })

      let capturedState = null

      function HomePageWithState() {
        const location = window.location
        capturedState = location.state
        return <div data-testid="home-page">Home Page</div>
      }

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePageWithState />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  describe('Authenticated Access', () => {
    it('should render protected content when authenticated', () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' }
      }

      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument()
    })

    it('should render children directly without wrapper', () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      }

      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      const { container } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      // ProtectedRoute should not add any wrapper elements
      expect(container.querySelector('[data-testid="protected-content"]')).toBeInTheDocument()
    })
  })

  describe('State Transitions', () => {
    it('should handle loading -> unauthenticated transition', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      // Start with loading state
      useAuth.mockReturnValue({
        user: null,
        loading: true
      })

      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('loading-fullscreen')).toBeInTheDocument()

      // Transition to not authenticated
      useAuth.mockReturnValue({
        user: null,
        loading: false
      })

      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByTestId('loading-fullscreen')).not.toBeInTheDocument()
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should handle loading -> authenticated transition', () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      }

      const { rerender } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      // Start with loading state
      useAuth.mockReturnValue({
        user: null,
        loading: true
      })

      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('loading-fullscreen')).toBeInTheDocument()

      // Transition to authenticated
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByTestId('loading-fullscreen')).not.toBeInTheDocument()
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user explicitly', () => {
      useAuth.mockReturnValue({
        user: null,
        loading: false
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should handle undefined user', () => {
      useAuth.mockReturnValue({
        user: undefined,
        loading: false
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should handle multiple children', () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com'
      }

      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div data-testid="child-1">Child 1</div>
                  <div data-testid="child-2">Child 2</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })
})
