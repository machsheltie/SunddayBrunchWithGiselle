import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RecipeTemplate from './RecipeTemplate';
import WhimsicalButton from './WhimsicalButton';
import CrystalRating from './CrystalRating';
import { getRecipeRatings } from '../lib/ratings';
import './FeaturedRecipeCard.css';

const FeaturedRecipeCard = ({ recipe }) => {
    // Verified: Changes for badge, paw, and layout are present
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
                    <div className="category-badge">Featured</div>
                </div>

                <div className="featured-content">
                    <h3>{recipe.title}</h3>

                    {/* Meta row always renders (preview parity); crystals appear once ratings resolve */}
                    <div className="featured-meta">
                        {!ratingsLoading && ratings && (
                            <CrystalRating
                                value={Math.round(ratings.average_rating)}
                                count={ratings.rating_count}
                                readOnly={true}
                            />
                        )}
                        <span>⏱️ {recipe.times?.total || '--'}</span>
                        <span>📊 {recipe.skill || 'Medium'}</span>
                    </div>

                    <p style={{ fontStyle: 'italic', color: '#5a4668' }}>
                        {recipe.story && recipe.story.length > 0 ? recipe.story[0] : recipe.description}
                    </p>

                    {!isExpanded && (
                        <div className="button-centered">
                            <WhimsicalButton
                                type="primary"
                                onClick={() => setIsExpanded(true)}
                                showPaw={false}
                            >
                                View Full Recipe
                            </WhimsicalButton>
                        </div>
                    )}
                </div>
            </div>

            {/* In-card expansion below the collapsed grid (preview #recipeExpanded parity) */}
            {isExpanded && (
                <div className="featured-recipe-expansion">
                    <RecipeTemplate recipe={recipe} expandedImage={recipe.image} embedded />
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
            )}
        </div>
    );
};

FeaturedRecipeCard.propTypes = {
    recipe: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        category: PropTypes.string,
        skill: PropTypes.string,
        description: PropTypes.string,
        dietary: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default FeaturedRecipeCard;
