import { Link } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'
import './RelatedContent.css'

function RelatedContent({ related = [], seasonal = [] }) {
    if (!related.length && !seasonal.length) return null

    const onClick = (item) => trackEvent('related_click', { type: item.type, slug: item.slug })

    const renderList = (items, title) => (
        <div className="related__block">
            <h4>{title}</h4>
            <ul className="related__list">
                {items.map((item, idx) => (
                    <li key={idx} className="related__item">
                        <Link to={`/${item.type}/${item.slug}`} onClick={() => onClick(item)}>{item.title}</Link>
                        <span className="related__tag">{item.type}</span>
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <div className="related">
            {related.length > 0 && renderList(related, 'Related')}
            {seasonal.length > 0 && renderList(seasonal, 'Seasonal')}
        </div>
    )
}

export default RelatedContent
