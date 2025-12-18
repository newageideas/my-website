
import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CircularVideo } from './components/CircularVideo';
import { VideoModal } from './components/VideoModal';
import { ChatWidget, ChatWidgetHandle } from './components/ChatWidget';
import { ServiceModal } from './components/ServiceModal';
import { ParticleHero } from './components/ParticleHero';
import { StarfieldBackground } from './components/StarfieldBackground';
import { CONTENT_ITEMS, VALUE_PROPS } from './constants';
import { ContentItem } from './types';

const App: React.FC = () => {
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [isServiceModalOpen, setServiceModalOpen] = useState(false);
    const chatRef = useRef<ChatWidgetHandle>(null);

    const handleServiceSelect = (serviceInfo: string) => {
        setServiceModalOpen(false);
        
        let initialMessage = "";
        
        // Check for specific service keywords or horoscope requests
        if (serviceInfo.includes('Image Generation')) {
            initialMessage = `COSMIC TASK: Image Generation [${serviceInfo}]. Target: 8K High-Contrast. Analyzing costs...`;
        } else if (serviceInfo.includes('Video Ad Campaign')) {
            initialMessage = `COSMIC TASK: Viral Video Sequence [${serviceInfo}]. Target: High-Velocity engagement. Calculating ROI...`;
        } else if (serviceInfo.includes('Creative Event Film')) {
            initialMessage = `COSMIC TASK: Narrative Cinema [${serviceInfo}]. Target: Emotional Resonance. Scheduling timeline...`;
        } else if (serviceInfo.includes('Horoscope')) {
            initialMessage = `ORACLE ACTIVATED: Analyzing celestial patterns for [${serviceInfo}]. Stand by for prophecy...`;
        } else {
            initialMessage = `SYSTEM QUERY: Initiating partnership sequence for [${serviceInfo}].`;
        }

        setTimeout(() => {
            chatRef.current?.sendMessage(initialMessage);
        }, 500); 
    };

    const getAnchorId = (category: string) => {
        switch(category) {
            case 'RESTAURANT ADS': return 'menu-visuals';
            case 'BAR PROMOTIONS': return 'bar-visuals';
            case 'WEB DESIGN': return 'web-visuals';
            case 'APP DEVELOPMENT': return 'app-visuals';
            default: return undefined;
        }
    };

    return (
        <div className="min-h-screen text-white relative overflow-x-hidden" id="home">
            
            {/* BACKGROUND LAYERS */}
            {/* 1. Deep Space Gradient (CSS) */}
            <div className="bg-galaxy-moving"></div>
            
            {/* 2. Moving Starfield (Canvas) */}
            <StarfieldBackground />

            {/* Ambient Nebula Flares */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-galaxy-pink/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse z-[2]"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-galaxy-cyan/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-float z-[2]"></div>

            <Navbar />

            <main className="relative z-10 pt-32 pb-20">
                
                {/* HERO SECTION / VIDEO GRID */}
                <section id="video-grid" className="container mx-auto px-4 min-h-[90vh] flex flex-col justify-center items-center text-center mb-24 relative">
                    
                    {/* DYNAMIC PARTICLE SYSTEM - Local to Hero */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <ParticleHero />
                    </div>
                    
                    <div className="mb-24 space-y-6 z-10 relative">
                        {/* Glowing Ring Behind Title */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-gradient-radial from-white/5 to-transparent blur-3xl -z-10"></div>

                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-syncopate font-bold text-transparent bg-clip-text bg-gradient-to-r from-galaxy-cyan via-white to-galaxy-pink drop-shadow-[0_0_30px_rgba(0,243,255,0.5)] tracking-tighter animate-float">
                            IMANOSTRADAMUS
                        </h1>
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-syncopate font-bold text-galaxy-gold tracking-[0.5em] uppercase text-glow-gold">
                            Stop Struggling Today
                        </h2>
                        
                        <div className="flex items-center justify-center gap-6 mt-12">
                            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-galaxy-cyan"></div>
                            <p className="font-rajdhani font-semibold text-galaxy-pink text-lg md:text-2xl tracking-widest uppercase bg-black/30 backdrop-blur px-6 py-2 border border-galaxy-pink/30 rounded-full">
                                Zero Waste <span className="text-white mx-2">|</span> 100% ROI
                            </p>
                            <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-galaxy-cyan"></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-16 md:gap-24 relative z-10">
                        {CONTENT_ITEMS.map((item, index) => (
                            <div 
                                key={item.id} 
                                id={getAnchorId(item.category)}
                                className={`scroll-mt-48 ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
                            >
                                <CircularVideo 
                                    item={item} 
                                    onClick={setSelectedContent} 
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* HORIZON LINE */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-galaxy-pink to-transparent my-20 shadow-[0_0_20px_#ff0099]"></div>

                {/* BIO SECTION */}
                <section id="bio" className="container mx-auto px-4 py-20 relative">
                    
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-syncopate font-bold text-white mb-8 text-glow">
                                AGENCY <span className="text-galaxy-violet">BIO</span>
                            </h2>
                            <div className="glass-panel-neon p-8 md:p-12 rounded-2xl max-w-4xl mx-auto relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-galaxy-cyan via-galaxy-pink to-galaxy-gold"></div>
                                <p className="font-rajdhani text-2xl md:text-3xl font-medium text-white leading-relaxed">
                                    Why should <span className="text-galaxy-gold font-bold">big Businesses</span> get all the coolness? <br className="hidden md:block" />
                                    <span className="text-galaxy-cyan font-bold">Hollywood style ads</span> are for everyone now.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {VALUE_PROPS.map((prop, index) => (
                                <div key={index} className="glass-panel p-8 rounded-xl group hover:-translate-y-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,153,0.3)] hover:border-galaxy-pink border-transparent border">
                                    <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                        {prop.icon}
                                    </div>
                                    <h3 className="font-syncopate text-galaxy-cyan text-lg font-bold mb-4 group-hover:text-white transition-colors">
                                        {prop.title}
                                    </h3>
                                    <p className="font-rajdhani text-gray-300 text-lg font-medium leading-relaxed group-hover:text-galaxy-pink transition-colors">
                                        {prop.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* CONTACT FOOTER */}
            <footer id="contact" className="relative z-10 py-24 border-t border-galaxy-violet/30 bg-black/40 backdrop-blur-lg">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-syncopate text-3xl md:text-6xl text-white mb-12 text-glow-gold">
                        JOIN THE GALAXY
                    </h2>
                    
                    <button 
                        onClick={() => setServiceModalOpen(true)}
                        className="group relative px-16 py-6 font-syncopate font-bold text-xl text-black bg-galaxy-cyan hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(0,243,255,0.6)] hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] skew-x-[-10deg]"
                    >
                        <span className="block skew-x-[10deg]">START PROJECT</span>
                        <div className="absolute inset-0 border-2 border-white scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"></div>
                    </button>
                    
                    <div className="mt-20 font-syncopate text-sm md:text-base text-galaxy-violet uppercase tracking-widest">
                        New Generation wants. <span className="text-galaxy-pink">Not your wants.</span>
                    </div>
                </div>
            </footer>

            {/* MODALS */}
            {selectedContent && (
                <VideoModal 
                    item={selectedContent} 
                    onClose={() => setSelectedContent(null)} 
                />
            )}

            {isServiceModalOpen && (
                <ServiceModal 
                    onClose={() => setServiceModalOpen(false)} 
                    onSelect={handleServiceSelect}
                />
            )}

            <ChatWidget ref={chatRef} />
        </div>
    );
};

export default App;
