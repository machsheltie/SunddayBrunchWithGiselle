import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { SheltieSilhouette } from './illustrations/Decorations';
import './FloatingActionButtons.css';

const FloatingActionButtons = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`floating-actions ${isVisible ? 'is-visible' : ''}`}>
            <button
                className="floating-btn sheltie-jump"
                onClick={scrollToTop}
                title="Lead the way back to the top!"
            >
                <div className="btn-label">Back to Top</div>
                <SheltieSilhouette className="sheltie-silhouette" color="var(--midnight-lavender)" />
            </button>
        </div>
    );
};

export default FloatingActionButtons;
