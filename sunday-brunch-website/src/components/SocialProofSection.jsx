import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getRecentHighRatedReviews } from '../lib/ratings'
import { trackTestimonialView, trackTestimonialInteraction } from '../lib/analytics'
import TestimonialCard from './TestimonialCard'
import WhimsicalButton from './WhimsicalButton'
import './SocialProofSection.css'

/**
 * Seed testimonials for fallback when no real reviews exist yet
 */
const SEED_TESTIMONIALS = [
    {
        user_name: 'Emma K.',
        rating: 5,
        comment: 'The Royal Velvet Cake was absolutely divine! My family couldn\'t stop raving about it. Giselle\'s instructions made it so easy to follow.',
        recipeTitle: 'Giselle\'s Royal Velvet Cake',
        recipeSlug: 'giselles-royal-velvet-cake'
    },
    {
        user_name: 'Michael R.',
        rating: 5,
        comment: 'I swapped regular flour for almond flour in the brownie recipe and it turned out amazing! More nutty and rich.',
        recipeTitle: 'Fudgy Brownies',
        recipeSlug: 'placeholder-brownie-1'
    },
    {
        user_name: 'Sarah T.',
        rating: 5,
        comment: 'As a beginner baker, I was nervous, but the step-by-step photos and clear instructions gave me so much confidence. My first pie came out perfect!',
        recipeTitle: 'Classic Apple Pie',
        recipeSlug: 'placeholder-pie-1'
    },
    {
        user_name: 'David L.',
        rating: 5,
        comment: 'The Sunday Brunch scones are now a weekly tradition in our house. Light, flaky, and the perfect companion to morning coffee. ☕',
        recipeTitle: 'Sunday Brunch Scones',
        recipeSlug: 'placeholder-breakfast-1'
    }
]

/**
 * SocialProofSection - Rotating testimonials carousel
 *
 * Displays recent 5-star reviews with character replies.
 * Auto-rotates every 5 seconds (pausable on hover).
 * Falls back to seed testimonials if no real reviews exist.
 */
function SocialProofSection() {
    const [testimonials, setTestimonials] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [loading, setLoading] = useState(true)

    // Load real reviews or fallback to seed data
    useEffect(() => {
        async function loadTestimonials() {
            try {
                const realReviews = await getRecentHighRatedReviews(4, 5)

                if (realReviews && realReviews.length > 0) {
                    setTestimonials(realReviews)
                } else {
                    // Use seed testimonials as fallback
                    setTestimonials(SEED_TESTIMONIALS)
                }

                setLoading(false)
            } catch (error) {
                console.error('Error loading testimonials:', error)
                setTestimonials(SEED_TESTIMONIALS)
                setLoading(false)
            }
        }

        loadTestimonials()
    }, [])

    // Auto-rotation every 5 seconds (when not paused)
    useEffect(() => {
        if (isPaused || testimonials.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isPaused, testimonials.length])

    // Track testimonial views
    useEffect(() => {
        if (testimonials.length > 0) {
            const currentTestimonial = testimonials[currentIndex]
            trackTestimonialView(
                currentTestimonial.id || currentIndex,
                currentTestimonial.recipeSlug
            )
        }
    }, [currentIndex, testimonials])

    const handleDotClick = (index) => {
        setCurrentIndex(index)
        trackTestimonialInteraction('manual_navigate', { to_index: index })
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
        trackTestimonialInteraction('manual_navigate', { direction: 'previous' })
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        trackTestimonialInteraction('manual_navigate', { direction: 'next' })
    }

    if (loading) {
        return (
            <section className="social-proof-section">
                <div className="section__header">
                    <h2 className="section__title">What Bakers Are Saying</h2>
                </div>
                <div className="testimonial-carousel skeleton">
                    <div className="skeleton-testimonial"></div>
                </div>
            </section>
        )
    }

    if (testimonials.length === 0) {
        return null
    }

    return (
        <section
            className="social-proof-section"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="section__header">
                <h2 className="section__title">What Bakers Are Saying</h2>
                <p className="section__subtitle">Real reviews from our baking community</p>
            </div>

            <div className="testimonial-carousel">
                <button
                    className="testimonial-carousel__nav testimonial-carousel__nav--prev"
                    onClick={handlePrevious}
                    aria-label="Previous testimonial"
                >
                    ←
                </button>

                <div className="testimonial-carousel__container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="testimonial-carousel__slide"
                        >
                            <TestimonialCard review={testimonials[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    className="testimonial-carousel__nav testimonial-carousel__nav--next"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                >
                    →
                </button>
            </div>

            {/* Navigation dots */}
            <div className="testimonial-carousel__dots">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={`testimonial-carousel__dot ${
                            index === currentIndex ? 'active' : ''
                        }`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>

            {/* CTA */}
            <div className="social-proof-section__cta">
                <a href="/guestbook">
                    <WhimsicalButton type="secondary" showPaw={true}>
                        Join the Community
                    </WhimsicalButton>
                </a>
            </div>
        </section>
    )
}

export default SocialProofSection
