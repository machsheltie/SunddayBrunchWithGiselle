import PropTypes from 'prop-types'
import { trackAffiliateClick } from '../lib/analytics'
import './ToolsUsed.css'

function ToolsUsed({ tools = [] }) {
    if (!tools.length) return null

    return (
        <div className="tools">
            <div className="tools__header">
                <h4>Tools used</h4>
                <span className="tools__disclosure">Contains affiliate links</span>
            </div>
            <ul className="tools__list">
                {tools.map((tool, idx) => (
                    <li key={idx} className="tools__item">
                        <a href={tool.link} onClick={() => trackAffiliateClick(tool)}>{tool.name}</a>
                        <span className="tools__tag">{tool.category}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

ToolsUsed.propTypes = {
    tools: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
    }))
}

export default ToolsUsed
