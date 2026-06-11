import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import './ProcessStep.css';

/**
 * A recipe step that reveals a process image through a watercolor mask.
 */
const ProcessStep = ({ stepNumber, content, image }) => {
    return (
        <div className="process-step">
            <span className="process-step__number">{stepNumber}</span>
            <div className="process-step__text">
                <p>{content}</p>
            </div>

            {image && (
                <div className="process-reveal">
                    <div className="reveal-mask-container">
                        <img src={image} alt={`Process step ${stepNumber}`} className="reveal-image" />
                        <div className="watercolor-mask"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessStep;

ProcessStep.propTypes = {
    stepNumber: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
};
