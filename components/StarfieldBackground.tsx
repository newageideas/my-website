import React, { useEffect, useRef, useState } from 'react';

// --- CONSTANTS (Moved to module scope to prevent re-declaration crashes) ---
const MAX_WARP_STARS = 5000;
const MAX_GALAXY_STARS = 3000;

const WARP_COLORS = ['#ff0099', '#00f3ff', '#ffffff'];

// Expanded palette: Deep blues, rich purples, and subtle pinks/magentas
const GALAXY_COLORS = [
    '#0f172a',
    '#172554',
    '#1e1b4b',
    '#312e81',
    '#4338ca',
    '#2e1065',
    '#4c1d95',
    '#581c87',
    '#3b0764',
    '#701a75',
    '#831843',
    '#9d174d',
    '#be185d',
    '#4a044e',
    '#1e3a8a',
];

export const StarfieldBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI State for Density Controls
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [warpDensity, setWarpDensity] = useState(1000);
    const [galaxyDensity, setGalaxyDensity] = useState(500);

    // Refs to access latest state in animation loop without re-triggering effect
    const warpDensityRef = useRef(warpDensity);
    const galaxyDensityRef = useRef(galaxyDensity);

    useEffect(() => {
        warpDensityRef.current = warpDensity;
        galaxyDensityRef.current = galaxyDensity;
    }, [warpDensity, galaxyDensity]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Optimize context creation
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // --- PERFORMANCE OPTIMIZATION: TypedArrays ---
        
        // WARP STARS DATA STRUCTURE
        // Stride = 4: [x, y, z, colorIndex]
        const warpData = new Float32Array(MAX_WARP_STARS * 4); 

        // GALAXY STARS DATA STRUCTURE
        // Stride = 6: [x, y, size, baseAlpha, speed, twinkleOffset]
        const galaxyData = new Float32Array(MAX_GALAXY_STARS * 6);
        const galaxyColorIndices = new Uint8Array(MAX_GALAXY_STARS);
        
        // INITIALIZATION
        // 1. Init Warp Stars
        for (let i = 0; i < MAX_WARP_STARS; i++) {
            const i4 = i * 4;
            warpData[i4] = Math.random() * width - width / 2;      // x
            warpData[i4 + 1] = Math.random() * height - height / 2;// y
            warpData[i4 + 2] = Math.random() * width;              // z
            
            // Color Logic
            const r = Math.random();
            warpData[i4 + 3] = r > 0.8 ? 0 : r > 0.6 ? 1 : 2;      // colorIndex
        }

        // 2. Init Galaxy Stars
        for (let i = 0; i < MAX_GALAXY_STARS; i++) {
            const i6 = i * 6;
            galaxyData[i6] = Math.random() * width;                // x
            galaxyData[i6 + 1] = Math.random() * height;           // y
            galaxyData[i6 + 2] = Math.random() * 2 + 0.5;          // size
            galaxyData[i6 + 3] = Math.random() * 0.6 + 0.2;        // baseAlpha
            galaxyData[i6 + 4] = Math.random() * 0.1 + 0.02;       // speed
            galaxyData[i6 + 5] = Math.random() * 100;              // twinkleOffset
            
            galaxyColorIndices[i] = Math.floor(Math.random() * GALAXY_COLORS.length);
        }

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.02;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Access current density settings
            const currentGalaxyCount = Math.min(galaxyDensityRef.current, MAX_GALAXY_STARS);
            const currentWarpCount = Math.min(warpDensityRef.current, MAX_WARP_STARS);

            // --- RENDER GALAXY STARS ---
            for (let i = 0; i < currentGalaxyCount; i++) {
                const i6 = i * 6;
                
                // Update Position
                galaxyData[i6] -= galaxyData[i6 + 4]; // x -= speed
                
                // Wrap around
                if (galaxyData[i6] < 0) {
                    galaxyData[i6] = width;
                    galaxyData[i6 + 1] = Math.random() * height;
                }

                // Calculate Alpha
                const twinkle = Math.sin(time + galaxyData[i6 + 5]); 
                const alpha = Math.max(0.1, Math.min(1, galaxyData[i6 + 3] + (twinkle * 0.2)));

                // Draw
                ctx.beginPath();
                ctx.arc(galaxyData[i6], galaxyData[i6 + 1], galaxyData[i6 + 2], 0, Math.PI * 2);
                ctx.fillStyle = GALAXY_COLORS[galaxyColorIndices[i]];
                ctx.globalAlpha = alpha;
                ctx.fill();
            }

            // --- RENDER WARP STARS ---
            ctx.save();
            ctx.translate(width / 2, height / 2);

            for (let i = 0; i < currentWarpCount; i++) {
                const i4 = i * 4;
                
                // Update Z (Move towards camera)
                warpData[i4 + 2] -= 1.5; 
                
                // Reset if behind camera
                if (warpData[i4 + 2] <= 0) {
                    warpData[i4 + 2] = width;
                    warpData[i4] = Math.random() * width - width / 2;
                    warpData[i4 + 1] = Math.random() * height - height / 2;
                }

                const z = warpData[i4 + 2];
                const x = warpData[i4] / (z / width);
                const y = warpData[i4 + 1] / (z / width);
                
                const size = Math.max(0.1, (1 - z / width) * 2.5);
                const opacity = (1 - z / width);

                // Only draw if within reasonable bounds (optimization)
                if (x > -width/2 && x < width/2 && y > -height/2 && y < height/2) {
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = WARP_COLORS[Math.floor(warpData[i4 + 3])];
                    ctx.globalAlpha = opacity;
                    ctx.fill();
                }
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas 
                ref={canvasRef} 
                className="fixed inset-0 pointer-events-none mix-blend-screen z-[1]"
            />

            {/* Config Panel Toggle */}
            <div className="fixed bottom-6 left-6 z-[60] font-rajdhani">
                <button 
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className={`w-10 h-10 rounded-full border border-galaxy-cyan/30 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isConfigOpen ? 'bg-galaxy-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'bg-black/40 text-galaxy-cyan hover:bg-galaxy-cyan hover:text-black'}`}
                    title="Visual Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                </button>

                {/* Popout Panel */}
                {isConfigOpen && (
                    <div className="absolute bottom-14 left-0 w-64 p-5 rounded-xl bg-black/80 backdrop-blur-xl border border-galaxy-cyan/20 shadow-[0_0_30px_rgba(0,243,255,0.1)] animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <h3 className="font-syncopate text-[10px] text-galaxy-cyan mb-5 tracking-widest border-b border-white/10 pb-2 flex justify-between items-center">
                            SYSTEM VISUALS
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                        </h3>
                        
                        {/* Warp Density Slider */}
                        <div className="mb-6 group">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium group-hover:text-white transition-colors">
                                <span>WARP VELOCITY</span>
                                <span className="text-galaxy-pink font-bold">{Math.round((warpDensity / 3000) * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="3000" 
                                value={warpDensity} 
                                onChange={(e) => setWarpDensity(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galaxy-pink hover:accent-white transition-all"
                            />
                        </div>

                        {/* Galaxy Density Slider */}
                        <div className="group">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium group-hover:text-white transition-colors">
                                <span>GALAXY DENSITY</span>
                                <span className="text-galaxy-cyan font-bold">{Math.round((galaxyDensity / 2000) * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="2000" 
                                value={galaxyDensity} 
                                onChange={(e) => setGalaxyDensity(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-galaxy-cyan hover:accent-white transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};