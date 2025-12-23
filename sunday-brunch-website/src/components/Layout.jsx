import { Link, useLocation } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'
import '../App.css'

function Layout({ children }) {
    const location = useLocation()

    const handleNavClick = (label, href) => {
        trackEvent('nav_click', { label, href, from: location.pathname })
    }

    return (
        <div className="app">
            <div className="layout">
                <header className="header">
                    <div className="brand">
                        <span className="brand__title">Sunday Brunch With Giselle</span>
                        <span className="brand__subtitle">Whimsy, warmth, and wags</span>
                    </div>
                    <nav className="nav" aria-label="Primary">
                        <Link className="nav__link" to="/" onClick={() => handleNavClick('Home', '/')}>Home</Link>
                        <Link className="nav__link" to="/recipes" onClick={() => handleNavClick('Recipes', '/recipes')}>Recipes</Link>
                        <Link className="nav__link" to="/episodes/the-pie-that-started-a-dynasty" onClick={() => handleNavClick('Episodes', '/episodes/the-pie-that-started-a-dynasty')}>Episodes</Link>
                        <Link className="nav__link" to="/media-kit" onClick={() => handleNavClick('Media kit', '/media-kit')}>Media Kit</Link>
                        <a className="cta-button" href="/#signup" onClick={() => handleNavClick('Signup CTA', '/#signup')}>Get recipes</a>
                    </nav>
                </header>

                <main>
                    {children}
                </main>

                <footer className="footer">
                    <p>&copy; 2024 Sunday Brunch With Giselle. Recipes, stories, and Sheltie side-eye.</p>
                </footer>
            </div>
        </div>
    )
}

export default Layout
