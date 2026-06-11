import PropTypes from 'prop-types'
import './RecipeSanctuary.css'

/**
 * RecipeSanctuary - Wrapper component for the recipe section
 * Features gradient border, glassmorphic background, and watercolor splatter decorations
 * Matches preview-magical.html lines 692-751
 */
function RecipeSanctuary({ children }) {
    return (
        <section className="recipe-sanctuary">
            <div className="sanctuary-header">
                <h2>The Recipe Sanctuary</h2>
                <p className="sanctuary-subtitle">Where every bake begins with a dash of magic</p>
            </div>
            {children}
        </section>
    )
}

RecipeSanctuary.propTypes = {
    children: PropTypes.node.isRequired
}

export default RecipeSanctuary
