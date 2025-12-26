import React, { useEffect, useRef } from 'react'
import CharacterShowcase from '../components/CharacterShowcase'
import { applyMeta } from '../lib/seo'
import { AuteurMotion } from '../lib/AuteurMotion'
import './TeamPage.css'

function TeamPage() {
    const headerRef = useRef(null);
    const philosophyRef = useRef(null);

    useEffect(() => {
        applyMeta({
            title: 'Meet the Team | Sunday Brunch With Giselle',
            description: 'Get to know the humans and Shelties behind the whimsical bakes and cozy stories.'
        })

        // Unmask the main header
        if (headerRef.current) {
            AuteurMotion.revealText(headerRef.current);
        }

        // Unmask the philosophy text with physical weight
        if (philosophyRef.current) {
            AuteurMotion.revealText(philosophyRef.current);
        }
    }, [])

    return (
        <div className="team-page-container">
            <header className="recipe-index__header" ref={headerRef}>
                <h1 className="recipe-index__title">Meet the Team</h1>
                <p className="recipe-index__subtitle">The humans, hounds, and hearts of Sunday Brunch</p>
            </header>

            <CharacterShowcase />

            <section className="philosophy-section">
                <h2 className="section__title">Our Philosophy</h2>
                <div className="philosophy-content">
                    <p className="philosophy-text" ref={philosophyRef}>
                        We believe that baking is more than just chemistry—it's a form of storytelling.
                        Whether it's Phaedra analyzing the structural integrity of a crumb or Giselle
                        offering her signature head-tilt encouragement, every recipe is tested with
                        love, logic, and a little bit of fur.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default TeamPage
