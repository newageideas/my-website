import React, { useEffect, useState, useMemo } from 'react';

interface Props {
    onClose: () => void;
    onSelect: (service: string) => void;
}

export const ServiceModal: React.FC<Props> = ({ onClose, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Restaurant Video Ads',
        timeline: 'ASAP (Rush)',
        budget: '$1,000 - $5,000',
        description: ''
    });

    const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

    useEffect(() => {
        // Trigger fade-in after mount
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('SENDING');

        // 1. Construct the Email Body
        const subject = `ORDER: ${formData.serviceType} - ${formData.name}`;
        const body = `
OFFICIAL PROJECT REQUEST
------------------------------------------------
CLIENT: ${formData.name}
EMAIL: ${formData.email}
PHONE: ${formData.phone}
SERVICE: ${formData.serviceType}
TIMELINE: ${formData.timeline}
BUDGET RANGE: ${formData.budget}

MISSION BRIEF:
${formData.description}

------------------------------------------------
Sent via Imanostradamus Nexus Interface
        `.trim();

        // 2. Open Email Client
        const mailtoLink = `mailto:imamartin81@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        // 3. Update UI and Notify Chat
        setTimeout(() => {
            setFormStatus('SENT');
            // Also notify the internal chat bot for immersion
            onSelect(`${formData.serviceType} for ${formData.name} (Budget: ${formData.budget})`);
        }, 1500);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Star generation for the looping background
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

                <div className="p-8 md:p-12 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="font-syncopate text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-galaxy-pink">
                                INITIATE PROJECT
                            </h2>
                            <p className="font-rajdhani text-galaxy-cyan text-sm md:text-base mt-1 tracking-wide">
                                // SECURE ORDER TERMINAL
                            </p>
                        </div>
                        <button onClick={handleClose} className="text-white/50 hover:text-galaxy-pink font-bold text-3xl transition-colors">
                            &times;
                        </button>
                    </div>

                    {formStatus === 'SENT' ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_#22c55e]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#22c55e" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h3 className="font-syncopate text-2xl text-white font-bold mb-2">TRANSMISSION SENT</h3>
                            <p className="font-rajdhani text-gray-300">Your order has been encrypted and emailed to HQ.<br/>Check your email client to confirm delivery.</p>
                            <button 
                                onClick={handleClose}
                                className="mt-8 px-8 py-3 bg-galaxy-cyan text-black font-syncopate font-bold text-xs rounded hover:bg-white transition-colors"
                            >
                                CLOSE TERMINAL
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Client / Company</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter identification..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Email Address</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="contact@example.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Phone & Timeline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Phone Number</label>
                                    <input 
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Timeline</label>
                                    <select 
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors appearance-none"
                                    >
                                        <option value="ASAP (Rush)">ASAP (Rush)</option>
                                        <option value="1-2 Weeks">1-2 Weeks</option>
                                        <option value="1 Month">1 Month</option>
                                        <option value="Flexible">Flexible</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Service Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Target Service</label>
                                    <select 
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors appearance-none"
                                    >
                                        <option value="Restaurant Video Ads">Restaurant Video Ads</option>
                                        <option value="Bar / Nightlife Promos">Bar / Nightlife Promos</option>
                                        <option value="Web Design (3D/Futuristic)">Web Design (3D/Futuristic)</option>
                                        <option value="App Development">App Development</option>
                                        <option value="AI Image Generation">AI Image Generation</option>
                                        <option value="Menu Engineering">Menu Engineering (ROI)</option>
                                        <option value="Brand Identity">Brand Identity</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Budget Allocation</label>
                                    <select 
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors appearance-none"
                                    >
                                        <option value="Under $1,000">Under $1,000</option>
                                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                        <option value="$10,000+">$10,000+</option>
                                        <option value="Custom / Undefined">Custom / Undefined</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-syncopate text-[10px] text-galaxy-cyan tracking-widest">Mission Brief / Details</label>
                                <textarea 
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your goals, timeline, and specific requirements..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-rajdhani focus:border-galaxy-pink focus:outline-none focus:bg-white/5 transition-colors h-24 resize-none placeholder:text-white/20"
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={formStatus === 'SENDING'}
                                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-galaxy-pink to-galaxy-violet p-[1px] mt-4"
                            >
                                <div className="relative bg-black/50 backdrop-blur-sm rounded-xl px-8 py-4 transition-all duration-300 group-hover:bg-transparent flex items-center justify-center gap-3">
                                    {formStatus === 'SENDING' ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-syncopate font-bold text-white text-sm tracking-widest">
                                                ESTABLISHING LINK...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-syncopate font-bold text-white text-sm tracking-widest group-hover:scale-105 transition-transform">
                                                TRANSMIT ORDER VIA EMAIL
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                                {/* Button Glow */}
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl"></div>
                            </button>
                            
                            <p className="text-center text-xs text-gray-500 font-rajdhani">
                                Clicking Transmit will open your default email client with a pre-formatted order request.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};