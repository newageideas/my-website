import React, { useEffect, useState } from 'react';
import { ContentItem } from '../types';
import { generateImage } from '../services/geminiService';

interface Props {
    item: ContentItem | null;
    onClose: () => void;
}

export const VideoModal: React.FC<Props> = ({ item, onClose }) => {
    const [videoError, setVideoError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Image Generation State
    const [viewMode, setViewMode] = useState<'video' | 'image'>('video');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    useEffect(() => {
        setVideoError(false);
        setGeneratedImage(null);
        setViewMode('video');
        setGenerationError(null);
        // Trigger fade-in after mount
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, [item]);
    
    const handleClose = () => {
        // Trigger fade-out
        setIsVisible(false);
        // Wait for animation to finish before unmounting
        setTimeout(onClose, 300);
    };

    const handleGenerateImage = async () => {
        if (!item) return;
        setIsGenerating(true);
        setGenerationError(null);
        setViewMode('image'); // Switch view immediately to show loading state

        try {
            // Construct a highly detailed prompt based on category
            let basePrompt = "";
            switch(item.category) {
                case 'RESTAURANT ADS':
                    basePrompt = "Professional commercial food photography, 8k resolution, cinematic lighting, appetizing gourmet dish, macro detail. ";
                    break;
                case 'BAR PROMOTIONS':
                    basePrompt = "High-energy luxury cocktail bar atmosphere, neon lighting, nightlife vibe, cinematic motion, photorealistic 8k. ";
                    break;
                case 'WEB DESIGN':
                    basePrompt = "Futuristic 3D website interface on holographic display, cyberpunk aesthetic, UI/UX masterpiece, neon glowing elements, 8k render. ";
                    break;
                case 'APP DEVELOPMENT':
                    basePrompt = "Slick mobile application interface floating in zero gravity, vivid colors, modern tech, 3D render, high detail, 8k. ";
                    break;
                default:
                    basePrompt = "Cinematic commercial photography, high contrast, 8k, photorealistic. ";
            }

            const fullPrompt = `${basePrompt} Subject: ${item.title}. Context: ${item.longDescription}`;
            const imageBase64 = await generateImage(fullPrompt);
            setGeneratedImage(imageBase64);
        } catch (err) {
            console.error(err);
            setGenerationError("Failed to generate visual. Check API Key or try again.");
            setViewMode('video'); // Revert on error
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!item) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-galaxy-base/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {/* Modal Window */}
            <div 
                className={`glass-panel-neon w-full max-w-7xl rounded-3xl shadow-[0_0_100px_rgba(112,0,255,0.4)] relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-white hover:text-black text-white rounded-full p-2 transition-all duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Media Player (Video or AI Image) */}
                <div className="w-full md:w-3/4 bg-black relative aspect-video md:aspect-auto flex items-center justify-center overflow-hidden">
                    
                    {/* MODE: IMAGE GENERATION */}
                    {viewMode === 'image' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-galaxy-base">
                            {isGenerating ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-galaxy-pink border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_30px_#ff0099]"></div>
                                    <h3 className="font-syncopate text-galaxy-cyan animate-pulse tracking-widest">NEURAL RENDERING...</h3>
                                    <p className="font-rajdhani text-gray-400 text-sm mt-2">Constructing 8K Visual Assets</p>
                                </div>
                            ) : generatedImage ? (
                                <div className="relative w-full h-full group">
                                    <img 
                                        src={generatedImage} 
                                        alt="AI Generated Concept" 
                                        className="w-full h-full object-contain animate-in fade-in duration-1000"
                                    />
                                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur rounded text-galaxy-cyan font-syncopate text-xs border border-galaxy-cyan/30">
                                        ✨ AI GENERATED CONCEPT
                                    </div>
                                </div>
                            ) : (
                                <div className="text-red-500 font-syncopate">{generationError || "NO DATA"}</div>
                            )}
                        </div>
                    )}

                    {/* MODE: VIDEO */}
                    {viewMode === 'video' && (
                        <>
                            {item.fullVideoUrl && !videoError ? (
                                <video 
                                    src={item.fullVideoUrl}
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    onError={() => setVideoError(true)}
                                />
                            ) : item.fullVideoEmbedId ? (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${item.fullVideoEmbedId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1`} 
                                    title={item.title}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="text-galaxy-pink font-syncopate animate-pulse">SIGNAL LOST</div>
                            )}
                        </>
                    )}
                </div>

                {/* Right: Content Details */}
                <div className="w-full md:w-1/4 p-10 flex flex-col justify-between bg-galaxy-base/60 backdrop-blur-md overflow-y-auto border-l border-white/10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-galaxy-cyan rounded-full"></span>
                            <span className="text-xs font-syncopate text-galaxy-cyan tracking-widest">ID: {item.id.toUpperCase()}</span>
                        </div>
                        <h2 className="font-syncopate text-3xl font-bold text-white mb-8 leading-tight text-glow">
                            {item.title}
                        </h2>
                        <p className="font-rajdhani text-gray-300 text-lg leading-relaxed mb-8">
                            {item.longDescription}
                        </p>

                        {/* AI Action Area */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <h3 className="font-syncopate text-xs text-galaxy-pink mb-3 font-bold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-galaxy-pink rounded-full animate-pulse"></span>
                                AI CAPABILITIES
                            </h3>
                            
                            {viewMode === 'video' ? (
                                <button 
                                    onClick={handleGenerateImage}
                                    className="w-full py-3 bg-gradient-to-r from-galaxy-violet to-galaxy-pink text-white font-syncopate text-xs font-bold rounded hover:shadow-[0_0_20px_#ff0099] transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    GENERATE CONCEPT ART
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setViewMode('video')}
                                        className="w-full py-3 bg-transparent border border-galaxy-cyan text-galaxy-cyan hover:bg-galaxy-cyan hover:text-black font-syncopate text-xs font-bold rounded transition-all"
                                    >
                                        RETURN TO VIDEO
                                    </button>
                                    <button 
                                        onClick={handleGenerateImage}
                                        disabled={isGenerating}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-syncopate text-xs font-bold rounded transition-all disabled:opacity-50"
                                    >
                                        REGENERATE
                                    </button>
                                </div>
                            )}
                            <p className="text-[10px] text-gray-500 mt-2 text-center font-rajdhani">
                                Powered by Gemini 2.5 Image Model
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <button onClick={handleClose} className="w-full py-4 rounded-xl border border-white/20 text-white font-syncopate text-xs hover:bg-white hover:text-black transition-colors uppercase tracking-widest font-bold">
                            Close Feed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};