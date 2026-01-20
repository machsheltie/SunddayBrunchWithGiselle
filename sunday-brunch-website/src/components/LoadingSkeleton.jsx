import PropTypes from 'prop-types'
import './LoadingSkeleton.css'

function LoadingSkeleton({ type = 'recipe' }) {
    if (type === 'recipe') {
        return (
            <div className="skeleton">
                <div className="skeleton__title"></div>
                <div className="skeleton__meta"></div>
                <div className="skeleton__text skeleton__text--long"></div>
                <div className="skeleton__text skeleton__text--medium"></div>
                <div className="skeleton__text skeleton__text--short"></div>
            </div>
        )
    }

    if (type === 'episode') {
        return (
            <div className="skeleton">
                <div className="skeleton__title"></div>
                <div className="skeleton__player"></div>
                <div className="skeleton__text skeleton__text--medium"></div>
                <div className="skeleton__text skeleton__text--long"></div>
            </div>
        )
    }

    return (
        <div className="skeleton">
            <div className="skeleton__text skeleton__text--medium"></div>
        </div>
    )
}

LoadingSkeleton.propTypes = {
    type: PropTypes.oneOf(['recipe', 'episode'])
}

export default LoadingSkeleton
