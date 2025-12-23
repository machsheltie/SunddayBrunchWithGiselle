import React from 'react'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import './WhimsicalHero.css'

function WhimsicalHero() {
    return (
        <section className="whimsical-hero">
            <div className="whimsical-hero__content glass-card">
                <h1 className="whimsical-hero__title">
                    Sunday Brunch <span className="script-accent">with</span> Giselle
                </h1>
                <p className="whimsical-hero__text">
                    Join Giselle and the pack for Sunday morning magic, fresh recipes, and stories that warm the soul.
                </p>
                <div className="whimsical-hero__cta-group">
                    <button className="cta-button">Latest Episode</button>
                    <button className="secondary-link">Browse Recipes</button>
                </div>
            </div>

            <div className="whimsical-hero__visual">
                <div className="photo-frame">
                    <WashiTape className="tape-corner" color="var(--pastel-lavender)" />
                    <div className="photo-container">
                        <img
                            src="/assets/stacey-and-giselle.png"
                            alt="Stacey and Giselle baking in a whimsical kitchen"
                            className="hero-watercolor-img"
                        />
                        <div className="glimmer-overlay"></div>
                    </div>
                </div>
                <PawPrint className="hero-decor-paw" />
            </div>
        </section>
    )
}

export default WhimsicalHero
