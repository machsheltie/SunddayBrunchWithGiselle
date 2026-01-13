import { useState } from 'react';
import EpisodeTemplate from './EpisodeTemplate';
import WhimsicalButton from './WhimsicalButton';
import './FeaturedEpisodeCard.css';

const FeaturedEpisodeCard = ({ episode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isExpanded) {
        return (
            <div className="featured-episode-expanded">
                <EpisodeTemplate episode={episode} />
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
        );
    }

    return (
        <div className="featured-episode-card">
            <div className="featured-episode-card__image-container">
                <div className="featured-episode-card__waveform">
                    {/* Decorative audio waveform visual */}
                    <svg viewBox="0 0 200 100" className="waveform-svg" preserveAspectRatio="none">
                        <path
                            d="M0,50 L10,30 L20,60 L30,20 L40,70 L50,40 L60,55 L70,25 L80,65 L90,35 L100,50 L110,45 L120,55 L130,30 L140,70 L150,40 L160,60 L170,35 L180,65 L190,45 L200,50"
                            fill="none"
                            stroke="var(--pastel-lavender)"
                            strokeWidth="3"
                            opacity="0.6"
                        />
                        <path
                            d="M0,50 L10,40 L20,55 L30,35 L40,60 L50,45 L60,52 L70,38 L80,58 L90,42 L100,50 L110,48 L120,52 L130,40 L140,60 L150,45 L160,55 L170,42 L180,58 L190,48 L200,50"
                            fill="none"
                            stroke="var(--soft-sakura)"
                            strokeWidth="2"
                            opacity="0.5"
                        />
                    </svg>
                    <div className="waveform-overlay">
                        <span className="audio-icon">🎧</span>
                    </div>
                </div>
            </div>

            <div className="featured-episode-card__content">
                <h3 className="featured-episode-card__title">{episode.title}</h3>

                <p className="featured-episode-card__date">
                    Aired on {episode.date || "Sunday Morning"}
                </p>

                <div className="featured-episode-card__meta">
                    <span className="featured-episode-card__meta-item">
                        <span className="meta-icon">🎙️</span>
                        Podcast Episode
                    </span>
                    <span className="featured-episode-card__meta-item">
                        <span className="meta-icon">📝</span>
                        With Transcript
                    </span>
                </div>

                {episode.notes && episode.notes.length > 0 && (
                    <p className="featured-episode-card__description">
                        {episode.notes[0]}
                    </p>
                )}

                <div className="featured-episode-card__actions">
                    <WhimsicalButton
                        type="primary"
                        onClick={() => setIsExpanded(true)}
                        showPaw={true}
                    >
                        Listen Now
                    </WhimsicalButton>
                </div>
            </div>
        </div>
    );
};

export default FeaturedEpisodeCard;
