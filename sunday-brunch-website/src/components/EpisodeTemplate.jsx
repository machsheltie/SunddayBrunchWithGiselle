import AudioPlayer from './AudioPlayer'
import RelatedContent from './RelatedContent'
import CTAForm from './CTAForm'
import './EpisodeTemplate.css'

function EpisodeTemplate({ episode }) {
    return (
        <div className="episode">
            <h3 className="episode__title">{episode.title}</h3>
            <AudioPlayer
                title="Listen now"
                audioUrl={episode.audioUrl}
                transcript={episode.transcript}
                context={episode.slug}
            />

            {episode.notes && (
                <div className="episode__notes">
                    <h4>Show notes</h4>
                    <ul>
                        {episode.notes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                        ))}
                    </ul>
                </div>
            )}

            <RelatedContent
                related={[...(episode.relatedRecipes || []), ...(episode.relatedEpisodes || [])]}
            />

            <CTAForm headline="Get the Sunday letter" />
        </div>
    )
}

export default EpisodeTemplate
