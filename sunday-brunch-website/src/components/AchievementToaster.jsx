import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from './illustrations/Decorations';
import './AchievementToaster.css';

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

export const AchievementProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [earned, setEarned] = useState(new Set());

    const unlockAchievement = (id, title, description) => {
        if (earned.has(id)) return;

        const newAchievement = { id, title, description };
        setAchievements(prev => [...prev, newAchievement]);
        setEarned(prev => new Set(prev).add(id));

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setAchievements(prev => prev.filter(a => a.id !== id));
        }, 5000);
    };

    return (
        <AchievementContext.Provider value={{ unlockAchievement }}>
            {children}
            <div className="achievement-container">
                <AnimatePresence>
                    {achievements.map((ach) => (
                        <motion.div
                            key={ach.id}
                            className="achievement-toast"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                        >
                            <div className="toast-icon">
                                <PawPrint color="white" />
                            </div>
                            <div className="toast-content">
                                <span className="toast-title">Achievement Unlocked!</span>
                                <h4 className="ach-name">{ach.title}</h4>
                                <p className="ach-desc">{ach.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </AchievementContext.Provider>
    );
};
