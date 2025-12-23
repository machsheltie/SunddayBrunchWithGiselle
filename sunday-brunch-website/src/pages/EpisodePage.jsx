import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EpisodeTemplate from '../components/EpisodeTemplate'
import CTAForm from '../components/CTAForm'
import { getEpisodeBySlug } from '../lib/content'
import { applyMeta, applyEpisodeSchema } from '../lib/seo'

function EpisodePage() {
    const { slug } = useParams()
    const [episode, setEpisode] = useState(null)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        setStatus('loading')
        getEpisodeBySlug(slug).then((data) => {
            if (data) {
                setEpisode(data)
                applyMeta({
                    title: `${data.title} | Sunday Brunch With Giselle`,
                    description: data.meta?.description,
                    ogImage: data.meta?.ogImage,
                    canonical: `/episodes/${data.slug}`
                })
                applyEpisodeSchema(data)
                setStatus('ready')
            } else {
                setEpisode(null)
                setStatus('missing')
            }
        })
    }, [slug])

    return (
        <section className="section">
            <div className="section__header">
                <h1 className="section__title">Episode</h1>
                <span className="pill">{status === 'ready' ? 'New' : status === 'loading' ? 'Loading' : 'Not found'}</span>
            </div>
            <div className="card">
                {status === 'loading' && <p className="small-muted">Loading episode...</p>}
                {status === 'missing' && <p className="small-muted">We could not find that episode.</p>}
                {status === 'ready' && episode && (
                    <>
                        <EpisodeTemplate episode={episode} />
                        <CTAForm headline="Get the Sunday letter" />
                    </>
                )}
            </div>
        </section>
    )
}

export default EpisodePage
