import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAudio } from '../lib/analytics';
import './AudioPlayer.css';

/**
 * An alchemical frequency tuner for listening to Sunday Brunch.
 */
const AudioPlayer = ({ title, audioUrl, transcript, context }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                console.error("Playback failed:", e);
                setError(true);
            });
        }
        setIsPlaying(!isPlaying);
        trackAudio(isPlaying ? 'pause' : 'play', { slug: context });
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="alchemical-tuner">
            <div className="tuner-glass">
                <div className="tuner-header">
                    <span className="tuner-label">Magic Frequency</span>
                    <h3 className="tuner-title">{title}</h3>
                </div>

                <div className="tuner-main">
                    <button className="play-toggle" onClick={togglePlay}>
                        {isPlaying ? (
                            <span className="icon">⏸</span>
                        ) : (
                            <span className="icon">▶</span>
                        )}
                        <svg className="play-ring" viewBox="0 0 100 100">
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="var(--soft-sakura)"
                                strokeWidth="2"
                                strokeDasharray="283"
                                animate={{ strokeDashoffset: 283 - (283 * (currentTime / duration || 0)) }}
                            />
                        </svg>
                    </button>

                    <div className="tuner-display">
                        <div className="wave-container">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="wave-bar"
                                    animate={{
                                        height: isPlaying ? [10, 30, 15, 40, 20][(i % 5)] : 5
                                    }}
                                    transition={{
                                        duration: 0.5 + (i * 0.1),
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span className="divider">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                <div className="tuner-footer">
                    <input
                        type="range"
                        className="tuner-seek"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                    />
                </div>
            </div>

            <audio ref={audioRef} src={audioUrl} onError={() => setError(true)} />

            <details className="tuner-transcript">
                <summary className="script-accent">📜 The Written Spell (Transcript)</summary>
                <div className="transcript-content">
                    <p>{transcript}</p>
                </div>
            </details>
        </div>
    );
};

export default AudioPlayer;
