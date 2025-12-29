import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import { AuteurMotion } from '../lib/AuteurMotion';
import './WhimsicalButton.css';

const WhimsicalButton = ({
    children,
    onClick,
    type = 'primary',
    variant = 'default', // 'default' or 'nav'
    showPaw = true,
    className = ''
}) => {
    const buttonRef = useRef(null);
    const pawRef = useRef(null);

    useEffect(() => {
        // Apply magnetic effect from AuteurMotion
        if (buttonRef.current) {
            AuteurMotion.makeMagnetic(buttonRef.current);
        }
    }, []);

    const handleMouseEnter = () => {
        if (pawRef.current && variant !== 'nav') {
            gsap.to(pawRef.current, {
                scale: 1.2,
                rotate: 15,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        }
    };

    const handleMouseLeave = () => {
        if (pawRef.current && variant !== 'nav') {
            gsap.to(pawRef.current, {
                scale: 1,
                rotate: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    };

    const handleClick = (e) => {
        // Create sparkles & flour particles
        const rect = buttonRef.current.getBoundingClientRect();
        const sparklesCount = 12;

        for (let i = 0; i < sparklesCount; i++) {
            const particle = document.createElement('div');
            const isFlour = i % 2 === 0;
            particle.className = isFlour ? 'flour-particle' : 'sparkle';

            // Random position around click
            const size = isFlour ? Math.random() * 6 + 2 : Math.random() * 10 + 5;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            if (isFlour) {
                // Pinky-peach and pale-yellow
                particle.style.background = i % 4 === 0 ? 'var(--soft-sakura)' : 'var(--light-lemon)';
                particle.style.borderRadius = '50%';
                particle.style.filter = 'blur(1px)';
            } else {
                particle.style.background = 'var(--pastel-lavender)';
                particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            }

            // Random drift
            const tx = (Math.random() - 0.5) * 150;
            const ty = (Math.random() - 0.5) * 150;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            buttonRef.current.appendChild(particle);

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, 800);
        }

        gsap.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
        if (onClick) onClick(e);
    };

    return (
        <button
            ref={buttonRef}
            className={`whimsical-button whimsical-button--${type} whimsical-button--${variant} ${className}`}
            data-paw-color={type === 'primary' ? 'light' : 'dark'}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {variant === 'nav' && (
                <div className="whimsical-button__nav-bg">
                    <PawPrint color="var(--pastel-lavender)" opacity="0.3" />
                </div>
            )}
            <span className="whimsical-button__text">{children}</span>
            {showPaw && variant === 'default' && (
                <div className="whimsical-button__paw-container" ref={pawRef}>
                    <PawPrint
                        className="whimsical-button__paw"
                        color={type === 'primary' ? 'var(--pale-buttercream)' : 'var(--dusty-plum)'}
                    />
                </div>
            )}
            <div className="whimsical-button__watercolor-wash"></div>
        </button>
    );
};

export default WhimsicalButton;
