import React from 'react';

export const WashiTape = ({ color = "var(--pastel-lavender)", className, style }) => (
    <svg viewBox="0 0 100 30" className={className} style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
            d="M0 5 L2 2 L5 0 L95 0 L98 2 L100 5 L100 25 L98 28 L95 30 L5 30 L2 28 L0 25 Z"
            fill={color}
            opacity="0.8"
        />
        <path d="M0 0 L100 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="2,2" />
        <path d="M0 30 L100 30" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
);

export const PawPrint = ({ color = "var(--pastel-sky)", className, style, opacity = 0.6, width, height }) => (
    <svg viewBox="0 0 100 100" className={className} style={style} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 10 Q40 5 50 10 Q60 5 70 10 Q80 20 75 35 Q65 50 50 45 Q35 50 25 35 Q20 20 30 10" fill={color} opacity={opacity} />
        <ellipse cx="20" cy="50" rx="10" ry="15" transform="rotate(-30 20 50)" fill={color} opacity={opacity} />
        <ellipse cx="80" cy="50" rx="10" ry="15" transform="rotate(30 80 50)" fill={color} opacity={opacity} />
        <ellipse cx="50" cy="75" rx="25" ry="20" fill={color} opacity={opacity * 1.1} />
    </svg>
);

export const WhiskIcon = ({ className }) => (
    <svg viewBox="0 0 50 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 60 L25 90 Q25 95 20 95 L30 95 Q25 95 25 90" stroke="var(--midnight-lavender)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M25 60 C5 60 5 10 25 10 C45 10 45 60 25 60" stroke="var(--dusty-plum)" strokeWidth="2" fill="none" />
        <path d="M25 60 C10 60 10 20 25 20 C40 20 40 60 25 60" stroke="var(--dusty-plum)" strokeWidth="2" fill="none" />
        <path d="M25 60 C15 60 15 30 25 30 C35 30 35 60 25 60" stroke="var(--dusty-plum)" strokeWidth="2" fill="none" />
        <rect x="22" y="60" width="6" height="10" fill="var(--midnight-lavender)" />
    </svg>
);

export const HandDrawnBorder = ({ className }) => (
    <div className={className} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        border: '3px solid var(--midnight-lavender)',
        mask: 'url(#rough-edge)',
        borderStyle: 'solid',
        borderColor: 'var(--midnight-lavender)',
        borderWidth: '2px 3px 3px 2px',
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
        opacity: 0.2
    }}></div>
);

export const RollingPin = ({ className }) => (
    <svg viewBox="0 0 100 30" className={className} xmlns="http://www.w3.org/2000/svg">
        <title>Rolling Pin</title>
        <rect x="20" y="5" width="60" height="20" rx="2" fill="var(--soft-sakura)" stroke="var(--dusty-plum)" strokeWidth="2" />
        <rect x="0" y="10" width="20" height="10" rx="2" fill="var(--midnight-lavender)" stroke="var(--dusty-plum)" strokeWidth="2" />
        <rect x="80" y="10" width="20" height="10" rx="2" fill="var(--midnight-lavender)" stroke="var(--dusty-plum)" strokeWidth="2" />
        <line x1="25" y1="10" x2="75" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    </svg>
);

export const MixingBowl = ({ className }) => (
    <svg viewBox="0 0 100 80" className={className} xmlns="http://www.w3.org/2000/svg">
        <title>Mixing Bowl</title>
        {/* Bowl */}
        <path d="M10 20 L90 20 Q85 75 50 75 Q15 75 10 20" fill="var(--pastel-lavender)" stroke="var(--giselle-color)" strokeWidth="2" />
        {/* Rim */}
        <path d="M10 20 Q50 30 90 20" fill="none" stroke="var(--giselle-color)" strokeWidth="2" />
        <ellipse cx="50" cy="20" rx="40" ry="10" fill="var(--warm-white)" stroke="var(--giselle-color)" strokeWidth="2" />
        {/* Spoon */}
        <path d="M70 10 L45 50" stroke="var(--dusty-plum)" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

export const SheltieSilhouette = ({ color = "var(--midnight-lavender)", className, style }) => (
    <svg viewBox="0 0 100 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <title>Sheltie leading the way</title>
        <path
            d="M20,60 Q25,65 30,60 L40,40 Q45,20 55,25 L65,15 Q70,10 75,15 L80,30 Q95,35 90,50 Q85,60 70,55 L50,70 Q40,75 30,70 Z"
            fill={color}
        />
        <path d="M52,22 L50,15 L55,18 Z" fill={color} />
        <path d="M62,18 L60,11 L65,14 Z" fill={color} />
    </svg>
);

export const CrystalRating = ({ filled, className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" style={{ width: '1.8rem', height: '1.8rem' }}>
        <path
            d="M12 2 L19 7 L19 17 L12 22 L5 17 L5 7 Z"
            fill={filled ? "#D6BCFA" : "none"}
            stroke="#D6BCFA"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        {filled && <path d="M12 5 L12 19 M7 8 L17 16 M17 8 L7 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />}
    </svg>
);

export const MagicWand = ({ className, color = "var(--midnight-lavender)" }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <title>Magic Wand</title>
        {/* Wand stick */}
        <path d="M3 21 L15 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Star at top */}
        <path
            d="M17 3 L18.5 6.5 L22 8 L18.5 9.5 L17 13 L15.5 9.5 L12 8 L15.5 6.5 Z"
            fill={color}
            stroke={color}
            strokeWidth="1"
            strokeLinejoin="round"
        />
        {/* Sparkles */}
        <circle cx="8" cy="16" r="1" fill="var(--pastel-lavender)" />
        <circle cx="11" cy="13" r="0.8" fill="var(--soft-sakura)" />
        <circle cx="6" cy="18" r="0.6" fill="var(--pastel-sky)" />
    </svg>
);
