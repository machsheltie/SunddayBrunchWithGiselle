import AudioPlayer from './AudioPlayer'
import RelatedContent from './RelatedContent'
import GiselleWhisper from './GiselleWhisper'
import WashiTapeStack from './WashiTapeStack'
import SheltieSoundboard from './SheltieSoundboard'
import './EpisodeTemplate.css'

function EpisodeTemplate({ episode }) {
    return (
        <div className="episode-alchemist">
            <div className="episode-header">
                <WashiTapeStack count={2} className="episode-header-tape" />
                <h3 className="episode__title">{episode.title}</h3>
                <p className="episode-meta">Aired on {episode.date || "Sunday Morning"}</p>
            </div>

            <div className="episode-main-grid">
                <div className="episode-primary">
                    <AudioPlayer
                        title="Listen to the Spell"
                        audioUrl={episode.audioUrl}
                        transcript={episode.transcript}
                        context={episode.slug}
                    />

                    {episode.notes && (
                        <div className="episode__notes glass-card">
                            <h4>Chapter Notes</h4>
                            <ul>
                                {episode.notes.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="episode-side">
                    <GiselleWhisper position="right">
                        "This episode was recorded during a particularly chaotic flour explosion. Excuse the sneezing!"
                    </GiselleWhisper>

                    <SheltieSoundboard />

                    <div className="episode-recipe-tease glass-card">
                        <h5>Featured Magic</h5>
                        <p>Learn to bake the pie that started it all.</p>
                        <RelatedContent
                            related={episode.relatedRecipes || []}
                        />
                    </div>
                </div>
            </div>

            <div className="episode-footer-related">
                <RelatedContent
                    related={episode.relatedEpisodes || []}
                />
            </div>
        </div>
    )
}

export default EpisodeTemplate
