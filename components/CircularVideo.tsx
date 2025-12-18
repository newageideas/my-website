
import React, { useRef, useEffect, useState } from 'react';
import { ContentItem } from '../types';

interface Props {
    item: ContentItem;
    onClick: (item: ContentItem) => void;
}

export const CircularVideo: React.FC<Props> = ({ item, onClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    
    // URL Type Detection
    const isYouTube = item.previewVideoUrl.includes('youtube.com') || item.previewVideoUrl.includes('youtu.be');

    const getYouTubeId = (url: string) => {
        let videoId = null;
        if (url.includes('/shorts/')) {
            const match = url.match(/\/shorts\/([^/?]+)/);
            if (match) videoId = match[1];
        } else if (url.includes('v=')) {
            const match = url.match(/v=([^&]+)/);
            if (match) videoId = match[1];
        } else if (url.includes('youtu.be/')) {
            const match = url.match(/youtu\.be\/([^/?]+)/);
            if (match) videoId = match[1];
        }
        return videoId;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '100px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
        console.warn(`Failed to load video for ${item.title}`);
        setIsLoading(false);
    };

    const handleMouseEnter = async () => {
        setIsHovered(true);
        if (videoRef.current && !isYouTube) {
            try {
                videoRef.current.currentTime = 0;
                await videoRef.current.play();
            } catch (e) {}
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current && !isYouTube) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; 
        }
    };

    const youtubeId = isYouTube ? getYouTubeId(item.previewVideoUrl) : null;

    return (
        <div 
            ref={containerRef}
            className="relative group cursor-pointer w-[360px] h-[360px] flex items-center justify-center"
            onClick={() => onClick(item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* PLANETARY ORBITS */}
            <div className="absolute inset-0 rounded-full border-[1px] border-galaxy-pink/40 animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-4 rounded-full border-[1px] border-galaxy-cyan/40 animate-spin-reverse pointer-events-none" style={{ animationDuration: '15s' }}></div>
            <div className="absolute inset-[-10px] rounded-full border-[2px] border-transparent border-t-galaxy-gold/60 rotate-45 pointer-events-none"></div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-galaxy-pink/10 to-galaxy-cyan/10 blur-3xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>

            {/* Orbiting Satellites */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-galaxy-cyan rounded-full shadow-[0_0_10px_#00f3ff] animate-pulse"></div>
            <div className="absolute bottom-4 right-10 w-2 h-2 bg-galaxy-pink rounded-full shadow-[0_0_10px_#ff0099]"></div>

            {/* The Video Container */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_0_50px_rgba(112,0,255,0.4)] group-hover:shadow-[0_0_100px_rgba(0,243,255,0.8)] transition-all duration-500 z-10 bg-black border-[6px] border-galaxy-base group-hover:border-galaxy-cyan transform group-hover:scale-105">
                
                {/* Fallback/Loading Spinner */}
                {isLoading && !item.thumbnailUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-galaxy-base z-20">
                        <span className="text-galaxy-cyan font-syncopate text-xs animate-pulse">LOADING ORBIT...</span>
                    </div>
                )}

                {/* STATIC COVER IMAGE (Always present, video sits on top) */}
                <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
                />

                {/* OVERLAY for image darkening */}
                <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}></div>

                {/* Local Video - Fades in on Hover */}
                {isVisible && !isYouTube && (
                    <video 
                        ref={videoRef}
                        className={`absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        src={item.previewVideoUrl}
                        muted
                        playsInline
                        loop
                        onCanPlay={handleCanPlay}
                        onError={handleError}
                    />
                )}

                {/* YouTube - Always visible if loaded, as iframes are heavy to fade */}
                {isVisible && isYouTube && youtubeId && isHovered && (
                    <div className="absolute inset-0 w-full h-full bg-black animate-in fade-in duration-500">
                        <iframe 
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`} 
                            className="w-full h-full scale-[1.8] group-hover:scale-[1.9] pointer-events-none filter brightness-75 group-hover:brightness-100 transition-all duration-700"
                            allow="autoplay; encrypted-media"
                            title={item.title}
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                        <div className="absolute inset-0 z-30 bg-transparent"></div>
                    </div>
                )}
                
                {/* Overlay UI */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-galaxy-base/60 group-hover:bg-black/10 transition-all duration-500 z-40 pointer-events-none backdrop-blur-[1px] group-hover:backdrop-blur-none">
                    <span className="font-syncopate font-bold text-sm text-white tracking-widest border-b-2 border-galaxy-pink pb-1 mb-2 drop-shadow-lg transform group-hover:-translate-y-12 transition-transform duration-500 text-center px-4">
                        {item.category}
                    </span>
                    <span className="text-xs font-rajdhani font-bold text-black bg-galaxy-cyan px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 scale-0 group-hover:scale-100">
                        OPEN FILE
                    </span>
                </div>
            </div>
        </div>
    );
};
