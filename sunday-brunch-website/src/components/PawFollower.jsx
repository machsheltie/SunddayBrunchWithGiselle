import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import './PawFollower.css';

const PawFollower = () => {
    const pawRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [pawColor, setPawColor] = useState('var(--midnight-lavender)');

    useEffect(() => {
        const paw = pawRef.current;


        const movePaw = (e) => {
            const isClickable = e.target.closest('a, button, [role="button"], .whimsical-button');
            setIsVisible(!!isClickable);

            if (isClickable) {
                // Check if the element or its parent asks for a light paw
                const needsLightPaw = isClickable.getAttribute('data-paw-color') === 'light' ||
                    isClickable.classList.contains('whimsical-button--primary');

                setPawColor(needsLightPaw ? 'var(--soft-sakura)' : 'var(--midnight-lavender)');

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
            <PawPrint color={pawColor} opacity="0.9" />
        </div>
    );
};

export default PawFollower;
