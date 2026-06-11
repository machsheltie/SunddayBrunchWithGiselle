import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import SheltieSoundboard from './SheltieSoundboard';
import WhimsicalButton from './WhimsicalButton';
import './FeaturedEpisodeCard.css';

const GISELLE_AVATAR_FALLBACK = 'https://api.dicebear.com/7.x/bottts/svg?seed=giselle&backgroundColor=d6bcfa';

const FeaturedEpisodeCard = ({ episode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const featuredRecipe = episode.relatedRecipes?.[0];

    return (
        <div className="featured-episode-card" id="episodeCard">
            {/* Washi Tape Decoration - Centered at top */}
            <div className="card-washi-top">
                <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {/* Tape background */}
                    <path d="M0 5 L2 2 L5 0 L95 0 L98 2 L100 5 L100 25 L98 28 L95 30 L5 30 L2 28 L0 25 Z" fill="rgba(232, 223, 245, 0.8)" opacity="0.8" />
                    {/* Top highlight line */}
                    <path d="M0 0 L100 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="2,2" />
                    {/* Bottom shadow line */}
                    <path d="M0 30 L100 30" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                    {/* Pawprints */}
                    <g opacity="0.4">
                        <ellipse cx="20" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="17" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="20" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="23" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />

                        <ellipse cx="50" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="47" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="50" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="53" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />

                        <ellipse cx="80" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="77" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="80" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        <ellipse cx="83" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                    </g>
                </svg>
            </div>

            <div className="featured-episode-grid">
                <div className="episode-waveform">
                    <div className="audio-icon-container">🎧</div>
                </div>

                <div className="episode-content">
                    <h3>{episode.title}</h3>
                    <p className="episode-date">
                        Aired on {episode.airedOn || episode.date || "Sunday Morning"}
                    </p>

                    <div className="featured-meta">
                        <span>🎙️ Podcast Episode</span>
                        <span>📝 With Transcript</span>
                    </div>

                    {episode.notes && episode.notes.length > 0 && (
                        <p style={{ fontStyle: 'italic', color: '#5a4668' }}>
                            {episode.notes[0]}
                        </p>
                    )}

                    {!isExpanded && (
                        <div className="button-centered">
                            <WhimsicalButton
                                type="primary"
                                onClick={() => setIsExpanded(true)}
                                showPaw={false}
                            >
                                Listen Now
                            </WhimsicalButton>
                        </div>
                    )}
                </div>
            </div>

            {/* In-card expansion - matches preview-magical.html #episodeExpanded */}
            {isExpanded && (
                <div className="episode-expansion">
                    <div className="episode-expansion__header">
                        <div>
                            <h3 className="episode-expansion__title">{episode.title}</h3>
                            <p className="episode-expansion__meta">
                                Aired on {episode.airedOn || episode.date || "Sunday Morning"} | {episode.duration || "32 minutes"}
                            </p>
                        </div>
                    </div>

                    <div className="episode-expansion__player">
                        <AudioPlayer
                            title="Listen to the Spell"
                            audioUrl={episode.audioUrl}
                            transcript={episode.transcript}
                            context={episode.slug}
                        />
                    </div>

                    <div className="episode-expansion__whisper">
                        <div className="episode-expansion__whisper-row">
                            <img
                                className="episode-expansion__whisper-avatar"
                                src="/images/recipes/giselle-portrait.png"
                                alt="Giselle - The Queen"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = GISELLE_AVATAR_FALLBACK;
                                }}
                            />
                            <div>
                                <p className="episode-expansion__whisper-label">Giselle whispers...</p>
                                <p className="episode-expansion__whisper-quote">
                                    "This episode was recorded during a particularly chaotic flour explosion. Excuse the sneezing! Also, Phaedra tried to lick the microphone three times. We're keeping it authentic."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="episode-expansion__columns">
                        <div>
                            <div className="episode-expansion__notes">
                                <h4>Chapter Notes</h4>
                                <ul>
                                    {(episode.notes || []).map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <div className="episode-expansion__recipe">
                                <h5>Featured Magic</h5>
                                <p className="episode-expansion__recipe-sub">Learn to bake the pie that started it all</p>
                                {featuredRecipe && (
                                    <Link to={`/recipes/${featuredRecipe.slug}`} className="episode-expansion__recipe-link">
                                        <div className="episode-expansion__recipe-emoji">🥧</div>
                                        <div>
                                            <p className="episode-expansion__recipe-title">{featuredRecipe.title}</p>
                                            <p className="episode-expansion__recipe-arrow">The dynasty begins here →</p>
                                        </div>
                                    </Link>
                                )}
                            </div>

                            <div className="episode-expansion__related">
                                <h5>Related Episodes</h5>
                                <div className="episode-expansion__related-list">
                                    {(episode.relatedEpisodes || []).map((related) => (
                                        <Link
                                            key={related.slug}
                                            to={`/episodes/${related.slug}`}
                                            className="episode-expansion__related-link"
                                        >
                                            <p className="episode-expansion__related-title">🎙️ {related.title}</p>
                                            {related.description && (
                                                <p className="episode-expansion__related-sub">{related.description}</p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="episode-expansion__soundboard">
                        <SheltieSoundboard />
                    </div>

                    <div className="featured-episode-collapse">
                        <WhimsicalButton
                            type="secondary"
                            onClick={() => setIsExpanded(false)}
                            showPaw={false}
                        >
                            Collapse Episode
                        </WhimsicalButton>
                    </div>
                </div>
            )}
        </div>
    );
};

FeaturedEpisodeCard.propTypes = {
    episode: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        audioUrl: PropTypes.string,
        transcript: PropTypes.string,
        date: PropTypes.string,
        airedOn: PropTypes.string,
        duration: PropTypes.string,
        notes: PropTypes.arrayOf(PropTypes.string),
        relatedRecipes: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            slug: PropTypes.string,
        })),
        relatedEpisodes: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            slug: PropTypes.string,
            description: PropTypes.string,
        })),
    }).isRequired,
};

export default FeaturedEpisodeCard;
