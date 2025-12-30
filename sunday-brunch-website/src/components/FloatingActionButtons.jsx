import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { SheltieSilhouette } from './illustrations/Decorations';
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

    const [ambienceEnabled, setAmbienceEnabled] = useState(false);

    useEffect(() => {
        // In a real app, we'd use a looped ambient MP3 here.
        // For now, we'll demonstrate the state management
        if (ambienceEnabled) {
            console.log("🔊 Alchemical Kitchen Hubbub Enabled: [Subtle oven hum, clinking whisk, distant woof]");
        } else {
            console.log("🔇 Ambience Silenced.");
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
