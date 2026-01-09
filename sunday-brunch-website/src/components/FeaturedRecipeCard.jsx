import { useState } from 'react';
import RecipeTemplate from './RecipeTemplate';
import WhimsicalButton from './WhimsicalButton';
import DietaryBadges from './DietaryBadges';
import './FeaturedRecipeCard.css';

const FeaturedRecipeCard = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
            <div className="featured-recipe-card__image-container">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="featured-recipe-card__image"
                />
                <div className="featured-recipe-card__overlay">
                    <span className="featured-recipe-card__category">{recipe.category}</span>
                </div>
            </div>

            <div className="featured-recipe-card__content">
                <h3 className="featured-recipe-card__title">{recipe.title}</h3>

                {recipe.dietary && recipe.dietary.length > 0 && (
                    <DietaryBadges dietary={recipe.dietary} maxVisible={3} />
                )}

                <div className="featured-recipe-card__meta">
                    <span className="featured-recipe-card__meta-item">
                        <span className="meta-icon">⏱️</span>
                        {recipe.times?.total || '--'}
                    </span>
                    <span className="featured-recipe-card__meta-item">
                        <span className="meta-icon">🍽️</span>
                        {recipe.yield || '--'}
                    </span>
                    <span className="featured-recipe-card__meta-item">
                        <span className="meta-icon">📊</span>
                        {recipe.skill || 'Medium'}
                    </span>
                </div>

                {recipe.story && recipe.story.length > 0 && (
                    <p className="featured-recipe-card__description">
                        {recipe.story[0]}
                    </p>
                )}

                <div className="featured-recipe-card__actions">
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
    );
};

export default FeaturedRecipeCard;
