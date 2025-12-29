import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import './EphemeraEngine.css'

const EPHEMERA_ITEMS = [
    {
        id: 'giselle-decree',
        type: 'scroll',
        content: 'Royal Decree: More Buttercream!',
        style: { top: '15%', left: '5%', rotate: '-12deg' },
        parallax: 0.1,
        color: 'var(--soft-sakura)'
    },
    {
        id: 'havok-recon',
        type: 'badge',
        content: 'Kitchen Recon: Sector B (Baking Pan) Secure',
        style: { top: '65%', right: '8%', rotate: '15deg' },
        parallax: 0.15,
        color: 'var(--sage-mist)'
    },
    {
        id: 'phaedra-wisdom',
        type: 'lantern',
        content: 'Gentle Philosophy: Patience is the best ingredient.',
        style: { bottom: '15%', left: '10%', rotate: '5deg' },
        parallax: 0.08,
        color: 'var(--pastel-lavender)'
    },
    {
        id: 'tiana-sparkle',
        type: 'sparkle',
        content: '✨ Sparklingly Judgmental ✨',
        style: { top: '40%', right: '15%', rotate: '-5deg' },
        parallax: 0.2,
        color: 'var(--pastel-sky)'
    },
    {
        id: 'vanilla-bean',
        type: 'illustration',
        style: { top: '25%', right: '35%', scale: 0.8 },
        parallax: 0.05,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M50,10 Q60,50 50,90" fill="none" stroke="%235D4D7A" stroke-width="2"/%3E%3Ccircle cx="50" cy="95" r="2" fill="%235D4D7A"/%3E%3C/svg%3E'
    }
];

function EphemeraEngine() {
    return (
        <div className="ephemera-engine" aria-hidden="true">
            {EPHEMERA_ITEMS.map((item) => (
                <motion.div
                    key={item.id}
                    className={`ephemera-item ephemera-${item.type}`}
                    style={{ ...item.style, backgroundColor: item.color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: Math.random() }}
                    whileHover={{ scale: 1.05, rotate: (Math.random() - 0.5) * 10 }}
                >
                    {item.content && <span className="ephemera-text">{item.content}</span>}
                    {item.image && <img src={item.image} alt="" className="ephemera-img" />}

                    {/* Glassmorphism Highlight */}
                    <div className="ephemera-glimmer"></div>
                </motion.div>
            ))}

            {/* Drifting Petals/Particles */}
            <div className="particle-layer">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`petal-${i}`}
                        className="particle petal"
                        initial={{
                            x: Math.random() * 100 + 'vw',
                            y: -20,
                            rotate: 0,
                            opacity: 0
                        }}
                        animate={{
                            y: '110vh',
                            x: (Math.random() * 100 - 10) + 'vw',
                            rotate: 360,
                            opacity: [0, 0.6, 0.6, 0]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 20,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default EphemeraEngine
