import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WhimsyPaw } from './illustrations/Decorations';
import './WhimsyLayer.css';

/**
 * WhimsyLayer - Floating pawprints and blobs matching preview-magical.html.
 * GSAP randomizes position and opacity; the CSS `drift` keyframes provide the
 * motion (in the preview the CSS animation overrides GSAP's transform tween,
 * so the effective drift is the constrained ±20px/±8° one — replicated here).
 */
const WhimsyLayer = () => {
    const layerRef = useRef(null);

    // Pawprint colors matching preview
    const pawColors = ['#e8dff5', '#fce1e4', '#b3d9ff', '#dff0ea'];

    // Blob colors/sizes matching preview's inline values (lines 1489-1494)
    const blobColors = ['rgba(252, 225, 228, 0.3)', 'rgba(232, 223, 245, 0.3)', 'rgba(179, 217, 255, 0.3)', 'rgba(223, 240, 234, 0.3)'];
    const blobSizes = [150, 200, 120, 180, 140, 160];

    useEffect(() => {
        if (!layerRef.current) return;

        const items = layerRef.current.querySelectorAll('.whimsy-item');

        items.forEach((el) => {
            // Random placement + opacity - matches preview lines 2442-2448
            // (rotation/scale are owned by the CSS drift animation, as in preview)
            gsap.set(el, {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.2
            });
        });
    }, []);

    return (
        <div className="whimsy-layer" aria-hidden="true" ref={layerRef}>
            {/* 8 Pawprints - matching preview count, staggered drift delays */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={`paw-${i}`}
                    className="whimsy-item whimsy-paw"
                    style={{ animationDelay: `${i * 2}s` }}
                >
                    <WhimsyPaw color={pawColors[i % pawColors.length]} />
                </div>
            ))}

            {/* 6 Blobs - preview's fixed sizes and rgba(.3) washes */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={`blob-${i}`}
                    className="whimsy-item whimsy-blob"
                    style={{
                        background: blobColors[i % blobColors.length],
                        width: `${blobSizes[i]}px`,
                        height: `${blobSizes[i]}px`,
                        animationDelay: `${1 + i * 2}s`
                    }}
                ></div>
            ))}
        </div>
    );
};

export default WhimsyLayer;
