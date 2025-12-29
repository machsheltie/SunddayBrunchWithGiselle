import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { substitutions } from '../data/substitutions';
import './IngredientAlchemist.css';

/**
 * An interactive substitution explorer for baking.
 */
const IngredientAlchemist = () => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);

    const filtered = substitutions.filter(s =>
        s.original.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="ingredient-alchemist">
            <div className="alchemist-header">
                <span className="alchemist-icon">⚗️</span>
                <h3>Ingredient Transmutations</h3>
                <p className="alchemist-subtitle">Out of an ingredient? Don't panic, darling.</p>
            </div>

            <div className="alchemist-search">
                <input
                    type="text"
                    placeholder="Search ingredient (e.g. Buttermilk)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="alchemist-grid">
                {filtered.map((sub, idx) => (
                    <motion.div
                        key={idx}
                        className={`sub-card ${selected === idx ? 'is-selected' : ''}`}
                        onClick={() => setSelected(selected === idx ? null : idx)}
                        layout
                    >
                        <div className="sub-card__header">
                            <span className="original-name">{sub.original}</span>
                        </div>

                        <AnimatePresence>
                            {selected === idx && (
                                <motion.div
                                    className="sub-card__details"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="alternatives-list">
                                        {sub.alternatives.map((alt, i) => (
                                            <div key={i} className="alt-item">
                                                <span className="alt-name">{alt.name}</span>
                                                <span className="alt-ratio">{alt.ratio}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="alchemist-tip">
                                        <p><strong>Safe Passage:</strong> {sub.tip}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default IngredientAlchemist;
