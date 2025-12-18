
import React, { useEffect, useState, useMemo } from 'react';

interface Props {
    onClose: () => void;
    onSelect: (service: string) => void;
}

export const ServiceModal: React.FC<Props> = ({ onClose, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [sign, setSign] = useState("Aries");
    const [projectType, setProjectType] = useState("Horoscope Reading");

    useEffect(() => {
        // Trigger fade-in after mount
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVisible(false);
        // Pass a composite string to trigger the chat with context
        setTimeout(() => onSelect(`${projectType} for ${sign}`), 300);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Star generation for the looping background
    // Memoized to prevent regeneration on user interaction (typing)
    const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        size: 1 + Math.random() * 3
    })), []);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-galaxy-base/90 backdrop-blur-lg transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div 
                className={`bg-galaxy-base border border-galaxy-pink/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,0,153,0.2)] relative transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-galaxy-violet/20 via-transparent to-galaxy-cyan/20 pointer-events-none z-0"></div>

                {/* Looping Stars Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {stars.map((star) => (
                        <div 
                            key={star.id}
                            className="absolute bg-white rounded-full opacity-0 animate-star-loop"
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                animationDelay: `${star.delay}s`,
                                animationDuration: `${star.duration}s`
                            }}
                        />
                    ))}
                </div>

                <div className="p-10 md:p-16 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="font-syncopate text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-galaxy-pink">
                                ARIES PROTOCOL
                            </h2>
                            <p className="font-rajdhani text-galaxy-cyan text-lg mt-2 tracking-wide">
                                // ALIGN YOUR BRAND WITH THE STARS
                            </p>
                        </div>
                        <button onClick={handleClose} className="text-white/50 hover:text-galaxy-pink font-bold text-4xl transition-colors">
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-syncopate text-xs text-gray-400">Zodiac Sign</label>
                                <select 
                                    value={sign}
                                    onChange={(e) => setSign(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/10 transition-colors"
                                >
                                    <option value="Aries">Aries</option>
                                    <option value="Taurus">Taurus</option>
                                    <option value="Gemini">Gemini</option>
                                    <option value="Cancer">Cancer</option>
                                    <option value="Leo">Leo</option>
                                    <option value="Virgo">Virgo</option>
                                    <option value="Libra">Libra</option>
                                    <option value="Scorpio">Scorpio</option>
                                    <option value="Sagittarius">Sagittarius</option>
                                    <option value="Capricorn">Capricorn</option>
                                    <option value="Aquarius">Aquarius</option>
                                    <option value="Pisces">Pisces</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-syncopate text-xs text-gray-400">Service Vector</label>
                                <select 
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/10 transition-colors"
                                >
                                    <option value="Horoscope Reading">Cosmic Horoscope Reading</option>
                                    <option value="Video Ad Campaign">Video Ad Campaign</option>
                                    <option value="Image Generation">Image Generation</option>
                                    <option value="Creative Event Film">Creative Event Film</option>
                                    <option value="Brand Identity">Brand Identity</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-syncopate text-xs text-gray-400">Mission Brief</label>
                            <textarea 
                                placeholder="Describe your vision or ask the stars..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-rajdhani focus:border-galaxy-cyan focus:outline-none focus:bg-white/10 transition-colors h-32 resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-galaxy-pink to-galaxy-violet p-[1px]"
                        >
                            <div className="relative bg-black/50 backdrop-blur-sm rounded-xl px-8 py-4 transition-all duration-300 group-hover:bg-transparent">
                                <span className="font-syncopate font-bold text-white text-lg tracking-widest group-hover:scale-105 block transition-transform">
                                    INITIATE SEQUENCE
                                </span>
                            </div>
                            {/* Button Glow */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
