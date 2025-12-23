import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applyMeta } from '../lib/seo'

function NotFound() {
    useEffect(() => {
        applyMeta({
            title: 'Not Found | Sunday Brunch With Giselle',
            description: 'The page you looked for is missing.'
        })
    }, [])

    return (
        <section className="section">
            <div className="card">
                <h1 className="section__title">We could not find that page.</h1>
                <p className="small-muted">Check the URL or head back to the homepage.</p>
                <Link className="cta-button" to="/">Return home</Link>
            </div>
        </section>
    )
}

export default NotFound
