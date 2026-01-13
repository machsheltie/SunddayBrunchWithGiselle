import AudioPlayer from './AudioPlayer'
import RelatedContent from './RelatedContent'
import GiselleWhisper from './GiselleWhisper'
import SheltieSoundboard from './SheltieSoundboard'
import { WashiTape, PawPrint } from './illustrations/Decorations'
import './EpisodeTemplate.css'

function EpisodeTemplate({ episode }) {
    return (
        <div className="episode-alchemist">
            <div className="episode-header">
                <div className="episode-header-tape-wrapper">
                    <WashiTape className="episode-header-tape tape-1" color="var(--pastel-lavender)" />
                    <WashiTape className="episode-header-tape tape-2" color="var(--soft-sakura)" />
                    {/* Scattered pawprints on the tape for scrapbook charm */}
                    <PawPrint className="episode-tape-paw paw-1" color="var(--midnight-lavender)" opacity="0.25" width="12" height="12" />
                    <PawPrint className="episode-tape-paw paw-2" color="var(--midnight-lavender)" opacity="0.2" width="10" height="10" />
                    <PawPrint className="episode-tape-paw paw-3" color="var(--midnight-lavender)" opacity="0.3" width="14" height="14" />
                    <PawPrint className="episode-tape-paw paw-4" color="var(--midnight-lavender)" opacity="0.22" width="11" height="11" />
                    <PawPrint className="episode-tape-paw paw-5" color="var(--midnight-lavender)" opacity="0.28" width="13" height="13" />
                </div>
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
