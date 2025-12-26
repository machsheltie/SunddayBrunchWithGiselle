import { useState } from 'react';
import './RecipeReviews.css';
import WhimsicalButton from './WhimsicalButton';

const RecipeReviews = ({ recipeSlug }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([
        { id: 1, user: 'BakerBeth', rating: 5, text: 'The tips from Giselle were perfect. My cake finally rose!', date: '2024-12-20' },
        { id: 2, user: 'SourdoughSteve', rating: 4, text: 'Great recipe! I substituted the milk for almond milk and it worked well.', date: '2024-12-22' }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Please select a star rating!');

        const newReview = {
            id: Date.now(),
            user: 'Guest Baker',
            rating,
            text: comment,
            date: new Date().toISOString().split('T')[0]
        };

        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment('');
    };

    return (
        <div className="recipe-reviews">
            <h4 className="reviews-title">Baker Feedback</h4>

            <form className="review-form" onSubmit={handleSubmit}>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            className={`star-btn ${star <= (hover || rating) ? 'is-filled' : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </button>
                    ))}
                    <span className="rating-label">{rating > 0 ? `${rating} Stars` : 'Select a rating'}</span>
                </div>

                <textarea
                    placeholder="Share your experience (did you make any clever swaps?)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />


                <WhimsicalButton type="primary" className="submit-review">
                    Post Review
                </WhimsicalButton>
            </form>

            <div className="reviews-list">
                {reviews.map((rev) => (
                    <div key={rev.id} className="review-card">
                        <div className="review-header">
                            <span className="review-user">{rev.user}</span>
                            <div className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                        </div>
                        <p className="review-text">{rev.text}</p>
                        <span className="review-date">{rev.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeReviews;
