import PropTypes from 'prop-types'
import './SheltieTip.css'

// Character portrait photos (80px round avatars, preview parity) with a
// dicebear fallback if a portrait fails to load
const SHELTIE_CONFIG = {
    giselle: {
        name: 'Giselle says...',
        photo: '/images/recipes/giselle-portrait.png',
        fallback: 'https://api.dicebear.com/7.x/bottts/svg?seed=giselle&backgroundColor=d6bcfa'
    },
    havok: {
        name: 'Havok barks...',
        photo: '/images/recipes/havok-portrait.png',
        fallback: 'https://api.dicebear.com/7.x/bottts/svg?seed=havok&backgroundColor=dcdcdc'
    },
    tiana: {
        name: 'Tiana yips...',
        photo: '/images/recipes/tiana-portrait.png',
        fallback: 'https://api.dicebear.com/7.x/bottts/svg?seed=tiana&backgroundColor=ffb6c1'
    },
    phaedra: {
        name: 'Phaedra explains...',
        photo: '/images/recipes/phaedra-portrait.png',
        fallback: 'https://api.dicebear.com/7.x/bottts/svg?seed=phaedra&backgroundColor=e8dff5'
    }
}

// `segmentName` turns a casual tip ("Havok barks...") into a named recurring
// segment ("🐾 Havok's Kitchen Recon") with an optional one-line purpose tag.
// Left unset, the component behaves exactly as before.
function SheltieTip({ character = 'giselle', segmentName = null, purpose = null, children }) {
    const { name, photo, fallback } = SHELTIE_CONFIG[character] || SHELTIE_CONFIG.giselle
    const avatarAlt = name.replace(/\s(says|barks|yips|explains)\.\.\./, '')

    const handleImageError = (e) => {
        if (e.target.src !== fallback) {
            e.target.src = fallback
        }
    }

    return (
        <aside
            className={`sheltie-tip sheltie-tip--${character}`}
            aria-label={segmentName || avatarAlt}
        >
            <img
                className="sheltie-tip__avatar"
                src={photo}
                alt={avatarAlt}
                width="1024"
                height="1024"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
            />
            <div className="sheltie-tip__body">
                <div className="sheltie-tip__header">
                    <span className="sheltie-tip__name">
                        {segmentName ? `🐾 ${segmentName}` : name}
                    </span>
                    {purpose && <span className="sheltie-tip__purpose">{purpose}</span>}
                </div>
                <div className="sheltie-tip__content">
                    {children}
                </div>
            </div>
        </aside>
    )
}

SheltieTip.propTypes = {
    character: PropTypes.oneOf(['giselle', 'havok', 'tiana', 'phaedra']),
    segmentName: PropTypes.string,
    purpose: PropTypes.string,
    children: PropTypes.node.isRequired
}

export default SheltieTip
