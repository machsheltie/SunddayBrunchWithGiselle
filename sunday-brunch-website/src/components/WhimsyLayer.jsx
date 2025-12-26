import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PawPrint } from './illustrations/Decorations';
import './WhimsyLayer.css';

const WhimsyLayer = () => {
    const layerRef = useRef(null);

    useEffect(() => {
        const elements = layerRef.current.querySelectorAll('.whimsy-item');

        elements.forEach((el, i) => {
            // Random organic placement
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const rotation = Math.random() * 360;
            const scale = 0.5 + Math.random() * 1.5;

            gsap.set(el, {
                left: `${x}%`,
                top: `${y}%`,
                rotation: rotation,
                scale: scale,
                opacity: 0.1 + Math.random() * 0.2
            });

            // Subtle drift
            gsap.to(el, {
                x: '+=20',
                y: '+=20',
                rotation: '+=10',
                duration: 10 + Math.random() * 20,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.5
            });
        });
    }, []);

    return (
        <div ref={layerRef} className="whimsy-layer" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
                <div key={`paw-${i}`} className="whimsy-item whimsy-paw">
                    <PawPrint color="var(--pastel-lavender)" />
                </div>
            ))}
            {[...Array(6)].map((_, i) => (
                <div key={`blob-${i}`} className="whimsy-item whimsy-blob" style={{
                    background: i % 3 === 0 ? 'var(--sakura-wash)' : i % 3 === 1 ? 'var(--sky-wash)' : 'var(--lavender-wash)',
                    filter: 'url(#watercolor-wash) blur(40px)',
                    width: `${100 + Math.random() * 200}px`,
                    height: `${100 + Math.random() * 200}px`
                }}></div>
            ))}
        </div>
    );
};

export default WhimsyLayer;
