import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SheltieWalking } from './illustrations/Decorations';
import './SheltieSightings.css';

/**
 * Occasionally shows a Sheltie silhouette walking across the bottom of the screen.
 */
const SheltieSightings = () => {
    const [active, setActive] = useState(false);
    const [direction, setDirection] = useState(1); // 1: left-to-right, -1: right-to-left

    useEffect(() => {
        const triggerSighting = () => {
            if (Math.random() > 0.7) { // 30% chance every check (matches preview-magical.html line 2734)
                setDirection(Math.random() > 0.5 ? 1 : -1);
                setActive(true);
                setTimeout(() => setActive(false), 8000); // Sighting duration (8 second walk)
            }
        };

        // Trigger one sighting after 3 seconds (matches preview-magical.html line 2741)
        const initialTimeout = setTimeout(triggerSighting, 3000);

        // Then check every 15 seconds (matches preview-magical.html line 2739)
        const interval = setInterval(triggerSighting, 15000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="sheltie-sightings">
            <AnimatePresence>
                {active && (
                    <motion.div
                        className="sighting-wrapper"
                        initial={{ x: direction === 1 ? "-10vw" : "110vw" }}
                        animate={{ x: direction === 1 ? "110vw" : "-10vw" }}
                        transition={{ duration: 8, ease: "linear" }}
                        style={{ scaleX: direction }}
                    >
                        {/* Opacity fade is owned by the CSS sheltieWalk keyframes, as in preview */}
                        <SheltieWalking className="sighting-silhouette" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SheltieSightings;
