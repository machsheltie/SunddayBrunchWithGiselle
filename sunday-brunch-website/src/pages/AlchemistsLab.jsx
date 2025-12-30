import React from 'react';
import { motion } from 'framer-motion';
import IngredientAlchemist from '../components/IngredientAlchemist';
import WashiTapeStack from '../components/WashiTapeStack';
import { WhiskIcon, RollingPin } from '../components/illustrations/Decorations';
import './AlchemistsLab.css';

/**
 * The Alchemist's Lab - A dedicated page for baking science and substitutions.
 */
const AlchemistsLab = () => {
    return (
        <motion.div
            className="alchemists-lab section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="lab-hero">
                <WashiTapeStack count={4} className="lab-tape" />
                <h1 className="lab-title">The Alchemist's Lab</h1>
                <p className="lab-subtitle">Where Flour Becomes Magic & Mistakes Become Discoveries.</p>
                <WhiskIcon className="lab-decor-whisk" />
            </div>

            <div className="lab-content grid-container">
                <div className="lab-intro card">
                    <h2>Welcome to the Sanctuary of Science</h2>
                    <p>
                        Baking is a conversation with chemistry. In this lab, we provide you with the
                        translations you need when your pantry speaks a different language.
                        Whether you're out of buttermilk or transitioning to vegan alchemy,
                        the secrets are hidden below in plain sight.
                    </p>
                </div>

                <IngredientAlchemist />

                <div className="baking-science-cards">
                    <div className="science-card glass-card">
                        <h3>The Mystery of Risen Cakes</h3>
                        <p>Phaedra's Note: Baking soda needs an acid (like buttermilk or lemon) to react. Without it, your cake will be as flat as a Sheltie's pancake.</p>
                    </div>
                    <div className="science-card glass-card">
                        <RollingPin className="card-icon" />
                        <h3>Temperature Transmutations</h3>
                        <p>Butter at 65°F is the 'Golden Mean'. Too cold, and it won't aerate; too warm, and it will weep. Respect the melt, darling.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AlchemistsLab;
