import { Link } from 'react-router-dom'
import './SocialProofSection.css'

/**
 * Get character reply based on rating and comment content
 * @param {number} rating - Star rating (1-5)
 * @param {string} comment - Review comment text
 * @returns {Object|null} Character reply object or null
 */
function getCharacterReply(rating, comment) {
    // 5-star ratings get Giselle's approval
    if (rating === 5) {
        return {
            character: 'Giselle',
            text: 'Your precision brings joy to the sanctuary! 🐾'
        }
    }

    // Mentions of substitutions get Phaedra's alchemy expertise
    if (comment && comment.match(/substitut|swap|replace|instead|alternative/i)) {
        return {
            character: 'Phaedra',
            text: 'Ah, the alchemy of adaptation! Well done. ✨'
        }
    }

    // Low ratings get Havok's encouragement
    if (rating <= 3) {
        return {
            character: 'Havok',
            text: "Keep experimenting! Even the best bakers had rough batches. 🍪"
        }
    }

    return null
}

/**
 * TestimonialCard - Individual review display with character reply
 *
 * Shows user review with rating, comment, recipe reference, and
 * character-based reply for engagement.
 *
 * @param {Object} props
 * @param {Object} props.review - Review object from Supabase
 * @param {string} props.review.user_name - Reviewer name
 * @param {number} props.review.rating - Star rating (1-5)
 * @param {string} props.review.comment - Review text
 * @param {string} props.review.recipeTitle - Recipe name
 * @param {string} props.review.recipeSlug - Recipe slug for linking
 */
function TestimonialCard({ review }) {
    const characterReply = getCharacterReply(review.rating, review.comment)

    return (
        <div className="testimonial-card">
            <div className="testimonial-card__header">
                <div className="testimonial-card__avatar">
                    {review.user_name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="testimonial-card__user-info">
                    <span className="testimonial-card__user-name">
                        {review.user_name || 'Apprentice Alchemist'}
                    </span>
                    <div className="testimonial-card__rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>

            <p className="testimonial-card__comment">"{review.comment}"</p>

            {review.recipeSlug && (
                <Link
                    to={`/recipes/${review.recipeSlug}`}
                    className="testimonial-card__recipe-link"
                >
                    <span className="recipe-link-icon">📖</span>
                    <span className="recipe-link-text">{review.recipeTitle}</span>
                </Link>
            )}

            {characterReply && (
                <div className="testimonial-card__character-reply">
                    <div className="character-reply__header">
                        <span className="character-reply__paw">🐾</span>
                        <span className="character-reply__character">
                            {characterReply.character} says:
                        </span>
                    </div>
                    <p className="character-reply__text">{characterReply.text}</p>
                </div>
            )}
        </div>
    )
}

export default TestimonialCard
