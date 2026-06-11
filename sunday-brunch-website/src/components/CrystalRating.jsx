import { useState } from 'react';
import PropTypes from 'prop-types';
import './CrystalRating.css';

/**
 * CrystalRating Component
 *
 * Interactive crystal-shaped rating system matching preview-magical.html (lines 2494-2562)
 *
 * Features:
 * - Progressive hover fill (hovering over crystal N fills crystals 1 through N)
 * - Crystals fill with #D6BCFA color
 * - Adds facet lines when filled
 * - Scale(1.15) and drop-shadow glow on hover
 * - Click to select rating
 * - Mouse leave resets to selected or empty
 *
 * Props:
 * - value: Current rating (1-5)
 * - count: Optional rating count to display
 * - onChange: Callback when rating is clicked
 * - readOnly: Disable interaction (default: false)
 */
const CrystalRating = ({ value = 0, count, onChange, readOnly = false }) => {
    const [hoverValue, setHoverValue] = useState(0);
    const [selectedValue, setSelectedValue] = useState(value);

    const handleCrystalHover = (rating) => {
        if (readOnly) return;
        setHoverValue(rating);
    };

    const handleContainerLeave = () => {
        if (readOnly) return;
        setHoverValue(0);
    };

    const handleCrystalClick = (rating) => {
        if (readOnly) return;
        setSelectedValue(rating);
        if (onChange) {
            onChange(rating);
        }
    };

    const displayValue = hoverValue || selectedValue;

    return (
        <div
            className="crystal-rating-container"
            onMouseLeave={handleContainerLeave}
            role={readOnly ? "img" : "slider"}
            aria-label={readOnly ? `Rating: ${selectedValue} out of 5 crystals` : `Rate from 1 to 5 crystals. Current rating: ${selectedValue}`}
            aria-valuenow={readOnly ? undefined : selectedValue}
            aria-valuemin={readOnly ? undefined : 1}
            aria-valuemax={readOnly ? undefined : 5}
        >
            <div className="crystal-rating-stars">
                {[1, 2, 3, 4, 5].map((rating) => {
                    const isFilled = rating <= displayValue;
                    const isHovered = !readOnly && hoverValue > 0 && rating <= hoverValue;

                    return (
                        <svg
                            key={rating}
                            className={`crystal-rating ${isHovered ? 'crystal-rating--hover' : ''} ${!readOnly ? 'crystal-rating--interactive' : ''}`}
                            data-rating={rating}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onMouseEnter={() => handleCrystalHover(rating)}
                            onClick={() => handleCrystalClick(rating)}
                            style={{
                                width: '1rem',
                                height: '1rem',
                                cursor: readOnly ? 'default' : 'pointer',
                                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                                filter: isHovered ? 'drop-shadow(0 0 10px #D6BCFA)' : 'none',
                                transition: 'transform 0.2s ease, filter 0.2s ease'
                            }}
                        >
                            {/* Crystal outline */}
                            <path
                                className="crystal-outline"
                                d="M12 2 L19 7 L19 17 L12 22 L5 17 L5 7 Z"
                                fill={isFilled ? '#D6BCFA' : 'none'}
                                stroke="#D6BCFA"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />

                            {/* Crystal facets - only show when filled */}
                            {isFilled && (
                                <path
                                    className="crystal-facets"
                                    d="M12 5 L12 19 M7 8 L17 16 M17 8 L7 16"
                                    stroke="rgba(255,255,255,0.4)"
                                    strokeWidth="1"
                                />
                            )}
                        </svg>
                    );
                })}
            </div>

            {count !== undefined && count !== null && (
                <span className="crystal-rating-count">({count})</span>
            )}
        </div>
    );
};

CrystalRating.propTypes = {
    value: PropTypes.number,
    count: PropTypes.number,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default CrystalRating;
