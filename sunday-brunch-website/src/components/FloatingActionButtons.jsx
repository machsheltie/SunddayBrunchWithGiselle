import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SheltieSilhouette } from './illustrations/Decorations';
import { useAchievements } from './AchievementToaster';
import './FloatingActionButtons.css';

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
            console.log("🔊 AMBIENCE ENGINE: Initializing Sanctuary Layers...");
            console.log("   - Layer 1: Subtle Oven Hum (30% volume)");
            console.log("   - Layer 2: Distance Sheltie Patrol (10% volume)");
            console.log("   - Layer 3: Silverware Clinking (15% volume)");
            unlockAchievement('hubbub-master', 'Master of the Hubbub', 'You have awakened the auditory soul of the sanctuary.');
        } else {
            console.log("🔇 AMBIENCE ENGINE: Fading all layers to silence...");
        }
    }, [ambienceEnabled]);

    const createSparkles = (e, buttonRef) => {
        // Create sparkles & flour particles
        const rect = buttonRef.current.getBoundingClientRect();
        const sparklesCount = 12;

        for (let i = 0; i < sparklesCount; i++) {
            const particle = document.createElement('div');
            const isFlour = i % 2 === 0;
            particle.className = isFlour ? 'flour-particle' : 'sparkle';

            // Random position around click
            const size = isFlour ? Math.random() * 6 + 2 : Math.random() * 10 + 5;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            if (isFlour) {
                // Pinky-peach and pale-yellow
                particle.style.background = i % 4 === 0 ? 'var(--soft-sakura)' : 'var(--light-lemon)';
                particle.style.borderRadius = '50%';
                particle.style.filter = 'blur(1px)';
            } else {
                particle.style.background = 'var(--pastel-lavender)';
                particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            }

            // Random drift
            const tx = (Math.random() - 0.5) * 150;
            const ty = (Math.random() - 0.5) * 150;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            buttonRef.current.appendChild(particle);

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, 800);
        }

        gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
    };

    const handleHubbubClick = (e) => {
        createSparkles(e, hubbubRef);
        setAmbienceEnabled(!ambienceEnabled);
    };

    const handleTopClick = (e) => {
        createSparkles(e, topRef);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`floating-actions ${isVisible ? 'is-visible' : ''}`}>
            <button
                ref={hubbubRef}
                className={`floating-btn hubbub-toggle ${ambienceEnabled ? 'is-active' : ''}`}
                onClick={handleHubbubClick}
                title={ambienceEnabled ? "Mute the kitchen" : "Unmute the kitchen hubbub"}
            >
                <div className="btn-label">{ambienceEnabled ? "Mute Hubbub" : "Enable Hubbub"}</div>
                <span className="hubbub-icon">{ambienceEnabled ? "🔊" : "🔇"}</span>
            </button>

            <button
                ref={topRef}
                className="floating-btn sheltie-jump"
                onClick={handleTopClick}
                title="Lead the way back to the top!"
            >
                <div className="btn-label">Back to Top</div>
                <SheltieSilhouette className="sheltie-silhouette" color="var(--midnight-lavender)" />
            </button>
        </div>
    );
};

export default FloatingActionButtons;
