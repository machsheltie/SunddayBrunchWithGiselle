import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SheltieSilhouette } from './illustrations/Decorations';
import './SheltieSightings.css';

/**
 * Occasionally shows a Sheltie silhouette walking across the bottom of the screen.
 */
const SheltieSightings = () => {
    const [active, setActive] = useState(false);
    const [direction, setDirection] = useState(1); // 1: left-to-right, -1: right-to-left

    useEffect(() => {
        const triggerSighting = () => {
            if (Math.random() > 0.7) { // 30% chance every check
                setDirection(Math.random() > 0.5 ? 1 : -1);
                setActive(true);
                setTimeout(() => setActive(false), 8000); // Sighting duration
            }
        };

        const interval = setInterval(triggerSighting, 15000); // Check every 15s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="sheltie-sightings">
            <AnimatePresence>
                {active && (
                    <motion.div
                        className="sighting-wrapper"
                        initial={{ x: direction === 1 ? "-10vw" : "110vw", opacity: 0 }}
                        animate={{ x: direction === 1 ? "110vw" : "-10vw", opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 8, ease: "linear" }}
                        style={{ scaleX: direction }}
                    >
                        <SheltieSilhouette className="sighting-silhouette" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SheltieSightings;
