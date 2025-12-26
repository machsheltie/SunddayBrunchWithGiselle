import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import './PawFollower.css';

const PawFollower = () => {
    const pawRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const paw = pawRef.current;

        const movePaw = (e) => {
            const isClickable = e.target.closest('a, button, [role="button"], .whimsical-button');
            setIsVisible(!!isClickable);

            if (isClickable) {
                gsap.to(paw, {
                    left: e.clientX,
                    top: e.clientY,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }
        };

        window.addEventListener('mousemove', movePaw);
        return () => window.removeEventListener('mousemove', movePaw);
    }, []);

    return (
        <div
            ref={pawRef}
            className={`paw-follower ${isVisible ? 'is-visible' : ''}`}
            aria-hidden="true"
        >
            <PawPrint color="var(--midnight-lavender)" opacity="0.9" />
        </div>
    );
};

export default PawFollower;
