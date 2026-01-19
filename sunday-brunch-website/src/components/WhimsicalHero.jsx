import React from 'react';
import { Link } from 'react-router-dom';
import './WhimsicalHero.css';

/**
 * WhimsicalHero - Hero section matching preview-magical.html EXACTLY
 * Two-column layout with gradient background, alchemy circle, and photo frame
 */
function WhimsicalHero() {
    return (
        <section className="hero" data-testid="hero">
            {/* Alchemy Circle - Floating Background Magic */}
            <div className="alchemy-circle-container">
                <div className="alchemy-circle"></div>
            </div>

            {/* Left Column: Content */}
            <div className="hero-content animate-slide-in-left">
                <h1 className="hero-title" data-testid="hero-title">
                    Sunday Brunch <span className="hero-script-accent">with</span> Giselle
                </h1>
                <div className="hero-divider"></div>
                <p className="hero-subtitle">Whimsy, warmth, and wags</p>

                {/* Watercolor Quote Wrapper with Organic Mask */}
                <div className="hero-quote-wrapper">
                    <p className="hero-quote">
                        Join Giselle and the pack for Sunday morning magic, fresh recipes, and stories that warm the soul.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="hero-cta-group">
                    <Link to="/episodes/the-pie-that-started-a-dynasty" className="whimsical-button whimsical-button--primary">
                        Latest Episode
                    </Link>
                    <Link to="/recipes" className="whimsical-button whimsical-button--secondary">
                        Browse Recipes
                    </Link>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="hero-visual animate-scale-rotate">
                <div className="photo-frame">
                    {/* Watercolor Splatters */}
                    <div className="watercolor-splatter splatter-1"></div>
                    <div className="watercolor-splatter splatter-2"></div>

                    {/* Washi Tape at top */}
                    <div className="washi-tape">
                        <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            {/* Tape background */}
                            <path d="M0 5 L2 2 L5 0 L95 0 L98 2 L100 5 L100 25 L98 28 L95 30 L5 30 L2 28 L0 25 Z" fill="rgba(232, 223, 245, 0.8)" opacity="0.8" />
                            {/* Top highlight line */}
                            <path d="M0 0 L100 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="2,2" />
                            {/* Bottom shadow line */}
                            <path d="M0 30 L100 30" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                            {/* Pawprints */}
                            <g opacity="0.4">
                                {/* Paw 1 */}
                                <ellipse cx="15" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="12" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="15" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="18" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                {/* Paw 2 */}
                                <ellipse cx="35" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="32" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="35" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="38" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                {/* Paw 3 */}
                                <ellipse cx="50" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="47" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="50" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="53" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                {/* Paw 4 */}
                                <ellipse cx="65" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="62" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="65" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="68" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                {/* Paw 5 */}
                                <ellipse cx="85" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="82" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="85" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                                <ellipse cx="88" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            </g>
                        </svg>
                    </div>

                    {/* Hero Image */}
                    <img
                        src="/assets/stacey-and-giselle.png"
                        alt="Stacey and Giselle in the kitchen"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=500&h=600&fit=crop'; }}
                    />

                    {/* Glimmer Overlay */}
                    <div className="glimmer-overlay"></div>
                </div>
            </div>
        </section>
    );
}

export default WhimsicalHero;
