import React from 'react';
import { WashiTape } from './illustrations/Decorations';
import './WashiTapeStack.css';

/**
 * A stacked group of washi tape strips for a maximalist scrapbook aesthetic.
 */
const WashiTapeStack = ({ count = 3, className = "" }) => {
    const tapes = [
        { color: "var(--pastel-lavender)", rotation: -2, offset: "10px" },
        { color: "var(--soft-sakura)", rotation: 1, offset: "2px" },
        { color: "var(--pastel-sky)", rotation: -1, offset: "-5px" },
        { color: "var(--pale-buttercream)", rotation: 3, offset: "15px" }
    ];

    return (
        <div className={`washi-tape-stack ${className}`}>
            {tapes.slice(0, count).map((tape, idx) => (
                <WashiTape
                    key={idx}
                    color={tape.color}
                    className="stacked-tape"
                    style={{
                        transform: `rotate(${tape.rotation}deg) translateY(${tape.offset})`,
                        zIndex: 10 - idx
                    }}
                />
            ))}
        </div>
    );
};

export default WashiTapeStack;
