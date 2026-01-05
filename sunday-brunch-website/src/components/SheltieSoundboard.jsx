import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SheltieSilhouette, PawPrint } from './illustrations/Decorations';
import { useAchievements } from './AchievementToaster';
import './SheltieSoundboard.css';

const SheltieSoundboard = () => {
    const { unlockAchievement } = useAchievements();
    const [activeSound, setActiveSound] = useState(null);
    const [playedSounds, setPlayedSounds] = useState(new Set());

    const sounds = [
        { id: 'bork', label: 'Royal Bork', character: 'giselle', icon: '👑', color: 'var(--terracotta-spark)' },
        { id: 'whimper', label: 'Tactical Whimper', character: 'havok', icon: '🛡️', color: 'var(--midnight-lavender)' },
        { id: 'sneeze', label: 'Flour Sneeze', character: 'tiana', icon: '✨', color: 'var(--soft-sakura)' },
        { id: 'howl', label: 'Sage Howl', character: 'phaedra', icon: '🌙', color: 'var(--sage-mist)' }
    ];

    const playSound = (id) => {
        setActiveSound(id);
        const nextPlayed = new Set(playedSounds).add(id);
        setPlayedSounds(nextPlayed);

        if (nextPlayed.size === sounds.length) {
            unlockAchievement('sound-alchemist', 'Sound Alchemist', 'You have mastered the auditory deck of the sanctuary.');
        }

        // Placeholder for actual audio playback
        console.log(`Playing sound: ${id}`);
        setTimeout(() => setActiveSound(null), 1000);
    };

    return (
        <div className="sheltie-soundboard alchemist-card">
            <div className="soundboard-header">
                <SheltieSilhouette className="header-icon" />
                <h3>Sheltie Soundboard</h3>
            </div>
            <p className="soundboard-desc">The essential acoustic deck for any alchemist's kitchen.</p>

            <div className="sound-grid">
                {sounds.map((sound) => (
                    <motion.button
                        key={sound.id}
                        className={`sound-btn btn--${sound.character}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playSound(sound.id)}
                    >
                        <span className="sound-icon">{sound.icon}</span>
                        <span className="sound-label">{sound.label}</span>

                        <AnimatePresence>
                            {activeSound === sound.id && (
                                <motion.div
                                    className="sound-ripple"
                                    initial={{ scale: 0, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ backgroundColor: sound.color }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>

            <div className="soundboard-footer">
                <PawPrint className="footer-paw" color="var(--terracotta-spark)" />
                <span>Adjust volume in the Hubbub Hub</span>
            </div>
        </div>
    );
};

export default SheltieSoundboard;
