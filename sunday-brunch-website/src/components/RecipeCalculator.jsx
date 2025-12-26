import { useState } from 'react';
import './RecipeCalculator.css';

const RecipeCalculator = ({ initialIngredients, initialYield = 1 }) => {
    const [scale, setScale] = useState(1);
    const [isMetric, setIsMetric] = useState(false);

    const formatAmount = (amount) => {
        if (typeof amount !== 'number') return amount;
        const scaled = amount * scale;
        // Simple decimal to fraction or 2 decimal places
        return Number(scaled.toFixed(2)).toString();
    };

    return (
        <div className="recipe-calculator">
            <div className="calculator-controls">
                <div className="control-group">
                    <span className="control-label">Scale:</span>
                    <div className="scale-buttons">
                        {[0.5, 1, 2].map((s) => (
                            <button
                                key={s}
                                className={`calc-btn ${scale === s ? 'is-active' : ''}`}
                                onClick={() => setScale(s)}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
                <div className="control-group">
                    <span className="control-label">Units:</span>
                    <div className="unit-toggle">
                        <button
                            className={`calc-btn ${!isMetric ? 'is-active' : ''}`}
                            onClick={() => setIsMetric(false)}
                        >
                            US
                        </button>
                        <button
                            className={`calc-btn ${isMetric ? 'is-active' : ''}`}
                            onClick={() => setIsMetric(true)}
                        >
                            Metric
                        </button>
                    </div>
                </div>
            </div>

            <ul className="recipe__list">
                {initialIngredients.map((ing, idx) => {
                    // Fallback for old string format
                    if (typeof ing === 'string') return <li key={idx}>{ing}</li>;

                    const amount = isMetric ? ing.metricAmount : ing.amount;
                    const unit = isMetric ? ing.metricUnit : ing.unit;

                    return (
                        <li key={idx} className="ingredient-item">
                            <span className="ing-amount">{formatAmount(amount)}</span>
                            <span className="ing-unit">{unit}</span>
                            <span className="ing-name">{ing.name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RecipeCalculator;
