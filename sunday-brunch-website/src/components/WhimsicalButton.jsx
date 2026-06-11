import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import { AuteurMotion } from '../lib/AuteurMotion';
import { createSparkles } from '../lib/sparkles';
import './WhimsicalButton.css';

const WhimsicalButton = ({
    children,
    onClick,
    type = 'primary',
    variant = 'default', // 'default' or 'nav'
    showPaw = false, // preview-magical.html buttons are text-only (paws appear on hover via CSS)
    className = '',
    disabled = false
}) => {
    const buttonRef = useRef(null);
    const pawRef = useRef(null);

    useEffect(() => {
        // Apply magnetic effect only for nav buttons
        if (buttonRef.current && variant === 'nav') {
            AuteurMotion.makeMagnetic(buttonRef.current);
        }
    }, [variant]);

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
        createSparkles(e);

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
            data-paw-color={variant === 'nav' ? 'dark' : (type === 'primary' ? 'light' : 'dark')}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
        >
            {variant === 'nav' && (
                <div className="whimsical-button__nav-bg">
                    <PawPrint
                        className="whimsical-button__nav-paw"
                        color="var(--midnight-lavender)"
                        opacity="0.25"
                    />
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

WhimsicalButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    variant: PropTypes.oneOf(['default', 'nav']),
    showPaw: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default WhimsicalButton;
