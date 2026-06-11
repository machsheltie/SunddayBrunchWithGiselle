import PropTypes from 'prop-types'
import './LatestEpisodeSection.css'

/**
 * LatestEpisodeSection - Wrapper component for the latest episode section
 * Features gradient border, glassmorphic background, and watercolor splatter decorations
 * Matches preview-magical.html lines 1081-1123
 */
function LatestEpisodeSection({ children }) {
    return (
        <section className="latest-episode-section">
            <h2 className="section-title">Latest Episode</h2>
            {children}
        </section>
    )
}

LatestEpisodeSection.propTypes = {
    children: PropTypes.node.isRequired
}

export default LatestEpisodeSection
