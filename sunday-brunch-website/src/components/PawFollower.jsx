import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import './PawFollower.css';

const TRAIL_LIFETIME = 30000; // 30 seconds

const PawFollower = () => {
    const pawRef = useRef(null);
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

            // Move the main paw
            gsap.to(pawRef.current, {
                x,
                y,
                duration: 0.1,
                ease: 'none'
            });

            // Add to trail if mouse moved enough
            setTrail(prev => {
                const last = prev[prev.length - 1];
                if (last && Math.hypot(x - last.x, y - last.y) < 50) return prev;

                const newPoint = {
                    id: Date.now(),
                    x,
                    y,
                    rotation: Math.random() * 30 - 15,
                    color: ['var(--soft-sakura)', 'var(--pastel-lavender)', 'var(--pastel-sky)'][Math.floor(Math.random() * 3)]
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
            {/* The Trail */}
            <AnimatePresence>
                {trail.map(point => (
                    <motion.div
                        key={point.id}
                        className="trail-point"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.2, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8 }}
                        style={{
                            left: point.x,
                            top: point.y,
                            transform: `translate(-50%, -50%) rotate(${point.rotation}deg)`
                        }}
                    >
                        <PawPrint color={point.color} opacity="0.3" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* The Active Paw */}
            <div
                ref={pawRef}
                className={`paw-cursor ${isInside ? 'is-visible' : ''}`}
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
            </div>
        </div>
    );
};

export default PawFollower;
