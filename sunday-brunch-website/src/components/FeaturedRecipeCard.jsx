import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RecipeTemplate from './RecipeTemplate';
import WhimsicalButton from './WhimsicalButton';
import CrystalRating from './CrystalRating';
import DietaryBadges from './DietaryBadges';
import AllergenWarnings from './AllergenWarnings';
import { getRecipeRatings } from '../lib/ratings';
import { getStoryExcerpt } from '../lib/story';
import './FeaturedRecipeCard.css';

const FeaturedRecipeCard = ({ recipe }) => {
    // Verified: Changes for badge, paw, and layout are present
    const [isExpanded, setIsExpanded] = useState(false);
    const [ratings, setRatings] = useState(null);
    const [ratingsLoading, setRatingsLoading] = useState(true);
    // The card blurb describes what the recipe IS (the canonical summary),
    // falling back to the story excerpt only if a recipe is missing its
    // description. See docs/recipe-card-description-standard.md.
    const cardDescription = recipe.description || getStoryExcerpt(recipe.story);

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
                        width="1024"
                        height="1024"
                        loading="lazy"
                        decoding="async"
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

                    {/* Dietary + allergen pills sit with the card meta, in both the
                        collapsed and expanded states. */}
                    {recipe.dietary && recipe.dietary.length > 0 && (
                        <DietaryBadges dietary={recipe.dietary} maxVisible={5} label="Dietary" />
                    )}

                    {recipe.allergens && recipe.allergens.length > 0 && (
                        <AllergenWarnings allergens={recipe.allergens} />
                    )}

                    <p style={{ fontStyle: 'italic', color: '#5a4668' }}>
                        {cardDescription}
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
        story: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.shape({
                headline: PropTypes.string,
                body: PropTypes.string
            })
        ]),
        dietary: PropTypes.arrayOf(PropTypes.string),
        allergens: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default FeaturedRecipeCard;
