import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from './illustrations/Decorations';
import './WhimsicalLoader.css';

/**
 * Whimsical Loading Component
 *
 * Used as Suspense fallback during code splitting.
 * Maintains brand aesthetic during page transitions.
 */
const WhimsicalLoader = ({ fullscreen = false }) => {
    return (
        <div
            className={`whimsical-loader ${fullscreen ? 'whimsical-loader--fullscreen' : ''}`}
            data-testid="whimsical-loader"
        >
            <div className="whimsical-loader__content">
                {/* Animated paw prints */}
                <div className="whimsical-loader__paws">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="whimsical-loader__paw"
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                                y: [20, 0, -20]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: 'easeInOut'
                            }}
                        >
                            <PawPrint
                                color="var(--pastel-lavender)"
                                opacity={0.8}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Loading text with whimsical animation */}
                <motion.p
                    className="whimsical-loader__text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.7, 1] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    Preparing something magical...
                </motion.p>
            </div>
        </div>
    );
};

export default WhimsicalLoader;
