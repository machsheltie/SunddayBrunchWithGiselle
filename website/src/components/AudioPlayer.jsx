import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ src, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
        audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        return () => {
            audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
            audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="bg-brown text-cream rounded-xl p-6 shadow-card w-full max-w-3xl mx-auto my-8 border border-copper/30">
            <audio ref={audioRef} src={src} />

            <div className="flex items-center gap-6">
                <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-copper flex items-center justify-center hover:bg-terracotta transition-colors shadow-lg flex-shrink-0"
                >
                    {isPlaying ? (
                        <span className="text-2xl">❚❚</span>
                    ) : (
                        <span className="text-2xl ml-1">▶</span>
                    )}
                </button>

                <div className="flex-grow">
                    <h3 className="font-heading font-bold text-xl mb-1 text-cream">{title}</h3>
                    <p className="text-sm text-terracotta mb-3">Episode 1 • Sunday Brunch With Giselle</p>

                    <div className="flex items-center gap-3 text-xs font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-grow h-1 bg-brown-light rounded-lg appearance-none cursor-pointer accent-copper"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
