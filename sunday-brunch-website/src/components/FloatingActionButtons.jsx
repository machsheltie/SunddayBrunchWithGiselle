import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAchievements } from './AchievementToaster';
import { createLogger } from '../lib/logger';
import { createSparkles } from '../lib/sparkles';
import './FloatingActionButtons.css';

const logger = createLogger('FloatingActions');

const FloatingActionButtons = () => {
    const [isVisible, setIsVisible] = useState(false);
    const hubbubRef = useRef(null);
    const topRef = useRef(null);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const { unlockAchievement } = useAchievements();
    const [ambienceEnabled, setAmbienceEnabled] = useState(false);

    useEffect(() => {
        if (ambienceEnabled) {
            logger.debug("AMBIENCE ENGINE: Initializing Sanctuary Layers", {
                layers: [
                    "Layer 1: Subtle Oven Hum (30% volume)",
                    "Layer 2: Distance Sheltie Patrol (10% volume)",
                    "Layer 3: Silverware Clinking (15% volume)"
                ]
            });
            unlockAchievement('hubbub-master', 'Master of the Hubbub', 'You have awakened the auditory soul of the sanctuary.');
        } else {
            logger.debug("AMBIENCE ENGINE: Fading all layers to silence");
        }
    }, [ambienceEnabled]);

    const bounceButton = (buttonRef) => {
        gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
    };

    const handleHubbubClick = (e) => {
        createSparkles(e);
        bounceButton(hubbubRef);
        setAmbienceEnabled(!ambienceEnabled);
    };

    const handleTopClick = (e) => {
        createSparkles(e);
        bounceButton(topRef);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`floating-actions ${isVisible ? 'is-visible' : ''}`}>
            {/* Icon-only circles per preview; labels live in title/aria-label */}
            <button
                ref={hubbubRef}
                className={`floating-btn hubbub-toggle ${ambienceEnabled ? 'is-active' : ''}`}
                onClick={handleHubbubClick}
                title={ambienceEnabled ? "Mute the kitchen" : "Unmute the kitchen hubbub"}
                aria-label={ambienceEnabled ? "Mute the kitchen hubbub" : "Enable the kitchen hubbub"}
            >
                <span className="hubbub-icon" aria-hidden="true">{ambienceEnabled ? "🔊" : "🔇"}</span>
            </button>

            <button
                ref={topRef}
                className="floating-btn back-to-top"
                onClick={handleTopClick}
                title="Back to top"
                aria-label="Back to top"
            >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 4L4 12H8V20H16V12H20L12 4Z" />
                </svg>
            </button>
        </div>
    );
};

export default FloatingActionButtons;
