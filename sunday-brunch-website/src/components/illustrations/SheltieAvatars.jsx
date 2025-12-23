import React from 'react';

// Simple image-based avatars using the generated watercolor portraits
export const GiselleAvatar = ({ className }) => (
  <img 
    src="/images/shelties/giselle.png" 
    alt="Giselle - The Queen" 
    className={className}
    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
  />
);

export const PhaedraAvatar = ({ className }) => (
  <img 
    src="/images/shelties/phaedra.png" 
    alt="Phaedra - The Science Dogter" 
    className={className}
    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
  />
);

export const TianaAvatar = ({ className }) => (
  <img 
    src="/images/shelties/tiana.png" 
    alt="Tiana - The Joyful Taster" 
    className={className}
    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
  />
);

export const HavokAvatar = ({ className }) => (
  <img 
    src="/images/shelties/havok.png" 
    alt="Havok - The Kitchen War Correspondent" 
    className={className}
    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
  />
);
