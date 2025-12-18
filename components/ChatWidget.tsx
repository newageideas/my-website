import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { GoogleGenAI } from "@google/genai";

export interface ChatWidgetHandle {
    open: () => void;
    sendMessage: (text: string) => void;
}

interface Message {
    role: string;
    text: string;
    isAuth?: boolean;
}

export const ChatWidget = forwardRef<ChatWidgetHandle, {}>((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "NEXUS ONLINE! 🚀 Want to make massive profits? Let's go!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading, isOpen]);

    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        sendMessage: (text: string) => {
            setIsOpen(true);
            processMessage(text);
        }
    }));

    const handleAuth = async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                setMessages(prev => [...prev, { 
                    role: 'model', 
                    text: "AUTHENTICATION SECURED. RE-INITIALIZING PROTOCOLS... 🚀" 
                }]);
                // Automatically retry logic could go here, but for now we let the user re-engage
            } catch (e) {
                console.error("Auth failed", e);
            }
        }
    };

    const processMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;
        
        const currentMessages = [...messages, { role: 'user', text: textToSend }];
        setMessages(currentMessages);
        setIsLoading(true);
        setInput('');

        try {
            // SECURITY CHECK: Verify if we need to prompt for a key
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    setMessages(prev => [...prev, { 
                        role: 'model', 
                        text: "SECURITY ALERT: API Key required for Neural Link.", 
                        isAuth: true 
                    }]);
                    setIsLoading(false);
                    return;
                }
            }

            // robustly handle API_KEY5 (custom) or API_KEY (standard/AI Studio)
            const apiKey = process.env.API_KEY5 || process.env.API_KEY;
            
            if (!apiKey) {
                throw new Error("API Key (API_KEY5 or API_KEY) missing. Please configure secure key selection.");
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const contents = currentMessages
                .filter(m => !m.isAuth) // Filter out auth prompts from history sent to model
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: contents,
                config: {
                    systemInstruction: "Identity: NEXUS ASSISTANT. Personality: High-energy, confident, deal-closer. Focus: ELIA's services are LOW COST and make HUGE PROFITS (ROI). Style: Very short sentences. Simple words. Lots of emojis. MANDATORY: End every response telling them to 'START A PROJECT NOW!' 🚀",
                    thinkingConfig: { thinkingBudget: 1024 }
                }
            });

            if (response?.text) {
                setMessages(prev => [...prev, { role: 'model', text: response.text }]);
            }
        } catch (error: any) {
            console.error("Cosmic Link Error:", error);
            
            // Handle specific "Key not found" error by prompting for re-selection
            if (error.message?.includes('Requested entity was not found') && window.aistudio) {
                 setMessages(prev => [...prev, { 
                    role: 'model', 
                    text: "CONNECTION LOST. RE-AUTHENTICATION REQUIRED.", 
                    isAuth: true 
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "SIGNAL INTERRUPTED! BUT DON'T STOP! RETRYING... 🚀" }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-rajdhani">
            {isOpen && (
                <div className="mb-6 w-80 md:w-96 h-[550px] flex flex-col overflow-hidden rounded-3xl
                                bg-galaxy-base/80 backdrop-blur-2xl border border-galaxy-pink/50 
                                shadow-[0_0_50px_rgba(255,0,153,0.3)] animate-in slide-in-from-bottom-5">
                    
                    {/* Header */}
                    <div className="p-5 bg-gradient-to-r from-galaxy-pink/20 to-galaxy-violet/20 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-galaxy-cyan rounded-full animate-pulse shadow-[0_0_15px_#00f3ff]"></div>
                            <span className="text-white font-syncopate text-xs font-bold tracking-widest">NEXUS_ASSISTANT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors text-xl">×</button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-lg ${
                                    msg.role === 'user' 
                                    ? 'bg-galaxy-cyan text-black rounded-tr-none' 
                                    : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                                }`}>
                                    {msg.isAuth ? (
                                        <div className="flex flex-col gap-3">
                                            <span className="text-galaxy-pink font-bold">{msg.text}</span>
                                            <button 
                                                onClick={handleAuth}
                                                className="bg-galaxy-pink text-white px-4 py-2 font-syncopate font-bold text-xs rounded shadow-[0_0_10px_#ff0099] hover:bg-white hover:text-black transition-all"
                                            >
                                                SELECT API KEY
                                            </button>
                                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 underline hover:text-galaxy-cyan">
                                                Billing Information
                                            </a>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-galaxy-pink text-xs font-bold animate-pulse pl-2">CALCULATING MAX ROI...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/40 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && processMessage(input)}
                            placeholder="Type here..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-galaxy-cyan/50 placeholder:text-white/20 transition-all"
                        />
                        <button 
                            onClick={() => processMessage(input)}
                            disabled={isLoading || !input.trim()}
                            className="bg-galaxy-pink hover:bg-white hover:text-galaxy-pink text-white font-bold w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_#ff0099]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.4)] transition-all duration-500 hover:scale-110 z-50 ${
                    isOpen ? 'bg-galaxy-base border border-white/20 text-white rotate-180' : 'bg-gradient-to-tr from-galaxy-cyan to-galaxy-pink text-white'
                }`}
            >
                {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                )}
            </button>
        </div>
    );
});