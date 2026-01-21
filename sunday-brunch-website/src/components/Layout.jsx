import { useState, useEffect, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'
import { useAuth } from '../hooks/useAuth'

// Lazy load Three.js-heavy component (855KB) to improve initial bundle size by 50%
const WatercolorCanvas = lazy(() => import('./WatercolorCanvas'))
import WatercolorFilters from './illustrations/WatercolorFilters'
import GrainOverlay from './GrainOverlay'
import WhimsyLayer from './WhimsyLayer'
import WhimsicalButton from './WhimsicalButton'
import PawFollower from './PawFollower'
import FloatingActionButtons from './FloatingActionButtons'
import SheltieSightings from './SheltieSightings'
import UserMenu from './UserMenu'
import { AuthModal } from './auth'
import './Header.css'
import '../App.css'

function Layout({ children }) {
    const location = useLocation()
    const { user } = useAuth()
    const [authModalOpen, setAuthModalOpen] = useState(false)

    // Auto-open auth modal when redirected from a protected route
    useEffect(() => {
        if (location.state?.requiresAuth && !user) {
            setAuthModalOpen(true)
            trackEvent('auth_required', {
                from: location.state.from?.pathname || 'unknown',
                to: location.pathname
            })
        }
    }, [location, user])

    const handleNavClick = (label, href) => {
        trackEvent('nav_click', { label, href, from: location.pathname })
    }

    return (
        <div className="app">
            <WatercolorFilters />
            <Suspense fallback={<div className="watercolor-canvas-placeholder" aria-hidden="true" />}>
                <WatercolorCanvas />
            </Suspense>
            <GrainOverlay />
            <WhimsyLayer />
            <SheltieSightings />
            <PawFollower />
            <FloatingActionButtons />

            {/* Header - Glassmorphism from preview-magical */}
            <header className="header">
                <div className="header-content">
                    <div>
                        <NavLink
                            to="/"
                            className="brand-link"
                            onClick={() => handleNavClick('Home (Brand)', '/')}
                        >
                            <h1 className="brand-title">
                                Sunday Brunch <span className="brand-accent">with</span> Giselle
                            </h1>
                        </NavLink>
                        <div className="brand-divider"></div>
                        <p className="brand-subtitle">Whimsy, warmth, and wags</p>
                    </div>
                    <nav className="nav-buttons">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                            aria-current={location.pathname === '/' ? 'page' : undefined}
                            onClick={() => handleNavClick('Home', '/')}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/recipes"
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                            aria-current={location.pathname === '/recipes' ? 'page' : undefined}
                            onClick={() => handleNavClick('Recipes', '/recipes')}
                        >
                            Recipes
                        </NavLink>
                        <NavLink
                            to="/episodes/the-pie-that-started-a-dynasty"
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                            aria-current={location.pathname === '/episodes/the-pie-that-started-a-dynasty' ? 'page' : undefined}
                            onClick={() => handleNavClick('Episodes', '/episodes')}
                        >
                            Episodes
                        </NavLink>
                        <NavLink
                            to="/team"
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                            aria-current={location.pathname === '/team' ? 'page' : undefined}
                            onClick={() => handleNavClick('Team', '/team')}
                        >
                            Team
                        </NavLink>
                        {user ? (
                            <UserMenu />
                        ) : (
                            <button
                                className="nav-button"
                                onClick={() => {
                                    setAuthModalOpen(true)
                                    trackEvent('auth_modal_open', { from: location.pathname })
                                }}
                            >
                                Login
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <div className="layout">

                <main>
                    {children}
                </main>

                <footer className="footer">
                    <div className="footer-pawprints">
                        {/* Pawprint rail */}
                        {[...Array(6)].map((_, i) => (
                            <svg key={i} className="paw-icon" width="24" height="24" viewBox="0 0 24 24" fill="var(--pastel-lavender)" opacity={0.5 - (i * 0.08)}>
                                <circle cx="12" cy="14" r="3.5" />
                                <circle cx="8" cy="8" r="2.5" />
                                <circle cx="12" cy="6" r="2.5" />
                                <circle cx="16" cy="8" r="2.5" />
                            </svg>
                        ))}
                    </div>
                    <p>&copy; 2024 Sunday Brunch With Giselle. Recipes, stories, and Sheltie side-eye.</p>
                </footer>
            </div>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialView="login"
            />
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired
}

export default Layout
