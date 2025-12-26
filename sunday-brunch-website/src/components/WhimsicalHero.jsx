import React, { useEffect, useRef } from 'react'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import { AuteurMotion } from '../lib/AuteurMotion'
import WhimsicalButton from './WhimsicalButton'
import './WhimsicalHero.css'

function WhimsicalHero() {
    const titleRef = useRef(null);
    const visualRef = useRef(null);

    useEffect(() => {
        // Unmask the massive editorial title
        if (titleRef.current) {
            AuteurMotion.revealText(titleRef.current);
        }

        // Apply physical depth to the photo frame
        if (visualRef.current) {
            AuteurMotion.applyDepth(visualRef.current, -0.1);
        }
    }, []);

    return (
        <section className="whimsical-hero">
            <div className="whimsical-hero__content">
                <h1 className="whimsical-hero__title" ref={titleRef}>
                    Sunday Brunch <span className="script-accent">with</span> Giselle
                </h1>
                <div className="whimsical-hero__quote-wrapper">
                    <p className="whimsical-hero__text">
                        Join Giselle and the pack for Sunday morning magic, fresh recipes, and stories that warm the soul.
                    </p>
                </div>
                <div className="whimsical-hero__cta-group">
                    <WhimsicalButton type="primary">Latest Episode</WhimsicalButton>
                    <WhimsicalButton type="secondary" showPaw={false}>Browse Recipes</WhimsicalButton>
                </div>
            </div>

            <div className="whimsical-hero__visual" ref={visualRef}>
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
