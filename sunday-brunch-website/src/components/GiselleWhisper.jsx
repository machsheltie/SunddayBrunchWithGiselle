import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GiselleAvatar } from './illustrations/SheltieAvatars';
import { AuteurMotion } from '../lib/AuteurMotion';
import './GiselleWhisper.css';

const GiselleWhisper = ({
    text = "Is it brunch time yet? I've been ready for five minutes.",
    position = { top: '20%', right: '10%' }
}) => {
    const containerRef = useRef(null);
    const bubbleRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Initial reveal
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.8, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 1, delay: 1, ease: 'back.out(1.7)' }
            );

            // Subtle floating idle
            gsap.to(containerRef.current, {
                y: '+=10',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Make magnetic
            AuteurMotion.makeMagnetic(containerRef.current);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="giselle-whisper"
            style={{ ...position, position: 'absolute' }}
        >
            <div className="giselle-whisper__avatar-wrap">
                <GiselleAvatar className="giselle-whisper__avatar" />
                <div className="giselle-whisper__badge">The Queen Says:</div>
            </div>
            <div ref={bubbleRef} className="giselle-whisper__bubble">
                <p className="giselle-whisper__text">{text}</p>
                <div className="giselle-whisper__tail"></div>
            </div>
        </div>
    );
};

export default GiselleWhisper;
