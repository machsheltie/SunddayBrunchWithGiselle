import { useState, useEffect } from 'react';
import RecipeTemplate from './RecipeTemplate';
import WhimsicalButton from './WhimsicalButton';
import DietaryBadges from './DietaryBadges';
import StarRating from './StarRating';
import { getRecipeRatings } from '../lib/ratings';
import './FeaturedRecipeCard.css';

const FeaturedRecipeCard = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [ratings, setRatings] = useState(null);
    const [ratingsLoading, setRatingsLoading] = useState(true);

    useEffect(() => {
        // Fetch ratings for this recipe
        if (recipe?.slug) {
            setRatingsLoading(true);
            getRecipeRatings(recipe.slug)
                .then(({ data, error }) => {
                    if (data && !error) {
                        setRatings(data);
                    } else {
                        setRatings(null);
                    }
                })
                .finally(() => {
                    setRatingsLoading(false);
                });
        }
    }, [recipe?.slug]);

    if (isExpanded) {
        return (
            <div className="featured-recipe-expanded">
                <RecipeTemplate recipe={recipe} expandedImage={recipe.image} />
                <div className="featured-recipe-collapse">
                    <WhimsicalButton
                        type="secondary"
                        onClick={() => setIsExpanded(false)}
                        showPaw={false}
                    >
                        Collapse Recipe
                    </WhimsicalButton>
                </div>
            </div>
        );
    }

    return (
        <div className="featured-recipe-card">
            {/* Washi Tape - Decorative element matching preview-magical.html */}
            <div className="card-washi-top">
                <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {/* Tape background */}
                    <path d="M0 5 L2 2 L5 0 L95 0 L98 2 L100 5 L100 25 L98 28 L95 30 L5 30 L2 28 L0 25 Z" fill="rgba(232, 223, 245, 0.8)" opacity="0.8" />
                    {/* Top highlight line */}
                    <path d="M0 0 L100 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="2,2" />
                    {/* Bottom shadow line */}
                    <path d="M0 30 L100 30" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                    {/* Pawprints */}
                    <g opacity="0.4">
                        {/* Paw 1 */}
                        <ellipse cx="20" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="17" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="20" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="23" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        {/* Paw 2 */}
                        <ellipse cx="50" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="47" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="50" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="53" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        {/* Paw 3 */}
                        <ellipse cx="80" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="77" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="80" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="83" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                    </g>
                </svg>
            </div>

            <div className="featured-recipe-grid">
                <div className="featured-image-container">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                    />
                    <div className="category-badge">{recipe.category}</div>
                </div>

                <div className="featured-content">
                    <h3>{recipe.title}</h3>

                    {!ratingsLoading && ratings && (
                        <div className="featured-meta">
                            {/* Crystal rating stars - inline with other meta */}
                            <span style={{ display: 'inline-flex', gap: '0.2rem', alignItems: 'center' }}>
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                                        <path d="M12 2 L19 7 L19 17 L12 22 L5 17 L5 7 Z" fill="#D6BCFA" stroke="#D6BCFA" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M12 5 L12 19 M7 8 L17 16 M17 8 L7 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                                    </svg>
                                ))}
                                <span style={{ marginLeft: '0.3rem' }}>({ratings.rating_count})</span>
                            </span>
                            <span>⏱️ {recipe.times?.total || '--'}</span>
                            <span>📊 {recipe.skill || 'Medium'}</span>
                        </div>
                    )}

                    <p style={{ fontStyle: 'italic', color: '#5a4668' }}>
                        {recipe.story && recipe.story.length > 0 ? recipe.story[0] : recipe.description}
                    </p>

                    <div className="button-centered">
                        <WhimsicalButton
                            type="primary"
                            onClick={() => setIsExpanded(true)}
                            showPaw={true}
                        >
                            View Full Recipe
                        </WhimsicalButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedRecipeCard;
