import { useState } from 'react'
import { trackAudio } from '../lib/analytics'
import './AudioPlayer.css'

function AudioPlayer({ title, audioUrl, transcript, context }) {
    const [error, setError] = useState(false)

    const onError = () => {
        setError(true)
        trackAudio('error', { slug: context })
    }

    const onPlay = () => trackAudio('play', { slug: context })
    const onFallbackClick = (type) => trackAudio('fallback', { slug: context, type })

    return (
        <div className="audio">
            <div className="audio__header">
                <h3 className="audio__title">{title}</h3>
            </div>

            {!error && audioUrl ? (
                <audio
                    className="audio__player"
                    controls
                    onError={onError}
                    onPlay={onPlay}
                >
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <div className="audio__fallback">
                    <p>Playback is not available right now.</p>
                    <div className="audio__links">
                        <a href={audioUrl || '#'} aria-disabled={!audioUrl} onClick={() => onFallbackClick('podcast')}>Listen in podcast app</a>
                        <a href={audioUrl || '#'} aria-disabled={!audioUrl} onClick={() => onFallbackClick('download')}>Download audio</a>
                    </div>
                </div>
            )}

            <details className="audio__transcript">
                <summary>Transcript and captions</summary>
                <p>{transcript}</p>
            </details>
        </div>
    )
}

export default AudioPlayer
