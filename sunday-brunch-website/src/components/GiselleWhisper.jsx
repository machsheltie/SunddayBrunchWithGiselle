import React from 'react';
import { motion } from 'framer-motion';
import { GiselleAvatar } from './illustrations/SheltieAvatars';
import './GiselleWhisper.css';

/**
 * A floating, stylized note from Giselle that overlaps content.
 */
const GiselleWhisper = ({ children, position = "right" }) => {
    return (
        <motion.div
            className={`giselle-whisper whisper--${position}`}
            initial={{ opacity: 0, scale: 0.8, rotate: position === 'right' ? 5 : -5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 12 }}
        >
            <div className="whisper-paper">
                <div className="whisper-header">
                    <GiselleAvatar className="whisper-avatar" />
                    <span className="whisper-label">Host Whisper</span>
                </div>
                <div className="whisper-content">
                    {children}
                </div>
                <div className="whisper-tape"></div>
            </div>
        </motion.div>
    );
};

export default GiselleWhisper;
