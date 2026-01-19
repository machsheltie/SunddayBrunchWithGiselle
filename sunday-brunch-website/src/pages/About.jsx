import { useEffect } from 'react'
import { applyMeta } from '../lib/seo'
import './About.css'

function About() {
    useEffect(() => {
        applyMeta({
            title: 'About | Sunday Brunch With Giselle',
            description: 'Learn about Sunday Brunch With Giselle - a cozy baking podcast featuring whimsical recipes and four adorable Shetland Sheepdogs.'
        })
    }, [])

    return (
        <div className="about-page">
            <section className="section about-hero">
                <h1>About Sunday Brunch With Giselle</h1>
                <p className="about-subtitle">A cozy corner of the internet for baking, stories, and four very important Sheltie consultants</p>
            </section>

            <section className="section about-content">
                <div className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        Sunday Brunch With Giselle began as a simple Sunday morning ritual: baking something delicious,
                        sharing stories, and enjoying the company of four adorable Shetland Sheepdogs who firmly believe
                        they're essential to the creative process.
                    </p>
                    <p>
                        What started as weekend experiments in the kitchen has blossomed into a collection of whimsical
                        recipes, heartfelt stories, and a community of fellow baking enthusiasts who understand that the
                        best recipes are meant to be shared.
                    </p>
                </div>

                <div className="about-section">
                    <h2>The  Team</h2>
                    <p>
                        While Giselle handles the recipes and storytelling, the real stars are our four Shetland Sheepdogs
                        who provide quality control, moral support, and the occasional paw print in the flour.
                    </p>
                    <p>
                        Together, we create recipes that celebrate the joy of baking - where a little imperfection is
                        perfectly fine, and every Sunday brunch is an adventure.
                    </p>
                </div>

                <div className="about-section">
                    <h2>What We Believe</h2>
                    <ul>
                        <li>Baking should be fun, not stressful</li>
                        <li>Every recipe has a story worth sharing</li>
                        <li>The best meals are enjoyed with loved ones (including four-legged ones)</li>
                        <li>A little flour on the floor means you're doing it right</li>
                        <li>Sunday mornings are sacred</li>
                    </ul>
                </div>

                <div className="about-section">
                    <h2>Join Our Community</h2>
                    <p>
                        Whether you're a seasoned baker or just starting out, we'd love to have you join us for Sunday brunch.
                        Subscribe to get new recipes, behind-the-scenes stories, and the occasional Sheltie photo delivered
                        to your inbox every week.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default About
