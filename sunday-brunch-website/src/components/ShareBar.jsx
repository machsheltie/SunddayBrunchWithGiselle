import { useLocation } from 'react-router-dom'
import { trackShare, trackPrint } from '../lib/analytics'
import './ShareBar.css'

function ShareBar() {
    const location = useLocation()
    const url = `${window.location.origin}${location.pathname}`

    const handlePrint = () => {
        trackPrint({ type: 'page', path: location.pathname })
        window.print()
    }

    const handleShare = async () => {
        try {
            trackShare('native', { path: location.pathname })
            if (navigator.share) {
                await navigator.share({ url, title: document.title })
            } else {
                await navigator.clipboard.writeText(url)
            }
        } catch (err) {
            trackShare('error', { path: location.pathname, detail: err?.message })
        }
    }

    return (
        <div className="share">
            <button className="share__button" onClick={handlePrint}>Print</button>
            <button className="share__button" onClick={handleShare}>Share link</button>
            <a className="share__link" href={`mailto:?subject=Sunday Brunch With Giselle&body=${encodeURIComponent(url)}`} onClick={() => trackShare('email', { path: location.pathname })}>Email</a>
        </div>
    )
}

export default ShareBar
