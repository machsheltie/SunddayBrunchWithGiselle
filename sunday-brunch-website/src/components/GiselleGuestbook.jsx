import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrystalRating } from './illustrations/Decorations';
import WhimsicalButton from './WhimsicalButton';
import { useAchievements } from './AchievementToaster';
import './GiselleGuestbook.css';

const GiselleGuestbook = ({ recipeSlug }) => {
    const { unlockAchievement } = useAchievements();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([
        { id: 1, user: 'BakerBeth', rating: 5, text: 'The tips from Giselle were perfect. My cake finally rose!', date: '2024-12-20', reply: { character: 'giselle', text: "Of course it did, darling. I don't give tips for failure." } },
        { id: 2, user: 'SourdoughSteve', rating: 4, text: 'Great recipe! I substituted the milk for almond milk and it worked well.', date: '2024-12-22' }
    ]);

    const getCharacterReply = (rating, text) => {
        if (rating === 5) {
            return { character: 'giselle', text: "A 5-crystal bake? Precision and passion, clearly. You've earned a royal tail-wag." };
        } else if (text.toLowerCase().includes('substitute') || text.toLowerCase().includes('swap')) {
            return { character: 'phaedra', text: "Ah, the alchemy of substitution! Shifting the chemical balance but keeping the heart. Fascinating." };
        } else if (rating <= 3) {
            return { character: 'havok', text: "Deployment failed? Check the oven perimeter! We'll get 'em next mission, baker." };
        }
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Select your alchemical crystals first!');

        const reply = getCharacterReply(rating, comment);

        const newReview = {
            id: Date.now(),
            user: 'Apprentice Alchemist',
            rating,
            text: comment,
            date: new Date().toISOString().split('T')[0],
            reply
        };

        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment('');
        unlockAchievement('guest-sanctuary', 'Guest of the Sanctuary', 'You have signed Giselle\'s Guestbook for the first time.');
    };

    return (
        <div className="recipe-reviews giselle-guestbook">
            <h4 className="reviews-title script-accent">Giselle's Royal Reviews</h4>
            <p className="guestbook-subtitle">Leave your mark on the sanctuary. Rare crystals for rare bakes.</p>

            <form className="review-form" onSubmit={handleSubmit}>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            className="crystal-btn"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <CrystalRating filled={star <= (hover || rating)} />
                        </button>
                    ))}
                    <span className="rating-label">{rating > 0 ? `${rating} Alchemical Crystals` : 'Bestow your crystals'}</span>
                </div>

                <textarea
                    placeholder="Whisper your baking secrets or triumphs here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />

                <div className="submit-review-container">
                    <WhimsicalButton type="primary" className="submit-review">
                        Leave A Royal Review
                    </WhimsicalButton>
                </div>
            </form>

            <div className="reviews-list">
                <AnimatePresence>
                    {reviews.map((rev) => (
                        <motion.div
                            key={rev.id}
                            className="review-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="review-header">
                                <span className="review-user">{rev.user}</span>
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <CrystalRating key={i} filled={i <= rev.rating} className="review-crystal" />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">"{rev.text}"</p>
                            <span className="review-date">{rev.date}</span>

                            {rev.reply && (
                                <div className={`character-reply reply--${rev.reply.character}`}>
                                    <div className="reply-arrow"></div>
                                    <span className="reply-character">{rev.reply.character}:</span>
                                    <p className="reply-text">{rev.reply.text}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GiselleGuestbook;
