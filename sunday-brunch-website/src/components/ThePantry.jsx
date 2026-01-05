import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { WhiskIcon, MixingBowl } from './illustrations/Decorations';
import { useAchievements } from './AchievementToaster';
import './ThePantry.css';

const ThePantry = ({ ingredients = [] }) => {
    const { unlockAchievement } = useAchievements();
    const [pantryItems, setPantryItems] = useState(
        ingredients.length > 0 ? ingredients.map((ing, i) => ({ id: `ing-${i}`, ...ing, ready: false })) : [
            { id: 'item-1', name: 'Alchemical Flour', amount: '2 cups', ready: false },
            { id: 'item-2', name: 'Sakura Sugar', amount: '1 cup', ready: false },
            { id: 'item-3', name: 'Etherial Butter', amount: '1/2 cup', ready: false }
        ]
    );

    const toggleReady = (id) => {
        const nextItems = pantryItems.map(item =>
            item.id === id ? { ...item, ready: !item.ready } : item
        );
        setPantryItems(nextItems);

        if (nextItems.every(i => i.ready)) {
            unlockAchievement('perfect-mise', 'Perfect Mise', 'You have gathered all your ingredients with alchemical precision.');
        }
    };

    return (
        <div className="the-pantry alchemist-card">
            <div className="pantry-header">
                <WhiskIcon className="pantry-icon" />
                <h3>The Alchemist's Pantry</h3>
            </div>
            <p className="pantry-desc">Gather your ingredients. A prepared alchemist is a successful baker.</p>

            <Reorder.Group axis="y" values={pantryItems} onReorder={setPantryItems} className="pantry-list">
                {pantryItems.map((item) => (
                    <Reorder.Item
                        key={item.id}
                        value={item}
                        className={`pantry-item ${item.ready ? 'is-ready' : ''}`}
                    >
                        <div className="item-drag-handle">⋮⋮</div>
                        <div className="item-content" onClick={() => toggleReady(item.id)}>
                            <div className="item-checkbox">
                                {item.ready && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-mark">✦</motion.div>}
                            </div>
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className="item-amount">{item.amount}</span>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div className="pantry-footer">
                <div className="pantry-progress">
                    <div
                        className="progress-bar"
                        style={{ width: `${(pantryItems.filter(i => i.ready).length / pantryItems.length) * 100}%` }}
                    />
                </div>
                <div className="pantry-status">
                    {pantryItems.every(i => i.ready) ? (
                        <span className="pantry-complete">Ready for Transmutation! ✨</span>
                    ) : (
                        <span>{pantryItems.filter(i => i.ready).length} of {pantryItems.length} ingredients gathered</span>
                    )}
                </div>
            </div>

            <MixingBowl className="pantry-bowl-decor" />
        </div>
    );
};

export default ThePantry;
