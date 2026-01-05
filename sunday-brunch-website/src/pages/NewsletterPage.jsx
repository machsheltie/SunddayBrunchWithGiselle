import React, { useEffect } from 'react'
import CTAForm from '../components/CTAForm'
import { WashiTape, PawPrint } from '../components/illustrations/Decorations'
import WashiTapeStack from '../components/WashiTapeStack'
import { applyMeta } from '../lib/seo'
import './NewsletterPage.css'

function NewsletterPage() {
    useEffect(() => {
        applyMeta({
            title: 'The Sunday Letter | Sunday Brunch With Giselle',
            description: 'Join the inner circle for weekly recipes, Sheltie stories, and cozy kitchen magic.'
        })
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="newsletter-page">
            <div className="letter-container">
                <div className="envelope-top"></div>

                <div className="letter-body">
                    <WashiTapeStack count={3} className="letter-tape-stack" />

                    <header className="letter-header">
                        <span className="letter-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <h1 className="letter-greeting">Dearest Friend,</h1>
                    </header>

                    <div className="letter-content">
                        <p>
                            Welcome to our corner of the kitchen. Each Sunday, I sit down with a cup of coffee and the pack to write to you. It's not just about recipes (though there are plenty of those); it's about the small, whimsical moments that make a home feel like home.
                        </p>
                        <p>
                            From Giselle's royal demands to the science behind the perfect crumb, these letters are my way of sharing the magic of the Sunday Brunch experience with you.
                        </p>
                        <p className="script-invite">
                            Will you join us at the table?
                        </p>
                    </div>

                    <div className="letter-signoff">
                        <p>With wags and warmth,</p>
                        <p className="signature">Giselle & Stacey</p>
                    </div>

                    <div className="letter-form-wrapper">
                        <CTAForm
                            headline="Subscribe to the Sunday Letter"
                            subcopy="No spam, just sweetness. One letter every Sunday morning."
                        />
                    </div>

                    <PawPrint className="letter-paw" opacity={0.1} />
                </div>

                <div className="envelope-bottom"></div>
            </div>

            <div className="newsletter-decor">
                <div className="floating-petal petal-1"></div>
                <div className="floating-petal petal-2"></div>
                <div className="floating-petal petal-3"></div>
            </div>
        </div>
    )
}

export default NewsletterPage
