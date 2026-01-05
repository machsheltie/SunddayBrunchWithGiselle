import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { SheltieSilhouette } from './illustrations/Decorations';
import { useAchievements } from './AchievementToaster';
import './FloatingActionButtons.css';

const FloatingActionButtons = () => {
    const [isVisible, setIsVisible] = useState(false);

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
            console.log("🔊 AMBIENCE ENGINE: Initializing Sanctuary Layers...");
            console.log("   - Layer 1: Subtle Oven Hum (30% volume)");
            console.log("   - Layer 2: Distance Sheltie Patrol (10% volume)");
            console.log("   - Layer 3: Silverware Clinking (15% volume)");
            unlockAchievement('hubbub-master', 'Master of the Hubbub', 'You have awakened the auditory soul of the sanctuary.');
        } else {
            console.log("🔇 AMBIENCE ENGINE: Fading all layers to silence...");
        }
    }, [ambienceEnabled]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`floating-actions ${isVisible ? 'is-visible' : ''}`}>
            <button
                className={`floating-btn hubbub-toggle ${ambienceEnabled ? 'is-active' : ''}`}
                onClick={() => setAmbienceEnabled(!ambienceEnabled)}
                title={ambienceEnabled ? "Mute the kitchen" : "Unmute the kitchen hubbub"}
            >
                <div className="btn-label">{ambienceEnabled ? "Mute Hubbub" : "Enable Hubbub"}</div>
                <span className="hubbub-icon">{ambienceEnabled ? "🔊" : "🔇"}</span>
            </button>

            <button
                className="floating-btn sheltie-jump"
                onClick={scrollToTop}
                title="Lead the way back to the top!"
            >
                <div className="btn-label">Back to Top</div>
                <SheltieSilhouette className="sheltie-silhouette" color="var(--midnight-lavender)" />
            </button>
        </div>
    );
};

export default FloatingActionButtons;
