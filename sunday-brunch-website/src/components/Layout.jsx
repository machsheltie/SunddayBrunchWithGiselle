import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'
import { useAuth } from '../hooks/useAuth'
import WatercolorCanvas from './WatercolorCanvas'
import WatercolorFilters from './illustrations/WatercolorFilters'
import WhimsyLayer from './WhimsyLayer'
import WhimsicalButton from './WhimsicalButton'
import PawFollower from './PawFollower'
import FloatingActionButtons from './FloatingActionButtons'
import SheltieSightings from './SheltieSightings'
import UserMenu from './UserMenu'
import { AuthModal } from './auth'
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
            <WatercolorCanvas />
            <WhimsyLayer />
            <SheltieSightings />
            <PawFollower />
            <FloatingActionButtons />

            <div className="layout">
                <header className="header premium-masthead">
                    {/* Authentication UI - Upper Right Corner */}
                    <div className="header-auth">
                        {user ? (
                            <UserMenu />
                        ) : (
                            <button
                                className="auth-button"
                                onClick={() => {
                                    setAuthModalOpen(true)
                                    trackEvent('auth_modal_open', { from: location.pathname })
                                }}
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    <div className="brand">
                        <Link to="/" className="brand-link">
                            <span className="brand__title">Sunday Brunch <span className="script-accent-masthead">with</span> Giselle</span>
                            <div className="brand-divider"></div>
                            <span className="brand__subtitle">Whimsy, warmth, and wags</span>
                        </Link>
                    </div>
                    <nav className="nav" aria-label="Primary">
                        <Link to="/" onClick={() => handleNavClick('Home', '/')}>
                            <WhimsicalButton variant="nav">Home</WhimsicalButton>
                        </Link>
                        <Link to="/team" onClick={() => handleNavClick('Team', '/team')}>
                            <WhimsicalButton variant="nav">Team</WhimsicalButton>
                        </Link>
                        <Link to="/episodes/the-pie-that-started-a-dynasty" onClick={() => handleNavClick('Episodes', '/episodes/the-pie-that-started-a-dynasty')}>
                            <WhimsicalButton variant="nav">Episodes</WhimsicalButton>
                        </Link>
                        <Link to="/newsletter" onClick={() => handleNavClick('Newsletter', '/newsletter')}>
                            <WhimsicalButton variant="nav">Newsletter</WhimsicalButton>
                        </Link>
                        <Link to="/lab" onClick={() => handleNavClick('The Lab', '/lab')}>
                            <WhimsicalButton variant="nav">The Lab</WhimsicalButton>
                        </Link>
                        <Link to="/recipes">
                            <WhimsicalButton
                                type="primary"
                                variant="nav"
                                className="nav-cta"
                                onClick={() => handleNavClick('Recipes CTA', '/recipes')}
                            >
                                Get recipes
                            </WhimsicalButton>
                        </Link>
                    </nav>
                </header>

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

export default Layout
