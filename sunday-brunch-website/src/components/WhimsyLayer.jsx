import React from 'react';
import { WhimsyPaw } from './illustrations/Decorations';
import './WhimsyLayer.css';

/**
 * WhimsyLayer - Floating pawprints and blobs matching preview-magical.html.
 * GSAP randomizes position and opacity; the CSS `drift` keyframes provide the
 * motion (in the preview the CSS animation overrides GSAP's transform tween,
 * so the effective drift is the constrained ±20px/±8° one — replicated here).
 */
const WhimsyLayer = () => {
    // Pawprint colors matching preview
    const pawColors = ['#e8dff5', '#fce1e4', '#b3d9ff', '#dff0ea'];

    // Blob colors/sizes matching preview's inline values (lines 1489-1494)
    const blobColors = ['rgba(252, 225, 228, 0.3)', 'rgba(232, 223, 245, 0.3)', 'rgba(179, 217, 255, 0.3)', 'rgba(223, 240, 234, 0.3)'];
    const blobSizes = [150, 200, 120, 180, 140, 160];
    const pawPositions = [
        { left: '8%', top: '18%', opacity: 0.16 },
        { left: '24%', top: '72%', opacity: 0.22 },
        { left: '39%', top: '28%', opacity: 0.14 },
        { left: '58%', top: '82%', opacity: 0.2 },
        { left: '76%', top: '24%', opacity: 0.18 },
        { left: '91%', top: '64%', opacity: 0.13 },
        { left: '14%', top: '48%', opacity: 0.24 },
        { left: '67%', top: '42%', opacity: 0.17 }
    ];
    const blobPositions = [
        { left: '4%', top: '62%', opacity: 0.15 },
        { left: '19%', top: '36%', opacity: 0.22 },
        { left: '41%', top: '68%', opacity: 0.18 },
        { left: '66%', top: '22%', opacity: 0.2 },
        { left: '78%', top: '72%', opacity: 0.16 },
        { left: '88%', top: '40%', opacity: 0.24 }
    ];

    return (
        <div className="whimsy-layer" aria-hidden="true">
            {/* 8 Pawprints - matching preview count, staggered drift delays */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={`paw-${i}`}
                    className="whimsy-item whimsy-paw"
                    style={{
                        ...pawPositions[i],
                        animationDelay: `${i * 2}s`
                    }}
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
                        ...blobPositions[i],
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
