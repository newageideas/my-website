
import React, { useState } from 'react';

const NavTab = ({ href, text, glowColor = 'cyan' }: { href: string, text: string, glowColor?: 'cyan' | 'pink' | 'gold' }) => {
    const colorClasses = {
        cyan: 'border-galaxy-cyan text-galaxy-cyan hover:shadow-[0_0_20px_#00f3ff] hover:bg-galaxy-cyan hover:text-black',
        pink: 'border-galaxy-pink text-galaxy-pink hover:shadow-[0_0_20px_#ff0099] hover:bg-galaxy-pink hover:text-black',
        gold: 'border-galaxy-gold text-galaxy-gold hover:shadow-[0_0_20px_#ffd700] hover:bg-galaxy-gold hover:text-black',
    };

    return (
        <a 
            href={href}
            className={`
                relative px-8 py-2 font-syncopate text-xs font-bold tracking-widest uppercase 
                border-b-2 bg-black/20 backdrop-blur-md transition-all duration-300 
                skew-x-[-20deg] ${colorClasses[glowColor]}
            `}
        >
            <span className="block skew-x-[20deg]">{text}</span>
        </a>
    );
};

const NavDropdown = ({ text, glowColor = 'cyan', items }: { text: string, glowColor?: 'cyan' | 'pink', items: { label: string, href: string }[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorClasses = {
        cyan: 'border-galaxy-cyan text-galaxy-cyan hover:shadow-[0_0_20px_#00f3ff] hover:bg-galaxy-cyan hover:text-black',
        pink: 'border-galaxy-pink text-galaxy-pink hover:shadow-[0_0_20px_#ff0099] hover:bg-galaxy-pink hover:text-black',
    };

    return (
        <div 
            className="relative group h-full flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <a 
                href="#video-grid"
                className={`
                    block relative px-8 py-2 font-syncopate text-xs font-bold tracking-widest uppercase 
                    border-b-2 bg-black/20 backdrop-blur-md transition-all duration-300 
                    skew-x-[-20deg] ${colorClasses[glowColor]}
                `}
            >
                <span className="block skew-x-[20deg] flex items-center gap-2">
                    {text} 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
            </a>

            {/* Dropdown Menu */}
            <div className={`
                absolute top-full left-0 w-56 pt-4
                transform transition-all duration-300 origin-top-left z-50
                ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}
            `}>
                <div className={`
                    bg-galaxy-base/95 backdrop-blur-xl border border-${glowColor === 'cyan' ? 'galaxy-cyan' : 'galaxy-pink'}/30 
                    shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-bl-xl rounded-br-xl overflow-hidden
                `}>
                        {items.map((item, idx) => (
                        <a 
                            key={idx}
                            href={item.href}
                            className={`
                                block px-6 py-4 font-rajdhani font-bold text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors
                                border-l-2 border-transparent hover:border-${glowColor === 'cyan' ? 'galaxy-cyan' : 'galaxy-pink'}
                                flex items-center justify-between group/item
                            `}
                        >
                            {item.label}
                            <span className={`text-${glowColor === 'cyan' ? 'galaxy-cyan' : 'galaxy-pink'} opacity-0 group-hover/item:opacity-100 transition-opacity`}>→</span>
                        </a>
                        ))}
                </div>
            </div>
        </div>
    );
};

export const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-40 bg-galaxy-base/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between relative">
                    
                    {/* Logo Area */}
                    <a href="#home" onClick={closeMenu} className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-galaxy-pink via-galaxy-violet to-galaxy-cyan rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
                        <div className="relative">
                            <span className="text-2xl md:text-3xl font-syncopate font-bold text-white tracking-tighter">
                                IMA<span className="text-galaxy-cyan">NOSTRA</span><span className="text-galaxy-pink">DAMUS</span>
                            </span>
                        </div>
                    </a>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavTab href="#bio" text="Bio" glowColor="pink" />
                        
                        <NavDropdown 
                            text="Videos" 
                            glowColor="cyan" 
                            items={[
                                { label: 'Restaurant Menu', href: '#menu-visuals' },
                                { label: 'Bar Promotions', href: '#bar-visuals' },
                                { label: 'Web Design', href: '#web-visuals' },
                                { label: 'App Development', href: '#app-visuals' },
                            ]} 
                        />
                        
                        <a href="mailto:imamartin81@gmail.com" className="font-rajdhani font-bold text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 border-r border-gray-700 pr-8 mr-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                            ONLINE
                        </a>

                        <a href="#contact" className="
                            relative px-8 py-3 bg-white text-black font-syncopate font-bold text-sm tracking-widest
                            hover:bg-galaxy-gold hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.5)]
                            rounded-full
                        ">
                            START_
                        </a>
                    </nav>
                    
                    {/* Mobile Menu Icon */}
                    <button onClick={toggleMenu} className="md:hidden text-white p-2 z-50">
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-galaxy-pink">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-galaxy-cyan">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown - Galaxy Style */}
                <div className={`md:hidden fixed inset-0 bg-galaxy-base/98 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-12 transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                    
                    <a href="#bio" onClick={closeMenu} className="text-4xl font-syncopate text-transparent bg-clip-text bg-gradient-to-r from-white to-galaxy-pink font-bold hover:scale-110 transition-transform">BIO</a>
                    
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-xl font-syncopate text-galaxy-cyan">VIDEOS</span>
                        <a href="#menu-visuals" onClick={closeMenu} className="text-lg font-rajdhani text-gray-300 hover:text-white">Restaurant Menu</a>
                        <a href="#bar-visuals" onClick={closeMenu} className="text-lg font-rajdhani text-gray-300 hover:text-white">Bar Promotions</a>
                        <a href="#web-visuals" onClick={closeMenu} className="text-lg font-rajdhani text-gray-300 hover:text-white">Web Design</a>
                        <a href="#app-visuals" onClick={closeMenu} className="text-lg font-rajdhani text-gray-300 hover:text-white">App Development</a>
                    </div>

                    <a href="mailto:imamartin81@gmail.com" onClick={closeMenu} className="text-2xl font-rajdhani text-gray-300">imamartin81@gmail.com</a>
                    
                    <a href="#contact" onClick={closeMenu} className="px-12 py-5 bg-gradient-to-r from-galaxy-cyan to-galaxy-pink text-white font-syncopate font-bold text-xl rounded-full hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all">
                        INITIATE
                    </a>
                </div>
            </header>
        </>
    );
};
