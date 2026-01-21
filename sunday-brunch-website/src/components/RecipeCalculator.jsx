import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { formatAlchemicalAmount, getAlchemistReaction } from '../lib/culinaryUtils';
import './RecipeCalculator.css';

const RecipeCalculator = ({ initialIngredients, initialYield = 1, onScaleChange }) => {
    const [scale, setScale] = useState(1);
    const [isMetric, setIsMetric] = useState(false);
    const sliderRef = useRef(null);
    const ingredientsRef = useRef(null);

    // Animate ingredients when scale changes
    useEffect(() => {
        if (ingredientsRef.current) {
            gsap.fromTo(ingredientsRef.current.querySelectorAll('.ingredient-item'),
                { opacity: 0.5, x: -5 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }
            );
        }
    }, [scale, isMetric]);

    // Notify parent component when scale changes
    useEffect(() => {
        if (onScaleChange) {
            onScaleChange(scale);
        }
    }, [scale, onScaleChange]);

    return (
        <div className="recipe-calculator alchemist-card">
            <div className="alchemist-controls">
                <div className="control-group">
                    <label className="alchemist-label">Alchemical Scale</label>
                    <div className="slider-container">
                        <input
                            ref={sliderRef}
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="alchemist-slider"
                        />
                        <div className="scale-display">{scale}x</div>
                    </div>
                </div>

                <div className="control-group">
                    <label className="alchemist-label">Unit System</label>
                    <div className="alchemist-toggle">
                        <button
                            className={`alchemist-btn ${!isMetric ? 'is-active' : ''}`}
                            onClick={() => setIsMetric(false)}
                        >
                            Imperial
                        </button>
                        <button
                            className={`alchemist-btn ${isMetric ? 'is-active' : ''}`}
                            onClick={() => setIsMetric(true)}
                        >
                            Metric
                        </button>
                    </div>
                </div>
            </div>

            {/* Persona Reaction Box */}
            <div className="alchemist-reaction">
                <div className="reaction-bubble">
                    <p>{getAlchemistReaction(scale)}</p>
                </div>
            </div>

            <ul className="recipe__list alchemist-list" ref={ingredientsRef}>
                {initialIngredients.map((ing, idx) => {
                    const amount = isMetric ? ing.metricAmount : ing.amount;
                    const unit = isMetric ? ing.metricUnit : ing.unit;

                    if (!amount) return <li key={idx} className="ingredient-item">{ing.name || ing}</li>;

                    return (
                        <li key={idx} className="ingredient-item">
                            <span className="ing-amount">{formatAlchemicalAmount(amount * scale)}</span>
                            <span className="ing-unit">{unit}</span>
                            <span className="ing-name">{ing.name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

RecipeCalculator.propTypes = {
    initialIngredients: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            unit: PropTypes.string,
            metricAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            metricUnit: PropTypes.string
        })
    ])).isRequired,
    initialYield: PropTypes.number,
    onScaleChange: PropTypes.func
};

export default RecipeCalculator;
