import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint } from './illustrations/Decorations';
import './PawFollower.css';

const TRAIL_LIFETIME = 30000; // 30 seconds

const PawFollower = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);
    const [pawColor, setPawColor] = useState('var(--midnight-lavender)');
    const [isInside, setIsInside] = useState(false);

    useEffect(() => {
        const movePaw = (e) => {
            setIsInside(true);
            const { clientX: x, clientY: y } = e;

            // Use elementFromPoint to get the actual element under cursor
            const elementUnderCursor = document.elementFromPoint(x, y);
            // Only lighten pawprint for dark buttons (primary buttons and recipe action buttons)
            const darkButton = elementUnderCursor?.closest('.whimsical-button--primary:not(.whimsical-button--nav), .recipe__action');

            if (darkButton) {
                setPawColor('#FFFFFF'); // Bright white for visibility on dark buttons
            } else {
                setPawColor('var(--midnight-lavender)');
            }

            // Update cursor position for Framer Motion
            setCursorPos({ x, y });

            // Add to trail if mouse moved enough (every 40px as per preview-magical.html)
            setTrail(prev => {
                const last = prev[prev.length - 1];
                if (last && Math.hypot(x - last.x, y - last.y) < 40) return prev;

                const colors = ['rgba(252, 225, 228, 0.4)', 'rgba(232, 223, 245, 0.4)', 'rgba(223, 240, 234, 0.4)'];
                const newPoint = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique key with timestamp + random string
                    x,
                    y,
                    rotation: Math.random() * 30 - 15, // -15 to +15 deg
                    color: colors[Math.floor(Math.random() * colors.length)]
                };

                return [...prev, newPoint].slice(-20); // Keep last 20
            });
        };

        const handleMouseEnter = () => setIsInside(true);
        const handleMouseLeave = () => setIsInside(false);

        const handleClick = (e) => {
            const { clientX: x, clientY: y } = e;
            const elementUnderCursor = document.elementFromPoint(x, y);
            const darkButton = elementUnderCursor?.closest('.whimsical-button--primary:not(.whimsical-button--nav), .recipe__action');

            if (darkButton) {
                setPawColor('#FFFFFF'); // Bright white for visibility on dark buttons
            }
        };

        window.addEventListener('mousemove', movePaw);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', movePaw);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    // Cleanup old trail points (optional if we already slice)
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail(prev => prev.filter(p => Date.now() - p.id < TRAIL_LIFETIME));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="paw-follower-layer"
            aria-hidden="true"
            style={{
                mixBlendMode: pawColor === '#FFFFFF' ? 'normal' : 'multiply'
            }}
        >
            {/* The Trail - stays visible for 2 seconds then fades over 800ms */}
            <AnimatePresence>
                {trail.map(point => (
                    <motion.div
                        key={point.id}
                        className="trail-point"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.2 }}
                        transition={{
                            animate: { duration: 0.3 },
                            exit: { duration: 0.8, delay: 2 } // Stay 2 seconds, then fade over 800ms
                        }}
                        style={{
                            left: point.x,
                            top: point.y,
                            transform: `translate(-50%, -50%) rotate(${point.rotation}deg)`
                        }}
                    >
                        <PawPrint color={point.color} opacity="1" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* The Active Paw - Now using Framer Motion instead of GSAP */}
            <motion.div
                className={`paw-cursor ${isInside ? 'is-visible' : ''}`}
                animate={{ x: cursorPos.x, y: cursorPos.y }}
                transition={{ duration: 0.1, ease: 'linear' }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 99999,
                    filter: pawColor === '#FFFFFF' ? 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 6px rgba(255,255,255,0.6))' : 'none',
                    willChange: 'transform'
                }}
            >
                <PawPrint
                    color={pawColor}
                    opacity={1}
                    style={{ transform: 'translate(-50%, -50%)', width: '32px', height: '32px' }}
                />
            </motion.div>
        </div>
    );
};

export default PawFollower;
