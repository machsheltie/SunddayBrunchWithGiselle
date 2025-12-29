import React, { useEffect, useRef } from 'react'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import { AuteurMotion } from '../lib/AuteurMotion'
import WhimsicalButton from './WhimsicalButton'
import { motion } from 'framer-motion'
import './WhimsicalHero.css'

function WhimsicalHero() {
    const titleRef = useRef(null);
    const visualRef = useRef(null);

    return (
        <section className="whimsical-hero chaos-layer">
            <motion.div
                className="whimsical-hero__content collage-item overlap-top"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
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
            </motion.div>

            <motion.div
                className="whimsical-hero__visual collage-item overlap-bottom"
                ref={visualRef}
                initial={{ scale: 0.9, opacity: 0, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, rotate: -2 }}
                transition={{ duration: 1.2, delay: 0.3 }}
            >
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
            </motion.div>

            {/* Decorative Alchemical Graphic */}
            <motion.div
                className="hero-alchemy-graphic"
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="alchemy-circle"></div>
            </motion.div>
        </section>
    )
}

export default WhimsicalHero
