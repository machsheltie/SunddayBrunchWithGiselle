import React from 'react';

const WatercolorFilters = () => (
    <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
            {/* 
        Filter 1: Paper Texture & Rough Edge
        Creates a displacement map from turbulence to roughen edges and add grain.
      */}
            <filter id="watercolor" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                {/* Generate Noise */}
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="noise" />

                {/* Displacement for "Bleeding" Edge */}
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />

                {/* Slight Blur for Ink Diffusion */}
                <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />

                {/* Composite logic: Blend texture back in for "paper grain" look inside the shape */}
                <feComposite operator="in" in="noise" in2="blurred" result="textured" />
                <feBlend mode="multiply" in="textured" in2="blurred" result="final" />
            </filter>

            {/* 
        Filter 2: Wash Texture
        Softer effect for background washes
      */}
            <filter id="watercolor-wash" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="1.5" />
            </filter>
        </defs>
    </svg>
);

export default WatercolorFilters;
