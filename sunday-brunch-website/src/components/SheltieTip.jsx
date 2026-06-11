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

function SheltieTip({ character = 'giselle', children }) {
    const { name, photo, fallback } = SHELTIE_CONFIG[character] || SHELTIE_CONFIG.giselle

    const handleImageError = (e) => {
        if (e.target.src !== fallback) {
            e.target.src = fallback
        }
    }

    return (
        <div className={`sheltie-tip sheltie-tip--${character}`}>
            <img
                className="sheltie-tip__avatar"
                src={photo}
                alt={name.replace(/\s(says|barks|yips|explains)\.\.\./, '')}
                onError={handleImageError}
            />
            <div className="sheltie-tip__body">
                <div className="sheltie-tip__header">
                    <span className="sheltie-tip__name">{name}</span>
                </div>
                <div className="sheltie-tip__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

SheltieTip.propTypes = {
    character: PropTypes.oneOf(['giselle', 'havok', 'tiana', 'phaedra']),
    children: PropTypes.node.isRequired
}

export default SheltieTip
